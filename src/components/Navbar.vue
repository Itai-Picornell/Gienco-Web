<template>
  <!-- Barra de navegación transparente con efecto glassmorphism -->
  <header class="fixed top-0 z-50 w-full bg-black/30 backdrop-blur-lg border-b border-white/10">
    <div class="px-4 md:px-10 lg:px-40 py-4 flex items-center">
      <!-- Logo de la banda (a la izquierda) -->
      <div class="flex items-center text-white mr-8">
        <div class="h-10 flex items-center justify-center">
          <img 
            src="/images/logos/Logo_1x.webp" 
            alt="Gienco Band Logo" 
            width="219" 
            height="70" 
            fetchpriority="high"
            class="h-full w-auto" 
          />
        </div>
      </div>
      
      <!-- Enlaces de navegación principales (centrados) -->
      <nav class="hidden lg:flex flex-1 items-center justify-center gap-8">
        <router-link 
          to="/" 
          class="text-white text-sm font-semibold hover:text-red-600 transition-colors uppercase tracking-wider px-3 py-2 rounded"
          :class="{ 'text-primary': $route.path === '/' }"
        >
          INICIO
        </router-link>
        <router-link 
          to="/about" 
          class="text-white text-sm font-semibold hover:text-red-600 transition-colors uppercase tracking-wider px-3 py-2 rounded"
          :class="{ 'text-primary': $route.path === '/about' }"
        >
          BANDA
        </router-link>
        <router-link 
          to="/products" 
          class="text-white text-sm font-semibold hover:text-red-600 transition-colors uppercase tracking-wider px-3 py-2 rounded"
          :class="{ 'text-primary': $route.path === '/products' }"
        >
          TIENDA
        </router-link>
      </nav>
      
      <!-- Botones de acción a la derecha (carrito a la izquierda, usuario a la derecha) -->
      <div class="hidden lg:flex gap-6 items-center">
        <!-- Icono del carrito con indicador -->
        <router-link to="/cart" class="relative">
          <button class="text-white hover:text-red-600 transition-colors">
            <span class="material-symbols-outlined text-3xl">shopping_cart</span>
          </button>
          <!-- Indicador con el contador -->
          <div v-if="cantidadArticulosCarrito > 0" class="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">{{ cantidadArticulosCarrito }}</span>
          </div>
        </router-link>
        
        <!-- Icono de usuario/login con dropdown -->
        <div class="relative">
          <button 
            v-if="almacenAutenticacion.isAuthenticated && !almacenAutenticacion.isAdmin"
            @click="toggleUserMenu"
            class="text-white hover:text-red-600 transition-colors"
          >
            <span class="material-symbols-outlined text-3xl">person</span>
          </button>
          <router-link v-else to="/login">
            <button class="text-white hover:text-red-600 transition-colors">
              <span class="material-symbols-outlined text-3xl">person</span>
            </button>
          </router-link>

          <!-- User Dropdown Menu -->
          <div 
            v-if="isUserMenuOpen && almacenAutenticacion.isAuthenticated && !almacenAutenticacion.isAdmin"
            class="absolute right-0 top-12 w-72 bg-surface-dark border border-[#392829] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in"
          >
            <!-- User Info Header -->
            <div class="p-4 bg-gradient-to-br from-primary/10 to-transparent border-b border-[#392829]">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-2xl">person</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-bold text-sm truncate">
                    {{ almacenAutenticacion.userAttributes?.given_name || almacenAutenticacion.userAttributes?.name || 'Usuario' }} {{ almacenAutenticacion.userAttributes?.family_name || '' }}
                  </p>
                  <p class="text-gray-400 text-xs truncate">
                    {{ almacenAutenticacion.userAttributes?.email || almacenAutenticacion.user?.signInDetails?.loginId || 'email@ejemplo.com' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Logout Button -->
            <div class="p-2">
              <button 
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-600/20 rounded-lg transition-colors group"
              >
                <span class="material-symbols-outlined text-xl group-hover:text-red-600">logout</span>
                <span class="font-medium text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Botón Admin (más discreto) -->
        <router-link :to="estaAdministradorAutenticado ? '/admin' : '/admin-login'">
          <button class="text-white hover:text-red-600 transition-colors">
            <span class="material-symbols-outlined text-2xl">
              {{ estaAdministradorAutenticado ? 'admin_panel_settings' : 'lock' }}
            </span>
          </button>
        </router-link>
      </div>
      
      <!-- Icono de menú móvil (visible solo en pantallas pequeñas) -->
      <!-- TODO: Implementar funcionalidad de menú móvil -->
    <div class="lg:hidden text-white ml-auto cursor-pointer" @click="toggleMobileMenu">
        <span class="material-symbols-outlined">menu</span>
      </div>
    </div>

    <!-- Menú Móvil (Desplegable) con Glassmorphism mejorado -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="lg:hidden absolute top-full left-0 w-full bg-black/60 backdrop-blur-xl border-t border-white/20 shadow-2xl"
      >
        <!-- Contenido del menú -->
        <div class="px-6 py-8 flex flex-col gap-4">
          <!-- Enlaces principales -->
          <nav class="flex flex-col gap-2">
            <router-link 
              to="/" 
              class="group flex items-center gap-3 px-4 py-3 text-white text-base font-semibold hover:bg-white/10 rounded-lg transition-all duration-200 uppercase tracking-wider"
              :class="{ 'bg-red-600/20 text-primary border-l-4 border-primary': $route.path === '/' }"
              @click="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-xl">home</span>
              <span>Inicio</span>
            </router-link>
            
            <router-link 
              to="/about" 
              class="group flex items-center gap-3 px-4 py-3 text-white text-base font-semibold hover:bg-white/10 rounded-lg transition-all duration-200 uppercase tracking-wider"
              :class="{ 'bg-red-600/20 text-primary border-l-4 border-primary': $route.path === '/about' }"
              @click="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-xl">group</span>
              <span>Banda</span>
            </router-link>
            
            <router-link 
              to="/products" 
              class="group flex items-center gap-3 px-4 py-3 text-white text-base font-semibold hover:bg-white/10 rounded-lg transition-all duration-200 uppercase tracking-wider"
              :class="{ 'bg-red-600/20 text-primary border-l-4 border-primary': $route.path === '/products' }"
              @click="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-xl">shopping_bag</span>
              <span>Tienda</span>
            </router-link>
          </nav>

          <!-- Divisor -->
          <div class="h-px bg-white/10 my-2"></div>

          <!-- Acciones rápidas -->
          <div class="grid grid-cols-3 gap-3">
            <router-link 
              to="/cart" 
              class="relative flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200" 
              @click="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-2xl text-white">shopping_cart</span>
              <span class="text-white text-xs font-medium">Carrito</span>
              <div v-if="cantidadArticulosCarrito > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ cantidadArticulosCarrito }}</span>
              </div>
            </router-link>
            
            <router-link 
              to="/login" 
              class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200" 
              @click="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-2xl text-white">person</span>
              <span class="text-white text-xs font-medium">Cuenta</span>
            </router-link>

            <router-link 
              :to="estaAdministradorAutenticado ? '/admin' : '/admin-login'" 
              class="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200" 
              @click="isMobileMenuOpen = false"
            >
              <span class="material-symbols-outlined text-2xl text-white">
                {{ estaAdministradorAutenticado ? 'admin_panel_settings' : 'lock' }}
              </span>
              <span class="text-white text-xs font-medium">Admin</span>
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
// Importar computed de Vue para crear propiedades reactivas computadas y ref para estado local
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
// Importar los stores necesarios
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

// Obtener las instancias de los stores
const almacenAutenticacion = useAuthStore()
const almacenCarrito = useCartStore()
const router = useRouter()

// Estado para el menú móvil
const isMobileMenuOpen = ref(false)

// Estado para el menú de usuario
const isUserMenuOpen = ref(false)

// Función para alternar el menú móvil
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Función para alternar el menú de usuario
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// Función para cerrar sesión
const handleLogout = async () => {
  await almacenAutenticacion.logout()
  isUserMenuOpen.value = false
  router.push('/')
}

// Propiedad computada que se recalcula automáticamente cuando cambia almacenAutenticacion.isAuthenticated
const estaAdministradorAutenticado = computed(() => almacenAutenticacion.isAuthenticated)

// Propiedad computada que se recalcula automáticamente cuando cambia el carrito
// Usa el getter totalItems del store de carrito
const cantidadArticulosCarrito = computed(() => almacenCarrito.totalItems)
</script>
