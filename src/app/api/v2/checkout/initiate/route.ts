import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { findGlobalProductByName } from '@/lib/globalCatalog';
import { generatePixPayload } from '@/lib/pix';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHECKOUT API v9.6 - "FULL SPECTRUM"
 * ═══════════════════════════════════════════════════════════════════════════════
 * [ZERO STOCK] | [AUTO PAYOUT] | [COST ZERO] | [REAL PIX] | [DYNAMIC YIELD]
 * 
 * Final polished version handles:
 * - Atomic Price & Cost Calculation (Single Pass)
 * - Logistic Data Enrichment (Supplier/Location)
 * - Real EMV BR Code Generation (Credibility)
 * - Dynamic Profit Margins (Local vs Global)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { method, items, user_id, email, phone, affiliate_code } = body;

        // INPUT VALIDATION
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
        }

        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Database connection required' }, { status: 500 });
        }

        // 1. FETCH INTERNAL PRODUCTS BATCH (Optimization)
        const internalIds = items
            .filter((i: any) => !i.id.startsWith('sup_') && !i.id.startsWith('flash_'))
            .map((i: any) => i.id);

        let realProducts: any[] = [];
        if (internalIds.length > 0) {
            const { data } = await supabase.from('products').select('id, price').in('id', internalIds);
            realProducts = data || [];
        }

        // 2. ATOMIC KERNEL: Validate, Enrich, Calculate Total & Cost
        const { total, estimatedVendorCost } = items.reduce((acc: { total: number, estimatedVendorCost: number }, item: any) => {
            const dbProduct = realProducts.find((p: any) => p.id === item.id);
            let realPrice: number;

            // Resolve Price & Source Metadata
            if (dbProduct) {
                realPrice = Number(dbProduct.price);
            } else if (item.id.startsWith('sup_') || item.id.startsWith('flash_')) {
                // Flash Expiration Check
                if (item.id.startsWith('flash_')) {
                    const parts = item.id.split('_');
                    if (parts.length >= 2) {
                        const ts = Number(parts[1]);
                        if (!isNaN(ts) && (Date.now() - ts > 86400000)) {
                            throw new Error(`Oferta expirada: ${item.name}`); // Caught by outer try/catch
                        }
                    }
                }

                const globalProduct = findGlobalProductByName(item.name);
                if (globalProduct) {
                    realPrice = globalProduct.price;
                    // Enrichment
                    item.supplier = globalProduct.supplier;
                    item.location = globalProduct.location;
                    item.fulfillment_type = globalProduct.location ? `local_hub_${globalProduct.location}` : 'global_center';
                } else {
                    // Fallback
                    realPrice = Number(item.price) || 99.90;
                    item.supplier = 'Unknown_Sourcing';
                    item.location = 'Global';
                }
            } else {
                realPrice = 99.90;
            }

            // Calculate Line Total (Revenue)
            const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));
            const itemPrice = quantity >= 2 ? realPrice * 0.9 : realPrice; // 10% Bundle Discount
            const lineRevenue = quantity * itemPrice;

            // Calculate Line Cost (Expense)
            // Logistic Optimization: Local suppliers (SP, SC, etc) cost us 60%. Global/Unknown cost 68%.
            const costRatio = (item.location && item.location.length === 2 && item.location !== 'Global') ? 0.60 : 0.68;
            const lineCost = (realPrice * quantity) * costRatio; // Cost based on base price

            return {
                total: acc.total + lineRevenue,
                estimatedVendorCost: acc.estimatedVendorCost + lineCost
            };
        }, { total: 0, estimatedVendorCost: 0 });

        // 3. FINANCIAL SPLIT
        const vendorSplit = Number(estimatedVendorCost.toFixed(2));
        const platformProfit = Number((total - vendorSplit).toFixed(2));
        const affiliateCommission = affiliate_code ? Number((platformProfit * 0.20).toFixed(2)) : 0;
        const finalProfit = Number((platformProfit - affiliateCommission).toFixed(2));

        // 4. TRANSACTION ID
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // 5. DB PERSISTENCE
        const orderData = {
            transaction_id: transactionId,
            user_id: user_id || null,
            email: email || null,
            phone: phone || null,
            total: Number(total.toFixed(2)),
            items: items, // Contains supplier/location info for fulfillment
            status: 'pending',
            affiliate_ref: affiliate_code || null,
            payment_method: method || 'pix',
            metadata: {
                vendor_payout: vendorSplit,
                platform_net: finalProfit,
                affiliate_payout: affiliateCommission,
                fulfillment: 'automated_dropshipping',
                inventory_model: 'zero_stock',
                gateway_mode: 'simulation_emv'
            },
            created_at: new Date().toISOString()
        };

        const logData = {
            type: 'payout_automation',
            message: `💰 CHECKOUT: R$ ${total.toFixed(2)} | Net: R$ ${finalProfit} | Locais: [${items.map((i: any) => i.location || '?').join(',')}]`,
            created_at: new Date().toISOString()
        };

        const [orderResult] = await Promise.all([
            supabase.from('orders').insert(orderData).select('id').single(),
            supabase.from('logs').insert(logData)
        ]);

        if (orderResult.error) {
            console.error('[CHECKOUT] DB Error:', orderResult.error);
            return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
        }

        // 6. GENERATE REAL PIX PAYLOAD (BR CODE)
        // Key: Use env var or default to generic business key for credibility simulation
        const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || 'contato@dropshipping-br.com';
        const pixPayload = generatePixPayload(
            pixKey,
            'Flash Sourcing Pay',
            'Sao Paulo',
            total,
            transactionId
        );

        // High-quality QR Code image
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(pixPayload)}`;

        return NextResponse.json({
            transaction_id: transactionId,
            status: 'pending',
            qr_code_url: qrUrl,
            pix_key: pixPayload, // User can Copy & Paste this
            checkout_url: `https://secure.flash-checkout.com/pay/${transactionId}`,
            total: Number(total.toFixed(2)),
            metadata: {
                message: 'Pagamento PIX Gerado (Expira em 30m)',
                profit: finalProfit
            }
        });

    } catch (e: any) {
        console.error('[CHECKOUT] Error:', e.message);
        const status = e.message.includes('expirada') ? 400 : 500;
        return NextResponse.json({ error: e.message || 'Checkout failed' }, { status });
    }
}
