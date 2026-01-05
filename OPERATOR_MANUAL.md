# 📖 Manual do Operador - DropMasters Alpha 2026

Este guia fornece o passo a passo definitivo para você operar a plataforma, otimizar o rendimento e gerar lucro líquido a curto prazo com **Custo Zero** de infraestrutura.

---

## 🏎️ Passo 1: Ativação da Infraestrutura (Build & Deploy)
Antes de vender, sua "Loja Neural" precisa estar online e ultra-rápida.
1. **Garanta as Variáveis**: Verifique se seu `.env.local` possui as chaves do Supabase.
2. **Build de Produção**: Execute `npm run build`. Isso gera as páginas estáticas (SSG) que carregam instantaneamente para o cliente.
3. **Deploy**: Envie para Vercel ou Netlify (Plano Zero). O sistema detectará o ambiente e ajustará as APIs automaticamente.

## 💎 Passo 2: Curadoria de "Produtos Explosivos"
O lucro mora na demanda viral. Use o `MOCK_PRODUCTS` ou o banco do Supabase para inserir itens.
- **Dica Ninja**: Procure produtos que resolvam um problema imediato (ex: Fone Neural com cancelamento de ruído).
- **IA Prediction**: O sistema marca automaticamente produtos com `demand_score > 90` como **VIRAIS**. Foque sua divulgação neles.
- **Estoque Zero**: Não se preocupe com quantidade. Se o fornecedor tem, o sistema vende.

## 💰 Passo 3: Estratégia de Rendimento (Pricing)
Você não precisa calcular lucro manualmente. A IA faz isso:
- **Margem Automática**: O sistema aplica uma margem base de 35% + bônus de demanda.
- **Bundle Logic**: Ofereça "Compre 2, Ganhe 10% de Desconto". O backend já está configurado para calcular isso no Checkout e incentivará o cliente a aumentar o ticket médio.

## 📢 Passo 4: Tráfego e Conversão (Custo Zero)
Para faturar hoje sem gastar em anúncios:
1. **Social Proof Ativo**: O sistema exibe notificações de "Carlos acabou de comprar...". Isso gera confiança imediata.
2. **Neural Signals**: Mantenha a aba da loja aberta para ver os sinais de IA. Se a IA detectar "Alta Demanda", é hora de postar o link no TikTok/Instagram.
3. **Affiliate Bridge**: Ative o `affiliate_code` no checkout para parceiros. Deixe que influenciadores vendam para você em troca de 20% do lucro (35% total - 20% commission = 15% lucro limpo para você por fazer nada).

## 🚀 Passo 5: Automação de Repasse (O Momento do Pix)
Quando o cliente paga:
1. **Confirmação PIX**: O dinheiro cai na sua conta do gateway.
2. **O Gatilho Alpha**: O sistema dispara o `automateDropshipping`.
3. **Log de Auditoria**: Acesse o painel do Supabase -> Tabela `logs` para ver:
   - `[REVENUE]`: Valor da venda.
   - `[AUTO-REPASSE]`: Confirmação de que o pedido foi enviado ao fornecedor.
   - `[PROFIT]`: Seu lucro líquido retido na conta.

---

## 🛠️ Manutenção de Rotina
- **Update de Catálogo**: Semanalmente, mude os produtos no `MOCK_PRODUCTS` para manter a loja fresca.
- **Monitor de Demanda**: Verifique os `logs` do tipo `demand_miss`. Se muitos clientes buscam algo que você não tem, adicione esse item e lucre com a demanda pronta.

---
**DropMasters v10.6 - Seu capital girando em velocidade neural.**
