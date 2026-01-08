'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════
 * CART CONTEXT v9.0 - "QUANTUM CART"
 * ═══════════════════════════════════════════════════════════════
 * [ZERO STOCK] | [AUTO PAYOUT] | [COST ZERO]
 * ═══════════════════════════════════════════════════════════════
 */

import type { CartItem } from '../lib/cartTypes';
export type { CartItem }; // Re-export for convenience if needed, but primary usage is via import

const STORAGE_KEY = 'dropmasters_cart_v2';
const MAX_QUANTITY = 10;
const BUNDLE_DISCOUNT = 0.10; // 10% discount for 2+ items

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    finalTotal: number;
    bundleDiscount: number;
    itemCount: number;
    isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // SAFE LOAD from localStorage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(STORAGE_KEY);
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    // Validate and sanitize cart data
                    const validCart = parsed.filter(item =>
                        item && typeof item.id === 'string' &&
                        typeof item.price === 'number' &&
                        typeof item.quantity === 'number'
                    ).map(item => ({
                        ...item,
                        quantity: Math.min(MAX_QUANTITY, Math.max(1, item.quantity))
                    }));
                    setCart(validCart);
                }
            }
        } catch (e) {
            console.warn('[CART] Failed to parse saved cart, starting fresh');
            localStorage.removeItem(STORAGE_KEY);
        }
        setIsHydrated(true);
    }, []);

    // SAFE SAVE to localStorage (debounced effect)
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            } catch (e) {
                console.warn('[CART] Failed to save cart');
            }
        }
    }, [cart, isHydrated]);

    const addToCart = useCallback((item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                const newQuantity = Math.min(MAX_QUANTITY, existing.quantity + item.quantity);
                return prev.map((i) => i.id === item.id ? { ...i, quantity: newQuantity } : i);
            }
            return [...prev, { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity) }];
        });
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        const safeQuantity = Math.min(MAX_QUANTITY, Math.max(0, quantity));
        if (safeQuantity === 0) {
            setCart((prev) => prev.filter((i) => i.id !== id));
        } else {
            setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: safeQuantity } : i));
        }
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        sessionStorage.removeItem('pending_payment');
    }, []);

    // MEMOIZED CALCULATIONS (Performance)
    const { total, bundleDiscount, finalTotal, itemCount } = useMemo(() => {
        const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discount = cart.reduce((acc, item) =>
            item.quantity >= 2 ? acc + (item.price * item.quantity * BUNDLE_DISCOUNT) : acc
            , 0);
        return {
            total: subtotal,
            bundleDiscount: discount,
            finalTotal: subtotal - discount,
            itemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
        };
    }, [cart]);

    const value = useMemo(() => ({
        cart, addToCart, removeFromCart, updateQuantity, clearCart,
        total, finalTotal, bundleDiscount, itemCount, isHydrated
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, total, finalTotal, bundleDiscount, itemCount, isHydrated]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
