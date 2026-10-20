# Gienco Web

SPA de Vue 3 + Vite, desplegada en S3 (`gienco-web-frontend`) + CloudFront
(`E1EL5105A0D5C`) con `.github/workflows/deploy.yml` en cada push a `main`.
Cada push a `main` despliega la tienda en producción.

## Infraestructura

- **DNS en Cloudflare** (nameservers `*.ns.cloudflare.com` desde 2026-05-07), con
  el proxy activado delante de CloudFront: las respuestas llevan
  `server: cloudflare` + `via: CloudFront`. Cloudflare no cachea HTML ni ficheros
  `no-cache`; solo los assets con hash. La zona de Route 53 `giencoband.com` NO es
  la activa (copia en `infra/dns/route53-giencoband.com-backup.json`).
- En Cloudflare deben existir siempre el CNAME de validación de ACM (renovación
  del certificado) y los 6 CNAME DKIM de SES (eu-west-3), todos "DNS only".
- Correo: SES (eu-west-3) envía como `soporte@giencoband.com`; Cloudflare Email
  Routing recibe y reenvía `soporte@` a Gmail (MX + SPF + DKIM `cf2024-1`
  gestionados por Cloudflare; el resto de direcciones se descarta).
- Cloudflare: SSL Full (strict), TLS mínimo 1.2, Always Use HTTPS, Browser Cache
  TTL "Respect Existing Headers", Rocket Loader desactivado (rompe el SPA).
- CloudFront `E1EL5105A0D5C` en el plan de tarifa plana **Free** (incluye el WAF
  `CreatedByCloudFront-3e4531ee`: IpReputation y KnownBadInputs en Block,
  CommonRuleSet en Count). Cabeceras: `Managed-SecurityHeadersPolicy`.
- Páginas de error 403/404 → `/404.html` con estado 404.

## SEO / `/seo-check`

- Producción: `https://giencoband.com` (sin `www`) — usar como `--compare`.
- Auditar el build, no `npm run dev`:
  `npm run seo:serve` → `http://localhost:4173`.
- El SEO de cada ruta (título, descripción, `noindex`) vive en
  `src/router/routeMeta.js`. El build genera `dist/<ruta>/index.html` con ese
  `<head>` y una `dist/404.html` (plugin `routeHtmlPages` en `vite.config.js`).
  Toda ruta nueva del router necesita su entrada ahí o responderá 404.
- CloudFront Function `gienco-viewer-request` (`infra/cloudfront/viewer-request.js`, se publica a mano):
  `www` → apex, `/ruta/` e `/index.html` → 301 sin barra, y `/ruta` →
  `/ruta/index.html`. `vite preview` ejecuta ese mismo archivo y emula la 404,
  así que local y producción se comportan igual.
- Hallazgos esperados del crawler: `NO_H1` / `THIN_INITIAL_HTML` (el contenido
  se renderiza en cliente) y `/cart`, `/login`, `/signup` bloqueadas en
  robots.txt + `noindex` (intencionado).
- Ejemplo: `/seo-check http://localhost:4173 https://giencoband.com / /about /products /terminos /privacidad`
