import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTE_META, NOT_FOUND_META } from './src/router/routeMeta.js'
import { buildHead, injectHead, SITE_URL } from './src/utils/seo.js'

/**
 * Genera en el build un index.html por ruta (dist/about/index.html, ...) con
 * su <head> propio (title, description, canonical, og, robots) y una 404.html.
 * El JS es el mismo SPA; solo cambia el HTML inicial, que es lo que leen
 * Google y las redes sociales antes de ejecutar JavaScript.
 */
function routeHtmlPages() {
  let outDir
  return {
    name: 'route-html-pages',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const [path, meta] of Object.entries(ROUTE_META)) {
        const file = path === '/' ? join(outDir, 'index.html') : join(outDir, path, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, injectHead(template, buildHead(path, meta)))
      }
      writeFileSync(join(outDir, '404.html'), injectHead(template, buildHead('/404', NOT_FOUND_META)))
    },
  }
}

/**
 * Ejecuta en `vite preview` la misma CloudFront Function que producción
 * (infra/cloudfront/viewer-request.js) y emula la página de error 404, para
 * que las auditorías SEO locales vean lo mismo que Googlebot.
 */
function cloudfrontFunctionPreview() {
  return {
    name: 'cloudfront-function-preview',
    configurePreviewServer(server) {
      const outDir = resolve(server.config.root, server.config.build.outDir)
      const source = readFileSync(
        fileURLToPath(new URL('./infra/cloudfront/viewer-request.js', import.meta.url)),
        'utf8',
      )
      const handler = new Function(`${source}; return handler`)()

      server.middlewares.use((req, res, next) => {
        const [uri, query = ''] = req.url.split('?')
        const querystring = {}
        for (const pair of query.split('&').filter(Boolean)) {
          const [key, ...value] = pair.split('=')
          querystring[key] = { value: value.join('=') }
        }
        const result = handler({
          request: { uri, querystring, headers: { host: { value: new URL(SITE_URL).host } } },
        })
        if (result.statusCode) {
          res.statusCode = result.statusCode
          res.setHeader('Location', result.headers.location.value.replace(SITE_URL, ''))
          return res.end()
        }
        if (!existsSync(join(outDir, decodeURIComponent(result.uri)))) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end(readFileSync(join(outDir, '404.html')))
        }
        req.url = result.uri + (query ? `?${query}` : '')
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    routeHtmlPages(),
    cloudfrontFunctionPreview(),
  ],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Función de configuración de Rollup para dividir chunks manualmente.
         * Agrupa todas las dependencias de 'node_modules' en un chunk 'vendor' para mejorar caché.
         * 
         * @param {string} id - ID del módulo (ruta del archivo).
         * @returns {string|void} Nombre del chunk 'vendor' si coincide, o undefined.
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  }
})
