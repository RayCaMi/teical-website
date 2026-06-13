// Em produção, defina VITE_API_URL no ambiente de build (Cloudflare Pages)
export const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
