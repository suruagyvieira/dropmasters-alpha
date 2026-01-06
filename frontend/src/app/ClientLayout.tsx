'use client';

import React, { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NeuralSignal from "@/components/NeuralSignal";
import SocialProof from "@/components/SocialProof";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";
import AIChatBot from "@/components/AIChatBot";
import AffiliateTracker from "@/components/AffiliateTracker";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Neural Warm-up: Acorda o backend no Render Free Tier instantaneamente
    useEffect(() => {
        const wakeup = async () => {
            try {
                await fetchApi('/api/v2/health');
                console.log("Quantum Engine Warmer: Active");
            } catch (e) {
                // Silent fail
            }
        };
        wakeup();
    }, []);

    return (
        <AuthProvider>
            <CartProvider>
                <Header />
                <main style={{ marginTop: 'calc(var(--header-height) + 2rem)' }}>
                    {children}
                </main>
                <Footer />
                <NeuralSignal />
                <SocialProof />
                <AIChatBot />
                <AffiliateTracker />
            </CartProvider>
        </AuthProvider>
    );
}
