# Cloudflare Pages Configuration

This project is deployed using Cloudflare Pages.

## Build Configuration

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** 22.x

## Environment Variables

Set the following in Cloudflare Pages dashboard:
- No environment variables required for basic deployment

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
