# Cloudflare Pages Configuration

This project is deployed using Cloudflare Pages.

## Build Configuration

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** 22.x

## Environment Variables

Set the following in Cloudflare Pages dashboard:
- `VITE_API_URL` — URL do backend em produção (ex: `https://teical-api.onrender.com`).
  Sem ela, o build usa `http://127.0.0.1:8000` (apenas desenvolvimento local).

## Local Development

```bash
npm install
npm run build
npm run preview
```

## Deployment

Connect your repository to Cloudflare Pages:
1. Go to https://dash.cloudflare.com/
2. Select your account and navigate to Pages
3. Connect your GitHub repository
4. Set build command to: `npm run build`
5. Set publish directory to: `dist`
6. Deploy!
