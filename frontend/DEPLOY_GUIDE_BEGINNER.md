# 🚀 Guia de Lançamento Nuvem (Iniciante) - DropMasters Alpha 2026

Parabéns! Você está prestes a colocar seu motor de lucro online. Para seguir o modelo de **Custo Zero**, utilizaremos a combinação **Vercel** (Hospedagem) + **Supabase** (Banco de Dados).

---

## 1. Criando o Banco de Dados (Supabase - Grátis)
O Supabase será o "cérebro" que guarda seus produtos e pedidos.
1. Vá para [supabase.com](https://supabase.com/) e crie uma conta gratuita.
2. Clique em **"New Project"**.
3. Escolha um nome (ex: `dropmasters-db`) e uma senha forte. **Anote a senha!**
4. Aguarde o projeto ser criado (1-2 minutos).
5. **PASSO CRUCIAL (SQL)**: No menu lateral esquerdo, clique em **"SQL Editor"**.
   - Clique em **"New Query"**.
   - Abra o arquivo `supabase_schema.sql` que eu criei para você nesta pasta.
   - Copie todo o conteúdo e cole no editor do Supabase.
   - Clique em **"Run"**. Isso vai criar as gavetas (tabelas) onde os dados serão guardados.
6. No menu lateral, vá em **Project Settings** -> **API**.
7. Você verá duas informações cruciais:
   - **Project URL** (Algo como `https://xyz.supabase.co`)
   - **Anon Key** (Uma string longa de letras e números)
   *Mantenha essa aba aberta.*

---

## 2. Preparando seu Código (GitHub)
Para a Vercel ler seu site, ele precisa estar no GitHub.
1. Crie uma conta em [github.com](https://github.com/).
2. Crie um novo repositório chamado `minha-loja-drop`.
3. Siga as instruções no seu computador (ou use o GitHub Desktop) para subir o código desta pasta para lá.
   - *Nota: O arquivo `.env.local` não sobe para o GitHub por segurança (ele está no `.gitignore`). Isso é correto!*

---

## 3. Colocando no Ar (Vercel - Grátis)
A Vercel é a casa do seu site.
1. Vá para [vercel.com](https://vercel.com/) e conecte com sua conta do GitHub.
2. Clique em **"Add New"** -> **"Project"**.
3. Importe o repositório `minha-loja-drop` que você acabou de criar.
4. **IMPORTANTE: Configure as Variáveis de Ambiente!**
   Antes de clicar em "Deploy", abra a seção **Environment Variables** e adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Cole a URL do Supabase do Passo 1)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Cole a Anon Key do Passo 1)
   - `NEXT_PUBLIC_API_URL` = (Deixe em branco por enquanto ou cole a URL que a Vercel vai te dar depois).
5. Clique em **"Deploy"**.

---

## 4. O Toque Final: Banco de Dados Automático
O seu sistema DropMasters tem uma função de **Auto-Seed**. 
1. Assim que o site ficar pronto, a Vercel te dará um link (ex: `minha-loja.vercel.app`).
2. Acesse esse link.
3. No momento em que você carregar a página pela primeira vez, o sistema detectará que o banco de dados do Supabase está vazio e **criará automaticamente** as tabelas e os produtos iniciais que configuramos.
4. Vá ao painel do Supabase, clique em **Table Editor** e veja a mágica: a tabela `products` estará lá com seus itens prontos para venda.

---

## 📈 Verificação de Sucesso
- [ ] O site carrega em menos de 1 segundo? (ISR está funcionando).
- [ ] Os produtos aparecem na tela? (Conexão Supabase OK).
- [ ] O chat da IA responde? (API Route OK).

**Agora você tem uma infraestrutura de nível mundial rodando por R$ 0,00 por mês.**  
O próximo passo é apenas divulgar seu link e deixar a automação de repasse cuidar do resto!

---
*Dúvidas? Consulte o OPERATOR_MANUAL.md para saber como gerenciar as vendas.*
