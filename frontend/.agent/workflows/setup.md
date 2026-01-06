---
description: Como configurar e rodar o projeto DropMasters
---

Este workflow guia você na configuração inicial do projeto DropMasters.

### 1. Configurar Supabase
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Crie um novo projeto.
3. Vá em **SQL Editor** -> **New query**.
4. Copie o conteúdo do arquivo `supabase_schema.sql` e execute.
5. Em **Project Settings** -> **API**, pegue o `Project URL` e o `anon public` key.
6. Em **Project Settings** -> **API**, pegue o `service_role` secret key (apenas para o backend).

### 2. Configurar Variáveis de Ambiente

#### Backend
1. Vá para a pasta `backend`.
2. Renomeie `.env.example` para `.env`.
3. Preencha os valores:
   - `SUPABASE_URL`: Sua URL do projeto.
   - `SUPABASE_SERVICE_ROLE_KEY`: Sua chave service_role.

#### Frontend
1. Vá para a pasta `frontend`.
2. Renomeie `.env.local.example` para `.env.local`.
3. Preencha os valores:
   - `NEXT_PUBLIC_SUPABASE_URL`: Sua URL do projeto.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua chave anon public.
   - `NEXT_PUBLIC_API_URL`: `http://localhost:5000` (padrão do backend).

### 3. Instalar e Rodar

// turbo
#### Backend
1. `cd backend`
2. `python -m pip install -r requirements.txt`
3. `python app.py`

// turbo
#### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Agora você pode acessar `http://localhost:3000` para ver sua loja!
