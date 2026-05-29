// Siempre pasamos por el proxy /meshy-cdn para evitar CORS al cargar GLBs:
// - local: lo resuelve el proxy de Vite (vite.config.ts)
// - producción: la Rewrite Rule de Render reenvía /meshy-cdn/* → https://assets.meshy.ai/*
export const meshyUrl = (url: string): string =>
  url.replace('https://assets.meshy.ai', '/meshy-cdn');
