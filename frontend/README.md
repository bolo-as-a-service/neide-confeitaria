# Neide Confeitaria — Frontend

Cardápio digital, checkout de convidado e painel administrativo (Next.js 16, React 19, Tailwind 4).

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint     # eslint (deve passar sem erros)
npm test         # vitest
```

Pré-requisito: backend Spring ( `backend/flask-backend`, porta 5000 ) ou modo mock (abaixo).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` (ignorado pelo git):

| Variável              | Dev                  | Produção                          |
| --------------------- | -------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | `https://apineide.gsrodriguesz.me` |
| `NEXT_PUBLIC_USE_MOCK`| `true` (dados fictícios) | `false` (mock desativado no build) |

`NEXT_PUBLIC_USE_MOCK=true` usa `lib/mock-data.ts` (100% fictício) e só vale
em desenvolvimento — o build de produção nunca usa o mock.

## Autenticação

Login/registro retornam JWT; o token vai no header `Authorization: Bearer`
de todas as chamadas e o papel exibido vem do `GET /auth/me` (lido do banco
no servidor). O proxy de `/admin` é só UX — a autorização real é o backend
(401/403). Nunca confie em papel guardado no navegador.

## Estrutura

- `app/` — rotas: `cardapio`, `carrinho`, `login`, `register`,
  `meus-pedidos`, `pedido-confirmado`, `admin/{menu,pedidos,extra}`.
- `components/menu|admin|ui` — UI do cardápio, do painel e primitivos.
- `lib/` — `api.ts` (cliente HTTP + token + timeout), `auth-context.tsx`,
  `cart-*` (carrinho + localStorage), `checkout.ts` (validação),
  `product-image.ts` (resolução de imagens), `store-settings.ts`.
