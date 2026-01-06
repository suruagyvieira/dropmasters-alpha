import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { findGlobalProductByName } from '@/lib/globalCatalog';
import { generatePixPayload } from '@/lib/pix';

export const dynamic = 'force-dynamic'; // CRITICAL: Ensure Vercel treats this as dynamic (no caching of timestamps)

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHECKOUT API v9.7 - "NEURAL NETWORK SOURCING"
 * ═══════════════════════════════════════════════════════════════════════════════
 * [ZERO STOCK] | [AUTO PAYOUT] | [COST ZERO] | [REAL PIX] | [LOCAL PRIORITY]
 * 
 * V9.7 Changelog:
 * - Fixed: Internal DB products now correctly inherit fallback Supplier/Location.
 * - Perf: Explicit Dynamic mode for Vercel serverless stability.
 * - Logic: Automação de Repasse with Region Prioritization (SP/SC/PR boost).
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
            throw new Error('Database connection failed');
        }

        // 1. FETCH INTERNAL PRODUCTS BATCH (Optimization)
        const internalIds = items
            .filter((i: any) => !i.id.startsWith('sup_') && !i.id.startsWith('flash_'))
            .map((i: any) => i.id);

        let dbMap = new Map();
        if (internalIds.length > 0) {
            // Performance: Fetching base_price for accurate Payout Automation
            const { data, error } = await supabase.from('products').select('id, price, base_price, metadata').in('id', internalIds);
            if (!error && data) {
                data.forEach((p: any) => dbMap.set(p.id, p));
            }
        }

        // 2. ATOMIC KERNEL: Validate, Enrich, Calculate Total & Cost
        const { total, totalCost, enrichedItems } = items.reduce((acc: any, item: any) => {
            const dbProduct = dbMap.get(item.id);
            let unitPrice: number;
            let unitCost: number;

            // LOGIC FIX: Enrichment & Regional Priority
            if (dbProduct) {
                unitPrice = Number(dbProduct.price);
                unitCost = Number(dbProduct.base_price) || (unitPrice * 0.65); // Fallback margin 35%

                const meta = dbProduct.metadata || {};
                item.supplier = meta.supplier || 'Estoque_Nacional_Master';
                item.location = meta.location || 'SP';
            } else {
                // Global/Flash Logic (Estoque Zero)
                const globalProduct = findGlobalProductByName(item.name);
                unitPrice = globalProduct ? globalProduct.price : (Number(item.price) || 99.90);

                // Priorização Local para Global Catalog
                const loc = globalProduct?.location || 'Global';
                const isPriorityRegion = ['SP', 'SC', 'PR', 'MG'].includes(loc);

                // Repasse Automatizado: Custo baseado na região
                unitCost = isPriorityRegion ? (unitPrice * 0.60) : (unitPrice * 0.68);

                item.supplier = globalProduct?.supplier || 'Sourcing_Network_V9';
                item.location = loc;
            }

            const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));
            const discountedPrice = quantity >= 2 ? unitPrice * 0.9 : unitPrice;
            const lineRevenue = quantity * discountedPrice;
            const lineCost = quantity * unitCost;

            item.final_price = discountedPrice;
            item.cost_basis = lineCost;
            item.is_priority_fulfilment = ['SP', 'SC'].includes(item.location);

            return {
                total: acc.total + lineRevenue,
                totalCost: acc.totalCost + lineCost,
                enrichedItems: [...acc.enrichedItems, item]
            };
        }, { total: 0, totalCost: 0, enrichedItems: [] });

        // 3. FINANCIAL SPLIT (Automação de Repasse)
        const vendorSplit = Number(totalCost.toFixed(2));
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
            items: enrichedItems,
            status: 'pending',
            affiliate_ref: affiliate_code || null,
            payment_method: method || 'pix',
            metadata: {
                vendor_payout: vendorSplit,
                platform_net: finalProfit,
                affiliate_payout: affiliateCommission,
                inventory_model: 'zero_stock',
                payout_automation: 'scheduled',
                payout_priority: enrichedItems.some((i: any) => i.is_priority_fulfilment) ? 'high' : 'standard',
                region_focus: enrichedItems.map((i: any) => i.location)
            },
            created_at: new Date().toISOString()
        };

        const logData = {
            type: 'payout_automation',
            message: `💰 PAYOUT: R$ ${total.toFixed(2)} | Split: R$ ${vendorSplit} | Net: R$ ${finalProfit}`,
            created_at: new Date().toISOString()
        };

        const [orderResult] = await Promise.all([
            supabase.from('orders').insert(orderData).select('id').single(),
            supabase.from('logs').insert(logData)
        ]);

        if (orderResult.error) {
            return NextResponse.json({ error: 'Order failed' }, { status: 500 });
        }

        // 6. GENERATE REAL PIX PAYLOAD
        // Sincronizado com a Chave Oficial do Usuário: CPF 09311538400
        const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || '09311538400';
        const pixPayload = generatePixPayload(
            pixKey,
            'Flash Sourcing V9',
            'Sao Paulo',
            total,
            transactionId
        );

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(pixPayload)}`;

        return NextResponse.json({
            transaction_id: transactionId,
            status: 'pending',
            qr_code_url: qrUrl,
            pix_key: pixPayload,
            checkout_url: `https://secure.flash-checkout.com/pay/${transactionId}`,
            total: Number(total.toFixed(2)),
            metadata: {
                message: 'Pagamento PIX Gerado (Expira em 30m)',
                profit: finalProfit
            }
        });

    } catch (e: any) {
        console.error('[CHECKOUT] Error:', e.message);
        // Robust Error Handling for Build/Runtime Safety
        const isExp = e.message && e.message.includes('expirada');
        return NextResponse.json({ error: e.message || 'Checkout failed' }, { status: isExp ? 400 : 500 });
    }
}
