/**
 * @file seo.js
 * @description Gestión del <head> por ruta para el SPA.
 *
 * Como la web se renderiza en cliente, Google (que ejecuta JS) sí ve estos
 * valores actualizados en cada navegación. Los meta estáticos comunes
 * (og:image, og:site_name, twitter:card, JSON-LD) viven en index.html para
 * que también los lean los crawlers que NO ejecutan JS (WhatsApp, redes...).
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

/**
 * Aplica los metadatos de la ruta activa al <head>.
 * Lee `route.meta.title`, `route.meta.description` y `route.meta.noindex`.
 * @param {import('vue-router').RouteLocationNormalized} route
 */
export function applyRouteHead(route) {
    if (typeof document === 'undefined') return

    const meta = route.meta || {}
    const title = meta.title || DEFAULT_TITLE
    const description = meta.description || DEFAULT_DESCRIPTION
    const url = SITE_URL + (route.path === '/' ? '/' : route.path)

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
    setMeta(
        'name',
        'robots',
        meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    )
}
