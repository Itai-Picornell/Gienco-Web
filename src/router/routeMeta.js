/**
 * @file routeMeta.js
 * @description Metadatos SEO de cada ruta (título, descripción, noindex).
 *
 * Módulo de datos puro (sin imports de Vue) que se usa en dos sitios:
 *   - src/router/index.js → `route.meta` → `applyRouteHead()` en el navegador.
 *   - vite.config.js      → genera en el build un index.html por ruta con el
 *                           <head> correcto, que es lo que leen Google y las
 *                           redes sociales ANTES de ejecutar JavaScript.
 *
 * Toda ruta nueva del router debe tener aquí su entrada; si no, el build
 * no generará su HTML y en producción respondería 404.
 */

export const ROUTE_META = {
  '/': {
    title: "Gienco — Rock n' Roll | Web oficial",
    description: "Web oficial de Gienco, banda de rock n' roll. Escucha nuestro álbum «Manifiesto», descubre próximos conciertos y consigue el merchandising oficial.",
  },
  '/about': {
    title: 'Sobre Gienco — La banda',
    description: "Conoce a Gienco: la historia, la música y el directo de la banda detrás del álbum «Manifiesto». Rock n' roll auténtico.",
  },
  '/products': {
    title: 'Merch oficial — Tienda de Gienco',
    description: 'Merchandising oficial de Gienco: camisetas, vinilos y más. Compra segura y envíos desde la web oficial de la banda.',
  },
  '/terminos': {
    title: 'Términos y condiciones — Gienco',
    description: 'Términos y condiciones de uso de la web oficial de Gienco.',
  },
  '/privacidad': {
    title: 'Política de privacidad — Gienco',
    description: 'Política de privacidad y tratamiento de datos (RGPD) de la web oficial de Gienco.',
  },

  // Rutas privadas o de utilidad: no indexar
  '/cart': { title: 'Carrito — Gienco', noindex: true },
  '/checkout': { title: 'Checkout — Gienco', noindex: true },
  '/pedido/exito': { title: 'Pedido confirmado — Gienco', noindex: true },
  '/login': { title: 'Iniciar sesión — Gienco', noindex: true },
  '/signup': { title: 'Crear cuenta — Gienco', noindex: true },
  '/login/reset': { title: 'Restablecer contraseña — Gienco', noindex: true },
}

export const NOT_FOUND_META = { title: 'Página no encontrada — Gienco', noindex: true }
