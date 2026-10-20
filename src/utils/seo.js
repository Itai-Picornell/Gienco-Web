/**
 * @file seo.js
 * @description Gestión del <head> por ruta para el SPA.
 *
 * `buildHead()` calcula los valores de cada ruta y se usa en dos momentos:
 *   - Build: `injectHead()` los escribe en el index.html de cada ruta (plugin
 *     de vite.config.js), así Google y las redes los leen sin ejecutar JS.
 *   - Navegador: `applyRouteHead()` los actualiza en cada navegación del SPA.
 * Los meta comunes (og:image, og:site_name, twitter:card, JSON-LD) viven en
 * index.html y son iguales en todas las rutas.
 */

export const SITE_URL = 'https://giencoband.com'
export const SITE_NAME = 'Gienco'

const DEFAULT_TITLE = "Gienco — Rock n' Roll | Web oficial"
const DEFAULT_DESCRIPTION =
    "Web oficial de Gienco, banda de rock n' roll. Escucha nuestro álbum «Manifiesto», descubre próximos conciertos y consigue el merchandising oficial."

/**
 * Crea o actualiza un <meta> por su atributo identificador (name o property).
 * @param {'name'|'property'} attr
 * @param {string} key
 * @param {string} content
 */
function setMeta(attr, key, content) {
    if (!content) return
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}

/**
 * Crea o actualiza el <link rel="canonical">.
 * @param {string} href
 */
function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]')
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
    }
    el.setAttribute('href', href)
}

const ROBOTS_INDEX = 'index, follow, max-image-preview:large'
const ROBOTS_NOINDEX = 'noindex, nofollow'

/**
 * Calcula los valores del <head> para una ruta.
 * @param {string} path - Ruta sin query (p. ej. '/about').
 * @param {{ title?: string, description?: string, noindex?: boolean }} [meta]
 * @returns {{ title: string, description: string, url: string, robots: string }}
 */
export function buildHead(path, meta = {}) {
    return {
        title: meta.title || DEFAULT_TITLE,
        description: meta.description || DEFAULT_DESCRIPTION,
        url: SITE_URL + (path === '/' ? '/' : path),
        robots: meta.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX,
    }
}

/**
 * Aplica los metadatos de la ruta activa al <head>.
 * Lee `route.meta.title`, `route.meta.description` y `route.meta.noindex`.
 * @param {import('vue-router').RouteLocationNormalized} route
 */
export function applyRouteHead(route) {
    if (typeof document === 'undefined') return

    const { title, description, url, robots } = buildHead(route.path, route.meta)

    document.title = title
    setMeta('name', 'description', description)
    setCanonical(url)

    // Open Graph (título/descr./url cambian por ruta; imagen y site_name son estáticos en index.html)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)

    // Twitter
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    // Rutas privadas o de utilidad: no indexar
    setMeta('name', 'robots', robots)
}

/** Escapa un valor para usarlo dentro de un atributo HTML entre comillas dobles. */
function escapeAttr(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Sustituye en el HTML de index.html los valores del <head> por los de una ruta.
 * Se usa en build time; lanza un error si falta alguna etiqueta para que el
 * build falle en vez de publicar un <head> incompleto.
 * @param {string} html
 * @param {ReturnType<typeof buildHead>} head
 * @returns {string}
 */
export function injectHead(html, head) {
    const title = escapeAttr(head.title)
    const description = escapeAttr(head.description)
    const replacements = [
        [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`],
        [/<meta\s+name="description"[\s\S]*?>/, `<meta name="description" content="${description}">`],
        [/<meta\s+name="robots"[\s\S]*?>/, `<meta name="robots" content="${head.robots}">`],
        [/<link\s+rel="canonical"[\s\S]*?>/, `<link rel="canonical" href="${head.url}">`],
        [/<meta\s+property="og:title"[\s\S]*?>/, `<meta property="og:title" content="${title}">`],
        [/<meta\s+property="og:description"[\s\S]*?>/, `<meta property="og:description" content="${description}">`],
        [/<meta\s+property="og:url"[\s\S]*?>/, `<meta property="og:url" content="${head.url}">`],
        [/<meta\s+name="twitter:title"[\s\S]*?>/, `<meta name="twitter:title" content="${title}">`],
        [/<meta\s+name="twitter:description"[\s\S]*?>/, `<meta name="twitter:description" content="${description}">`],
    ]
    return replacements.reduce((out, [pattern, tag]) => {
        if (!pattern.test(out)) throw new Error(`injectHead: no se encuentra ${pattern} en index.html`)
        return out.replace(pattern, tag)
    }, html)
}
