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
          <span class="material-symbols-outlined text-white text-4xl" aria-hidden="true">lock_reset</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
          RESTABLECER CONTRASEÑA
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

      <!-- Success Alert -->
      <div
        v-if="successMessage"
        role="alert"
        aria-live="polite"
        class="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/50 animate-fade-in"
      >
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-emerald-500" aria-hidden="true">check_circle</span>
          <p class="text-emerald-400 text-sm font-medium">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Reset Form -->
      <div class="bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-border-dark shadow-2xl relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>

        <form @submit.prevent="handleResetPassword" class="flex flex-col gap-6 relative z-10" novalidate>
          <!-- Step 1: Verification Code -->
          <div>
            <label class="flex flex-col gap-2 mb-4">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">
                Código de Verificación
              </span>
              <p class="text-xs text-gray-400">Se ha enviado un código a <strong>{{ emailDisplay }}</strong></p>
            </label>
            <input
              v-model="verificationCode"
              class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 text-center text-xl tracking-widest focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="123456"
              type="text"
              inputmode="numeric"
              pattern="[0-9]{6}"
              autocomplete="one-time-code"
              maxlength="6"
              required
            />
          </div>

          <!-- Step 2: New Password -->
          <div>
            <label class="flex flex-col gap-2 mb-4">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">
                Nueva Contraseña
              </span>
            </label>
            <div class="relative">
              <input
                v-model.trim="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
                placeholder="Ingresa tu nueva contraseña"
                autocomplete="new-password"
                maxlength="128"
                required
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                :aria-label="showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                :aria-pressed="showNewPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined text-xl" aria-hidden="true">
                  {{ showNewPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="mb-6 -mt-3" aria-live="polite" aria-label="Requisitos de contraseña">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Requisitos:</span>
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <div
                class="flex items-center gap-1 transition-all duration-300"
                :class="passwordCriteria.length ? 'text-emerald-500 font-medium' : 'text-gray-400'"
              >
                <span v-if="passwordCriteria.length" class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                <span v-else class="text-[14px] font-bold" aria-hidden="true">*</span>
                <span class="text-xs">8+ caracteres</span>
              </div>
              <div
                class="flex items-center gap-1 transition-all duration-300"
                :class="passwordCriteria.number ? 'text-emerald-500 font-medium' : 'text-gray-400'"
              >
                <span v-if="passwordCriteria.number" class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                <span v-else class="text-[14px] font-bold" aria-hidden="true">*</span>
                <span class="text-xs">Número</span>
              </div>
              <div
                class="flex items-center gap-1 transition-all duration-300"
                :class="passwordCriteria.upper ? 'text-emerald-500 font-medium' : 'text-gray-400'"
              >
                <span v-if="passwordCriteria.upper" class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                <span v-else class="text-[14px] font-bold" aria-hidden="true">*</span>
                <span class="text-xs">Mayúscula</span>
              </div>
              <div
                class="flex items-center gap-1 transition-all duration-300"
                :class="passwordCriteria.lower ? 'text-emerald-500 font-medium' : 'text-gray-400'"
              >
                <span v-if="passwordCriteria.lower" class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                <span v-else class="text-[14px] font-bold" aria-hidden="true">*</span>
                <span class="text-xs">Minúscula</span>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="flex flex-col gap-2 mb-4">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">
                Confirmar Nueva Contraseña
              </span>
            </label>
            <div class="relative">
              <input
                v-model.trim="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
                placeholder="Confirma tu nueva contraseña"
                autocomplete="new-password"
                maxlength="128"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                :aria-label="showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'"
                :aria-pressed="showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined text-xl" aria-hidden="true">
                  {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <button
            :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            <span v-if="!isLoading">Restablecer Contraseña</span>
            <span v-if="!isLoading" class="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span>
            <span v-else class="material-symbols-outlined animate-spin" aria-hidden="true">refresh</span>
          </button>

          <div class="flex flex-col gap-3 mt-4">
            <button
              type="button"
              @click="handleResendCode"
              :disabled="isLoading"
              class="flex items-center justify-center gap-2 rounded-full h-10 px-6 bg-white text-black hover:bg-neutral-200 font-bold uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading" class="material-symbols-outlined text-base" aria-hidden="true">mail_outline</span>
              <span v-if="!isLoading">¿No recibiste el código? Reenviar</span>
              <span v-else class="material-symbols-outlined animate-spin text-base" aria-hidden="true">refresh</span>
            </button>

            <button
              type="button"
              @click="handleBackToLogin"
              class="text-sm text-gray-400 hover:text-white transition-colors py-2 font-medium"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { cdnUrl } from '../utils/cdn'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const emailDisplay = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const passwordCriteria = ref({
  length: false,
  number: false,
  upper: false,
  lower: false
})

/**
 * Watch sobre newPassword para validar requisitos en tiempo real
 */
watch(
  () => newPassword.value,
  (password) => {
    passwordCriteria.value = {
      length: password.length >= 8,
      number: /\d/.test(password),
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password)
    }
  }
)

/**
 * Obtiene y valida el email desde los query params
 */
onMounted(() => {
  const email = route.query.email
  if (email && typeof email === 'string') {
    try {
      emailDisplay.value = decodeURIComponent(email)
    } catch {
      emailDisplay.value = 'tu correo electrónico'
    }
  } else {
    emailDisplay.value = 'tu correo electrónico'
  }
})

/**
 * Valida que la contraseña cumpla los requisitos de seguridad.
 *
 * @param {string} password
 * @returns {string|null} Mensaje de error o null si es válida.
 */
const validatePassword = (password) => {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/\d/.test(password)) return 'La contraseña debe incluir al menos un número.'
  if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir al menos una mayúscula.'
  if (!/[a-z]/.test(password)) return 'La contraseña debe incluir al menos una minúscula.'
  return null
}

/**
 * Valida que el código sea exactamente 6 dígitos numéricos.
 *
 * @param {string} code
 * @returns {boolean}
 */
const isValidVerificationCode = (code) => {
  return /^\d{6}$/.test(code.trim())
}

/**
 * Procesa el restablecimiento de contraseña.
 *
 * @async
 */
const handleResetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validaciones
  if (!isValidVerificationCode(verificationCode.value)) {
    errorMessage.value = 'El código debe ser de 6 dígitos numéricos.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = '¡Las contraseñas no coinciden!'
    return
  }

  const passwordError = validatePassword(newPassword.value)
  if (passwordError) {
    errorMessage.value = passwordError
    return
  }

  isLoading.value = true

  try {
    const email = emailDisplay.value
    const result = await authStore.confirmForgotPassword(
      email,
      verificationCode.value.trim(),
      newPassword.value
    )

    if (result.success) {
      successMessage.value = '¡Contraseña restablecida correctamente! Redirigiendo...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = result.error || 'Error al restablecer la contraseña.'
    }
  } catch (error) {
    errorMessage.value = 'Ocurrió un error inesperado.'
    if (import.meta.env.DEV) {
      console.error('[ResetPassword Error]:', error)
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Regresa al login
 */
const handleBackToLogin = () => {
  router.push('/login')
}

/**
 * Reenvía el código de recuperación de contraseña
 *
 * @async
 */
const handleResendCode = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const email = emailDisplay.value
    const result = await authStore.forgotPassword(email)

    if (result.success) {
      successMessage.value = 'Código reenviado. Revisa tu bandeja de entrada.'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = result.error || 'Error al reenviar el código.'
    }
  } catch (error) {
    errorMessage.value = 'Ocurrió un error al reenviar el código.'
    if (import.meta.env.DEV) {
      console.error('[ResendCode Error]:', error)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
