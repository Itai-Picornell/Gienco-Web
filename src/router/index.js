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
import { ROUTE_META, NOT_FOUND_META } from './routeMeta'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { ...ROUTE_META['/'] }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { ...ROUTE_META['/about'] }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { ...ROUTE_META['/products'] }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { ...ROUTE_META['/cart'] }
  },
  // ──────────────────────────────────────────────
  // Flujo de pedidos (requiere sesión iniciada)
  // ──────────────────────────────────────────────
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue'),
    meta: { requiresAuth: true, ...ROUTE_META['/checkout'] }
  },
  {
    path: '/pedido/exito',
    name: 'OrderSuccess',
    component: () => import('../views/OrderSuccess.vue'),
    meta: { ...ROUTE_META['/pedido/exito'] }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { ...ROUTE_META['/login'] }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { ...ROUTE_META['/signup'] }
  },
  {
    path: '/login/reset',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { ...ROUTE_META['/login/reset'] }
  },
  // ──────────────────────────────────────────────
  // Páginas Legales (RGPD)
  // ──────────────────────────────────────────────
  {
    path: '/terminos',
    name: 'TermsOfService',
    component: () => import('../views/TermsOfService.vue'),
    meta: { ...ROUTE_META['/terminos'] }
  },
  {
    path: '/privacidad',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicy.vue'),
    meta: { ...ROUTE_META['/privacidad'] }
  },
  // ──────────────────────────────────────────────
  // Catch-All 404 — DEBE ser la ÚLTIMA ruta
  // ──────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: NOT_FOUND_META
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
