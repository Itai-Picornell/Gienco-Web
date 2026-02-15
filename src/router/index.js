import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Products from '../views/Products.vue'
import Cart from '../views/Cart.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard: protege rutas que requieren autenticación
router.beforeEach(async (to, from, next) => {
  // 1. Manejo de autenticación general (requiresAuth: true) -> Para Admin
  // 2. Podríamos tener userAuth: true -> Para Checkout

  if (to.meta.requiresAuth) {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()

    // Si no está autenticado, intentamos recuperar sesión
    if (!authStore.isAuthenticated) {
      await authStore.checkAuth()
    }

    // Verificar autenticación básica
    if (!authStore.isAuthenticated) {
      next('/admin-login')
      return
    }

    // Verificar permisos de ADMIN
    if (!authStore.isAdmin) {
      const { useNotificationStore } = await import('../stores/notification')
      const notificationStore = useNotificationStore()
      await notificationStore.alert('No tienes permisos de administrador.', 'Acceso Denegado')
      next('/')
      return
    }

    next()
  } else {
    next()
  }
})

export default router
