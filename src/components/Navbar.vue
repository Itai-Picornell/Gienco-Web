<template>
  <!--
    Cabecera fija con efecto de transparencia. La barra principal es discreta
    en desktop (logo izquierda, nav centro, acciones derecha). En mobile se
    abre como menú fullscreen — wordmark grande y tipografía declarativa.
  -->
  <header class="fixed top-0 z-50 w-full bg-black/40 backdrop-blur-xl border-b border-white/[0.08]">
    <div class="px-4 md:px-10 lg:px-20 py-4 flex items-center">

      <!-- ─── Logo ─────────────────────────────────────────────────────── -->
      <router-link to="/" class="flex items-center text-white mr-8" aria-label="Inicio">
        <div class="h-10 flex items-center justify-center">
          <img
            v-if="logoImage"
            :src="logoImage.url"
            alt="Gienco Band Logo"
            width="219"
            height="70"
            fetchpriority="high"
            class="h-full w-auto"
          />
        </div>
      </router-link>

      <!-- ─── Navegación desktop ──────────────────────────────────────── -->
      <nav class="hidden lg:flex flex-1 items-center justify-center gap-1" aria-label="Navegación principal">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative text-white text-[13px] font-medium hover:text-gold transition-colors px-4 py-2"
          :class="{ 'text-gold': $route.path === item.to }"
        >
          {{ item.label }}
          <span
            v-if="$route.path === item.to"
            class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-px bg-gold"
            aria-hidden="true"
          ></span>
        </router-link>
      </nav>

      <!-- ─── Acciones desktop ────────────────────────────────────────── -->
      <div class="hidden lg:flex items-center gap-1">
        <!-- Carrito -->
        <router-link
          to="/cart"
          class="relative w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors rounded-lg"
          aria-label="Carrito"
        >
          <span class="material-symbols-outlined text-2xl" aria-hidden="true">shopping_cart</span>
          <span
            v-if="cantidadArticulosCarrito > 0"
            class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary rounded-full flex items-center justify-center"
          >
            <span class="text-white text-[10px] font-bold tabular-nums">{{ cantidadArticulosCarrito }}</span>
          </span>
        </router-link>

        <!-- Cuenta / Login -->
        <div class="relative" v-click-outside="closeUserMenu">
          <button
            v-if="almacenAutenticacion.isAuthenticated"
            @click="toggleUserMenu"
            class="w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors rounded-lg"
            aria-label="Cuenta"
            :aria-expanded="isUserMenuOpen"
          >
            <span class="material-symbols-outlined text-2xl" aria-hidden="true">person</span>
          </button>
          <router-link
            v-else
            to="/login"
            class="w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors rounded-lg"
            aria-label="Iniciar sesión"
          >
            <span class="material-symbols-outlined text-2xl" aria-hidden="true">person</span>
          </router-link>

          <!-- Menú usuario (desktop) -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="isUserMenuOpen && almacenAutenticacion.isAuthenticated"
              class="absolute right-0 top-12 w-72 bg-card-dark border border-[#392829] rounded-xl shadow-2xl overflow-hidden"
            >
              <div class="p-4 bg-gradient-to-br from-gold/[0.06] to-transparent border-b border-[#392829]">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-gold text-xl" aria-hidden="true">person</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-semibold text-sm truncate">{{ userDisplayName }}</p>
                    <p class="text-text-muted text-xs truncate">{{ userEmail }}</p>
                  </div>
                </div>
              </div>
              <div class="p-2">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                >
                  <span class="material-symbols-outlined text-lg" aria-hidden="true">logout</span>
                  <span class="text-[13px] font-medium">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- ─── Botón menú mobile ────────────────────────────────────────── -->
      <button
        class="lg:hidden ml-auto w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors rounded-lg"
        @click="openMobileMenu"
        aria-label="Abrir menú"
        :aria-expanded="isMobileMenuOpen"
      >
        <span class="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>
      </button>
    </div>
  </header>

  <!-- ═══════════════════════════════════════════════════════════════════ -->
  <!--  Menú mobile fullscreen — takeover                                  -->
  <!-- ═══════════════════════════════════════════════════════════════════ -->
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 z-[60] bg-black flex flex-col overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
      >
        <!-- Glow decorativo -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div class="absolute top-[-20%] right-[-15%] w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px]"></div>
          <div class="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/[0.05] rounded-full blur-[100px]"></div>
        </div>

        <!-- Top bar — solo el wordmark "GIENCO" mantiene Cinzel Decorative -->
        <header class="relative z-10 flex items-center justify-between px-5 py-5 border-b border-[#392829]">
          <span class="font-display font-black text-xl tracking-[0.32em] text-white uppercase leading-none">
            Gienco
          </span>
          <button
            @click="closeMobileMenu"
            class="w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors"
            aria-label="Cerrar menú"
          >
            <span class="material-symbols-outlined text-2xl" aria-hidden="true">close</span>
          </button>
        </header>

        <!-- Navegación principal — sentence case, peso medio, tamaño contenido -->
        <nav class="relative z-10 flex-1 flex flex-col justify-center px-6 py-8" aria-label="Navegación principal">
          <p class="text-[11px] text-gold/80 mb-6 font-semibold">Navegación</p>
          <ul class="space-y-0.5">
            <li v-for="(item, idx) in navItems" :key="item.to">
              <router-link
                :to="item.to"
                class="group flex items-center gap-4 py-3.5 border-b border-[#1f1515] active:bg-white/[0.02]"
                @click="closeMobileMenu"
              >
                <span
                  class="text-[11px] font-mono text-gold/60 tabular-nums w-7"
                >{{ String(idx + 1).padStart(2, '0') }}</span>
                <span
                  class="flex-1 text-xl font-medium tracking-tight leading-none transition-colors"
                  :class="$route.path === item.to ? 'text-gold' : 'text-white group-active:text-gold'"
                >
                  {{ item.label }}
                </span>
                <span
                  v-if="$route.path === item.to"
                  class="material-symbols-outlined text-gold text-lg"
                  aria-hidden="true"
                >arrow_forward</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Acciones inferiores -->
        <footer class="relative z-10 px-6 py-6 border-t border-[#392829] space-y-5">
          <!-- Información de cuenta si autenticado -->
          <div
            v-if="almacenAutenticacion.isAuthenticated"
            class="flex items-center gap-3 p-4 rounded-xl bg-card-dark border border-[#392829]"
          >
            <div class="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-gold text-xl" aria-hidden="true">person</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm truncate">{{ userDisplayName }}</p>
              <p class="text-text-muted text-xs truncate">{{ userEmail }}</p>
            </div>
          </div>

          <!-- Acciones grid 2 columnas — sentence case, etiquetas pequeñas -->
          <div class="grid grid-cols-2 gap-3">
            <router-link
              to="/cart"
              class="relative flex items-center justify-center gap-2 h-14 rounded-lg bg-card-dark border border-[#392829] hover:border-gold hover:bg-gold/[0.04] transition-colors"
              @click="closeMobileMenu"
            >
              <span class="material-symbols-outlined text-xl text-white" aria-hidden="true">shopping_cart</span>
              <span class="text-[13px] font-semibold text-white">Carrito</span>
              <span
                v-if="cantidadArticulosCarrito > 0"
                class="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-primary rounded-full flex items-center justify-center"
              >
                <span class="text-white text-[10px] font-bold tabular-nums">{{ cantidadArticulosCarrito }}</span>
              </span>
            </router-link>

            <button
              v-if="almacenAutenticacion.isAuthenticated"
              @click="handleLogoutMobile"
              class="flex items-center justify-center gap-2 h-14 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-colors"
            >
              <span class="material-symbols-outlined text-xl text-primary-bright" aria-hidden="true">logout</span>
              <span class="text-[13px] font-semibold text-primary-bright">Cerrar sesión</span>
            </button>
            <router-link
              v-else
              to="/login"
              class="flex items-center justify-center gap-2 h-14 rounded-lg bg-primary border border-primary hover:bg-primary-bright transition-colors"
              @click="closeMobileMenu"
            >
              <span class="material-symbols-outlined text-xl text-white" aria-hidden="true">login</span>
              <span class="text-[13px] font-semibold text-white">Iniciar sesión</span>
            </router-link>
          </div>

          <!-- Pie -->
          <p class="text-center text-text-faint text-[11px] pt-2">
            Gienco &copy; {{ new Date().getFullYear() }} · Rock n' Roll auténtico
          </p>
        </footer>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
/**
 * @file Navbar.vue
 * @description Cabecera de navegación con dos modos:
 *
 *   · Desktop (≥lg): barra delgada glassmorphism. Logo izquierda, nav central,
 *     acciones (carrito, cuenta) a la derecha. Hover dorado, indicador inferior
 *     en la ruta activa.
 *
 *   · Mobile (<lg): botón hamburguesa que abre un menú FULLSCREEN takeover.
 *     Wordmark "GIENCO" en Cinzel Decorative, items grandes con numeración
 *     dorada, acciones (carrito + login/logout) en grid inferior.
 *
 * El logo se carga dinámicamente desde la galería del admin (sección "logos");
 * si la API tarda o falla, se usa el fallback hardcoded.
 */
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { cdnUrl } from '../utils/cdn'
import { useGallery } from '../composables/useGallery'

// ─── Stores ──────────────────────────────────────────────────────────────────

const almacenAutenticacion = useAuthStore()
const almacenCarrito = useCartStore()
const router = useRouter()
const route = useRoute()

// ─── Logo dinámico ───────────────────────────────────────────────────────────

const logoGallery = useGallery('logos', [
  {
    filename: 'logo-gienco-official-gold.webp',
    url: `${cdnUrl}/images/logos/logo-gienco-official-gold.webp`
  }
])
const logoImage = computed(() => logoGallery.items[0] || null)

// ─── Items de navegación (single source) ────────────────────────────────────

const navItems = [
  { to: '/',         label: 'Inicio' },
  { to: '/about',    label: 'Banda' },
  { to: '/products', label: 'Tienda' }
]

// ─── Estado UI ───────────────────────────────────────────────────────────────

const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// ─── Derivados ───────────────────────────────────────────────────────────────

const cantidadArticulosCarrito = computed(() => almacenCarrito.totalItems)

const userDisplayName = computed(() => {
  const a = almacenAutenticacion.userAttributes
  if (!a) return 'Usuario'
  const first = a.given_name || a.name || ''
  const last  = a.family_name || ''
  return `${first} ${last}`.trim() || a.email || 'Usuario'
})

const userEmail = computed(() => {
  return (
    almacenAutenticacion.userAttributes?.email ||
    almacenAutenticacion.user?.signInDetails?.loginId ||
    ''
  )
})

// ─── Handlers ────────────────────────────────────────────────────────────────

function openMobileMenu() {
  isMobileMenuOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeUserMenu() {
  isUserMenuOpen.value = false
}

async function handleLogout() {
  await almacenAutenticacion.logout()
  isUserMenuOpen.value = false
  router.push('/')
}

async function handleLogoutMobile() {
  await almacenAutenticacion.logout()
  closeMobileMenu()
  router.push('/')
}

// ─── Cierre al cambiar de ruta ───────────────────────────────────────────────

watch(() => route.path, () => {
  closeMobileMenu()
  closeUserMenu()
})

// ─── Tecla Escape cierra menús ───────────────────────────────────────────────

function onKey(e) {
  if (e.key === 'Escape') {
    if (isMobileMenuOpen.value) closeMobileMenu()
    if (isUserMenuOpen.value)   closeUserMenu()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<script>
/**
 * Directiva v-click-outside — cierra el dropdown del usuario al clicar fuera.
 * Definida como directiva del componente porque solo se usa aquí.
 */
export default {
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.__clickOutsideHandler__ = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el.__clickOutsideHandler__)
      },
      unmounted(el) {
        document.removeEventListener('click', el.__clickOutsideHandler__)
      }
    }
  }
}
</script>
