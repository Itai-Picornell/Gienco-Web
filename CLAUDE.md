# Gienco Web

SPA de Vue 3 + Vite, desplegada en S3 (`gienco-web-frontend`) + CloudFront
(`E1EL5105A0D5C`) con `.github/workflows/deploy.yml` en cada push a `main`.
Cada push a `main` despliega la tienda en producción.

## SEO / `/seo-check`

- Producción: `https://giencoband.com` (sin `www`) — usar como `--compare`.
- Auditar el build, no `npm run dev`:
  `npm run seo:serve` → `http://localhost:4173`.
- El SEO de cada ruta (título, descripción, `noindex`) vive en
  `src/router/routeMeta.js`. El build genera `dist/<ruta>/index.html` con ese
  `<head>` y una `dist/404.html` (plugin `routeHtmlPages` en `vite.config.js`).
  Toda ruta nueva del router necesita su entrada ahí o responderá 404.
- CloudFront Function `infra/cloudfront/viewer-request.js` (se publica a mano):
  `www` → apex, `/ruta/` e `/index.html` → 301 sin barra, y `/ruta` →
  `/ruta/index.html`. `vite preview` ejecuta ese mismo archivo y emula la 404,
  así que local y producción se comportan igual.
- Hallazgos esperados del crawler: `NO_H1` / `THIN_INITIAL_HTML` (el contenido
  se renderiza en cliente) y `/cart`, `/login`, `/signup` bloqueadas en
  robots.txt + `noindex` (intencionado).
- Ejemplo: `/seo-check http://localhost:4173 https://giencoband.com / /about /products /terminos /privacidad`
