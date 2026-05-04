<template>
  <main class="flex-grow flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)]">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <!-- Fondo responsivo con art direction -->
      <picture aria-hidden="true">
        <source
          media="(max-width: 768px)"
          :srcset="`${cdnUrl}/images/backgrounds/login/gienco-bateria-login.webp`"
          type="image/webp"
          width="768"
          height="1024"
        />
        <source
          :srcset="`${cdnUrl}/images/backgrounds/login/gienco-fondo-acceso-fans.webp`"
          type="image/webp"
          width="1920"
          height="1080"
        />
        <!-- Fallback JPG si WebP no es soportado -->
        <img
          :src="`${cdnUrl}/images/backgrounds/login/gienco-fondo-acceso-fans.jpg`"
          alt=""
          class="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
          loading="eager"
          fetchpriority="high"
          width="1920"
          height="1080"
        />
      </picture>
      <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
    </div>

    <div class="w-full max-w-[480px] px-4 py-12 md:py-20 z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <span class="material-symbols-outlined text-white text-4xl" aria-hidden="true">lock</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
          {{ content.fields.page_title }}
        </h1>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        role="alert"
        aria-live="assertive"
        class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 animate-fade-in"
      >
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-500" aria-hidden="true">error</span>
          <p class="text-red-400 text-sm font-medium">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Login Form -->
      <div class="bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-border-dark shadow-2xl relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-6 relative z-10" novalidate>
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">
              Correo Electrónico
            </span>
            <input
              v-model="form.email"
              class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
              placeholder="gienco@ejemplo.com"
              type="email"
              autocomplete="email"
              maxlength="254"
              required
            />
          </label>

          <label class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">
                Contraseña
              </span>
              <button
                type="button"
                @click="showForgotPasswordModal = true"
                class="text-sm text-gray-400 hover:text-white transition-colors py-2 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                maxlength="128"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                :aria-pressed="showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined text-xl" aria-hidden="true">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </label>

          <button
            :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else class="material-symbols-outlined animate-spin" aria-hidden="true">refresh</span>
            <span v-if="!isLoading" class="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span>
          </button>
        </form>
      </div>

      <!-- Modal de Recuperación de Contraseña -->
      <div
        v-if="showForgotPasswordModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showForgotPasswordModal = false"
      >
        <div class="bg-card-dark border border-border-dark rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">Recuperar contraseña</h2>
            <button
              type="button"
              @click="showForgotPasswordModal = false"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <span class="material-symbols-outlined text-2xl" aria-hidden="true">close</span>
            </button>
          </div>

          <div
            v-if="forgotPasswordError"
            role="alert"
            class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50"
          >
            <p class="text-red-400 text-sm font-medium">{{ forgotPasswordError }}</p>
          </div>

          <div
            v-if="forgotPasswordSuccess"
            role="alert"
            class="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/50"
          >
            <p class="text-emerald-400 text-sm font-medium">{{ forgotPasswordSuccess }}</p>
          </div>

          <form @submit.prevent="handleForgotPassword" class="flex flex-col gap-4" novalidate>
            <label class="flex flex-col gap-2">
              <span class="text-sm font-medium text-gray-300 uppercase tracking-wide">Correo Electrónico</span>
              <input
                v-model="forgotPasswordEmail"
                type="email"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-10 px-3 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted text-sm transition-all"
                placeholder="gienco@ejemplo.com"
                autocomplete="email"
                maxlength="254"
                required
              />
            </label>

            <button
              :disabled="isForgotPasswordLoading"
              type="submit"
              class="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary border border-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isForgotPasswordLoading">Enviar código</span>
              <span v-else class="material-symbols-outlined animate-spin text-sm" aria-hidden="true">refresh</span>
            </button>

            <button
              type="button"
              @click="showForgotPasswordModal = false"
              class="text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              Volver
            </button>
          </form>
        </div>
      </div>

      <!-- Sign Up Link -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-400">
          ¿No tienes cuenta?
          <router-link to="/signup" class="text-white hover:bg-white hover:text-black px-2 py-1 rounded transition-colors font-bold ml-1">
            Regístrate gratis
          </router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { cdnUrl } from '../utils/cdn'
import { useContent } from '../composables/useContent'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

/** Textos editables desde el panel admin (sección "login"). */
const content = useContent('login', {
  page_title: 'INICIAR SESIÓN'
})

const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

// Variables para modal de recuperación de contraseña
const showForgotPasswordModal = ref(false)
const forgotPasswordEmail = ref('')
const forgotPasswordError = ref('')
const forgotPasswordSuccess = ref('')
const isForgotPasswordLoading = ref(false)

/**
 * SEGURIDAD: Valida que la ruta de redirección sea interna.
 * Previene Open Redirect: ?redirect=https://phishing.com
 *
 * @param {string} path - Ruta candidata de redirección
 * @returns {string} Ruta segura (interna) o '/' como fallback
 */
const getSafeRedirectPath = (path) => {
  if (!path || typeof path !== 'string') return '/'

  try {
    // Comprobamos si es una URL absoluta (con dominio) — esas son peligrosas
    const url = new URL(path, window.location.origin)
    // Solo permitimos rutas del mismo origen
    if (url.origin !== window.location.origin) return '/'
    // Devolvemos solo el pathname + search + hash (nunca el origen externo)
    return url.pathname + url.search + url.hash
  } catch {
    // Si no es una URL parseable, asumimos que es un path relativo simple
    // Nos aseguramos de que empiece por '/' para que sea una ruta relativa de la app
    return path.startsWith('/') ? path : '/'
  }
}

/**
 * Redirige al usuario a la ruta solicitada o a la home, de forma segura.
 */
const handleRedirect = () => {
  const redirectPath = getSafeRedirectPath(route.query.redirect)
  router.push(redirectPath)
}

/**
 * Verifica al montar si el usuario ya tiene sesión activa.
 */
onMounted(() => {
  if (authStore.isAuthenticated) {
    handleRedirect()
  }
})

/**
 * Traduce mensajes de error de AWS Cognito a español.
 *
 * @param {string} mensaje - Mensaje de error original de Cognito
 * @returns {string} Mensaje localizado
 */
const traducirErrorCognito = (mensaje) => {
  if (!mensaje) return 'Credenciales incorrectas o error en el inicio de sesión.'
  if (mensaje.includes('Incorrect username or password')) return 'Usuario o contraseña incorrectos.'
  if (mensaje.includes('User is not confirmed')) return 'Cuenta no verificada. Revisa tu correo.'
  if (mensaje.includes('Too many requests')) return 'Demasiados intentos. Espera unos minutos.'
  if (mensaje.includes('User does not exist')) return 'Usuario o contraseña incorrectos.'
  return 'Error en el inicio de sesión. Inténtalo de nuevo.'
}

/**
 * Procesa el envío del formulario de inicio de sesión.
 * 
 * @async
 */
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Sanitizamos los inputs antes de enviarlos
    const email = form.value.email.trim().toLowerCase()
    const password = form.value.password

    if (!email || !password) {
      errorMessage.value = 'Por favor completa todos los campos.'
      isLoading.value = false
      return
    }

    const success = await authStore.login(email, password)

    if (success) {
      handleRedirect()
    } else {
      const mensaje = traducirErrorCognito(authStore.authError)
      await notificationStore.alert(mensaje, 'Error de Autenticación')
      form.value.password = ''
    }
  } catch (error) {
    await notificationStore.alert('Ocurrió un error inesperado.', 'Error')
    // Solo logueamos en desarrollo — nunca en producción
    if (import.meta.env.DEV) {
      console.error('[Login Error]:', error)
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Inicia el flujo de recuperación de contraseña.
 * Envía un código de verificación al email del usuario.
 * 
 * @async
 */
const handleForgotPassword = async () => {
  forgotPasswordError.value = ''
  forgotPasswordSuccess.value = ''
  isForgotPasswordLoading.value = true

  try {
    const email = forgotPasswordEmail.value.trim().toLowerCase()

    if (!email) {
      forgotPasswordError.value = 'Por favor ingresa tu correo electrónico.'
      return
    }

    // Llamamos al método del store de autenticación
    const result = await authStore.forgotPassword(email)

    if (result.success) {
      forgotPasswordSuccess.value = 'Se ha enviado un código a tu correo. Revisa tu bandeja de entrada.'
      forgotPasswordEmail.value = ''
      
      // Cerramos el modal después de 2 segundos y redirigimos a reset
      setTimeout(() => {
        showForgotPasswordModal.value = false
        router.push(`/login/reset?email=${encodeURIComponent(email)}`)
      }, 2000)
    } else {
      forgotPasswordError.value = result.error || 'Error al enviar el código de recuperación.'
    }
  } catch (error) {
    forgotPasswordError.value = 'Ocurrió un error al procesar tu solicitud.'
    if (import.meta.env.DEV) {
      console.error('[ForgotPassword Error]:', error)
    }
  } finally {
    isForgotPasswordLoading.value = false
  }
}
</script>