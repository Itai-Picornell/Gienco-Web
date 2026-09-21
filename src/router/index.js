import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import ResetPassword from '../views/ResetPassword.vue'
import NotFound from '../views/NotFound.vue'
import { useAuthStore } from '../stores/auth'
import { applyRouteHead } from '../utils/seo'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: "Gienco — Rock n' Roll | Web oficial",
      description: "Web oficial de Gienco, banda de rock n' roll. Escucha nuestro álbum «Manifiesto», descubre próximos conciertos y consigue el merchandising oficial.",
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'Sobre Gienco — La banda',
      description: "Conoce a Gienco: la historia, la música y el directo de la banda detrás del álbum «Manifiesto». Rock n' roll auténtico.",
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      title: 'Merch oficial — Tienda de Gienco',
      description: 'Merchandising oficial de Gienco: camisetas, vinilos y más. Compra segura y envíos desde la web oficial de la banda.',
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: 'Carrito — Gienco', noindex: true }
  },
  // ──────────────────────────────────────────────
  // Flujo de pedidos (requiere sesión iniciada)
  // ──────────────────────────────────────────────
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue'),
    meta: { requiresAuth: true, title: 'Checkout — Gienco', noindex: true }
  },
  {
    path: '/pedido/exito',
    name: 'OrderSuccess',
    component: () => import('../views/OrderSuccess.vue'),
    meta: { title: 'Pedido confirmado — Gienco', noindex: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Iniciar sesión — Gienco', noindex: true }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { title: 'Crear cuenta — Gienco', noindex: true }
  },
  {
    path: '/login/reset',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { title: 'Restablecer contraseña — Gienco', noindex: true }
  },
  // ──────────────────────────────────────────────
  // Páginas Legales (RGPD)
  // ──────────────────────────────────────────────
  {
    path: '/terminos',
    name: 'TermsOfService',
    component: () => import('../views/TermsOfService.vue'),
    meta: {
      title: 'Términos y condiciones — Gienco',
      description: 'Términos y condiciones de uso de la web oficial de Gienco.',
    }
  },
  {
    path: '/privacidad',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicy.vue'),
    meta: {
      title: 'Política de privacidad — Gienco',
      description: 'Política de privacidad y tratamiento de datos (RGPD) de la web oficial de Gienco.',
    }
  },
  // ──────────────────────────────────────────────
  // Catch-All 404 — DEBE ser la ÚLTIMA ruta
  // ──────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Página no encontrada — Gienco', noindex: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

/**
 * Guarda global de autenticación.
 *
 * Bloquea las rutas marcadas con `meta.requiresAuth` redirigiendo a /login
 * con `?redirect=<ruta-original>` para volver al destino tras hacer login.
 *
 * Llamamos a `checkAuth()` antes de decidir porque la sesión de Cognito
 * puede haber expirado entre navegaciones — `isAuthenticated` por sí solo
 * no es fiable después de un periodo de inactividad.
 */
router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true

  const authStore = useAuthStore()
  try {
    await authStore.checkAuth()
  } catch {
    // Si checkAuth lanza (token corrupto, red caída...) tratamos como no autenticado
  }

  if (!authStore.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }

  return true
})

/**
 * Actualiza el <head> (título, description, canonical, Open Graph, robots)
 * con los metadatos de la ruta de destino tras cada navegación.
 */
router.afterEach((to) => {
  applyRouteHead(to)
})

export default router
