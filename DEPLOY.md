# Guia de Deploy - NoPrazo

## Pré-requisitos

1. Conta na Vercel
2. Conta na Supabase
3. Conta no Resend (para emails)

## Passo a Passo

### 1. Configuração do Supabase

**IMPORTANTE**: Para corrigir erros de redirecionamento para `localhost`, você deve configurar as URLs corretamente no painel do Supabase.

1. Vá para **Authentication** > **URL Configuration**.
2. **Site URL**: Defina como a URL da sua aplicação na Vercel (ex: `https://meu-app-noprazo.vercel.app`).
   - *Não use localhost aqui em produção.*
3. **Redirect URLs**: Adicione as seguintes URLs:
   - `http://localhost:5173` (para desenvolvimento local)
   - `https://meu-app-noprazo.vercel.app` (URL exata da produção)
   - `https://meu-app-noprazo.vercel.app/**` (Wildcard se necessário, mas evite se possível)

### 2. Configuração do Vercel

1. Importe o projeto do GitHub.
2. Defina o **Framework Preset** como `Vite`.
3. Adicione as variáveis de ambiente:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_SITE_URL=https://seu-projeto.vercel.app  <-- IMPORTANTE PARA REDIRECTS
```

### 3. Edge Functions

Se você estiver usando Edge Functions (como `send-notification`):

1. Certifique-se de configurar os "Function Secrets" no painel do Supabase ou via CLI:
```bash
supabase secrets set RESEND_API_KEY=re_123456...
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
```

### 4. Build e Deploy

O comando de build padrão é:
```bash
npm run build
```
O diretório de saída é `dist`.

## Troubleshooting

- **Erro 404 ao recarregar página**: Verifique se o `vercel.json` está na raiz com a configuração de rewrites.
- **Redirect para Localhost**: Verifique a **Site URL** no Supabase e se a env var `VITE_SITE_URL` está definida na Vercel.
