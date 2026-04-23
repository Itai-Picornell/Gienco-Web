<template>
  <main class="flex-grow flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)]">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <!-- Fondo responsivo con art direction -->
      <picture aria-hidden="true">
        <source
          media="(max-width: 768px)"
          :srcset="`${cdnUrl}/images/backgrounds/sign_up/gienco-cantante-registro.webp`"
          type="image/webp"
          width="768"
          height="1024"
        />
        <source
          :srcset="`${cdnUrl}/images/backgrounds/sign_up/gienco-publico-registro.webp`"
          type="image/webp"
          width="1920"
          height="1080"
        />
        <!-- Fallback JPG si WebP no es soportado -->
        <img
          :src="`${cdnUrl}/images/backgrounds/sign_up/gienco-publico-registro.jpg`"
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

    <div class="w-full max-w-[550px] px-4 pt-20 pb-12 md:pt-24 md:pb-20 z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 mt-2">
          <span class="material-symbols-outlined text-white text-4xl" aria-hidden="true">person_add</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
          REGISTRARSE
        </h1>
        <p class="text-text-muted text-base md:text-lg font-normal max-w-md mx-auto leading-relaxed">
          Crea tu cuenta y forma parte de este gran proyecto.
        </p>
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

      <!-- Sign Up Form -->
      <div class="bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-border-dark shadow-2xl relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>

        <!-- PASO 1: Formulario de registro -->
        <form v-if="!showVerification" @submit.prevent="handleSignUp" class="flex flex-col gap-6 relative z-10" novalidate>
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Nombre</span>
            <input
              v-model="form.name"
              class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
              placeholder="Pepito Grillo"
              type="text"
              autocomplete="name"
              maxlength="100"
              required
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Correo Electrónico</span>
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
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Contraseña</span>
            <div class="relative">
              <input
                v-model.trim="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
                placeholder="Ingresa tu contraseña"
                autocomplete="new-password"
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

          <!-- Medidor de fortaleza de contraseña -->
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

          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Confirmar Contraseña</span>
            <div class="relative">
              <input
                v-model.trim="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all"
                placeholder="Confirma tu contraseña"
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
          </label>

          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="form.agreeToTerms"
              type="checkbox"
              class="w-4 h-4 mt-1 rounded border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-primary focus:ring-primary focus:ring-1"
              required
            />
            <span class="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
              He leído y acepto los
              <router-link to="/terminos" target="_blank" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium">Términos y Condiciones</router-link>
              y la
              <router-link to="/privacidad" target="_blank" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium">Política de Privacidad</router-link>
            </span>
          </label>

          <button
            :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            <span v-if="!isLoading">Crear Cuenta</span>
            <span v-else class="material-symbols-outlined animate-spin" aria-hidden="true">refresh</span>
          </button>
        </form>

        <!-- PASO 2: Formulario de verificación de código -->
        <form v-else @submit.prevent="handleVerification" class="flex flex-col gap-6 relative z-10 animate-fade-in" novalidate>
          <div class="text-center mb-4">
            <span class="material-symbols-outlined text-white text-5xl mb-2" aria-hidden="true">mark_email_read</span>
            <h2 class="text-xl font-bold text-white mb-2">Verifica tu correo</h2>
            <p class="text-text-muted text-sm">Hemos enviado un código a <strong>{{ form.email }}</strong></p>
          </div>

          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Código de Verificación</span>
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
          </label>

          <button
            :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            <span v-if="!isLoading">Confirmar Cuenta</span>
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
              @click="showVerification = false"
              class="text-sm text-gray-400 hover:text-white transition-colors py-2 font-medium"
            >
              ¿Correo incorrecto? Volver
            </button>
          </div>
        </form>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-400">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="text-white hover:bg-white hover:text-black px-2 py-1 rounded transition-colors font-bold ml-1">
            Iniciar sesión
          </router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { cdnUrl } from '../utils/cdn'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const showVerification = ref(false)
const verificationCode = ref('')

const passwordCriteria = ref({
  length: false,
  number: false,
  upper: false,
  lower: false
})

/**
 * FIX CRÍTICO: El medidor de contraseña ahora se actualiza en tiempo real
 * gracias al watch reactivo sobre form.password.
 * Antes, checkPasswordCriteria estaba definida pero nunca se llamaba.
 */
watch(
  () => form.value.password,
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
 * Valida que la contraseña cumpla los requisitos de seguridad.
 * NOTA: Los requisitos aquí deben estar sincronizados con passwordCriteria.
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
 * FIX: Valida el formato del código de verificación antes de llamar a la API.
 * Solo acepta exactamente 6 dígitos numéricos.
 *
 * @param {string} code
 * @returns {boolean}
 */
const isValidVerificationCode = (code) => {
  return /^\d{6}$/.test(code.trim())
}

/**
 * Procesa el registro del nuevo usuario.
 * 
 * @async
 */
const handleSignUp = async () => {
  errorMessage.value = ''

  if (!form.value.agreeToTerms) {
    errorMessage.value = 'Debes aceptar los Términos y Condiciones y la Política de Privacidad para continuar.'
    return
  }

  const name = form.value.name.trim()
  const email = form.value.email.trim().toLowerCase()

  if (!name) {
    errorMessage.value = 'Por favor ingresa tu nombre.'
    return
  }

  if (!email) {
    errorMessage.value = 'Por favor ingresa tu correo electrónico.'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '¡Las contraseñas no coinciden!'
    return
  }

  const passwordError = validatePassword(form.value.password)
  if (passwordError) {
    errorMessage.value = passwordError
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register(
      email,
      form.value.password,
      name
    )

    if (result.success) {
      if (!result.isSignUpComplete) {
        showVerification.value = true
      } else {
        await notificationStore.alert('¡Cuenta creada exitosamente! Por favor inicia sesión.', 'Registro Exitoso')
        router.push('/login')
      }
    } else {
      errorMessage.value = result.error || 'Error al crear la cuenta.'
    }
  } catch (error) {
    errorMessage.value = 'Ocurrió un error inesperado al registrarse.'
    if (import.meta.env.DEV) {
      console.error('[SignUp Error]:', error)
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Envía el código de verificación para confirmar la cuenta.
 * FIX: Ahora valida el formato del código antes de llamar a la API.
 * 
 * @async
 */
const handleVerification = async () => {
  errorMessage.value = ''

  // FIX: Validación del código antes de llamar a la API
  if (!isValidVerificationCode(verificationCode.value)) {
    errorMessage.value = 'El código debe ser de 6 dígitos numéricos.'
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.confirmRegistration(
      form.value.email.trim().toLowerCase(),
      verificationCode.value.trim()
    )

    if (result.success) {
      await notificationStore.alert('¡Cuenta verificada correctamente! Ahora puedes iniciar sesión.', 'Verificación Exitosa')
      router.push('/login')
    } else {
      errorMessage.value = result.error || 'Código inválido o error en verificación.'
    }
  } catch (error) {
    errorMessage.value = 'Error al verificar el código.'
    if (import.meta.env.DEV) {
      console.error('[Verification Error]:', error)
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Reenvía el código de verificación.
 * 
 * @async
 */
const handleResendCode = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.resendCode(form.value.email.trim().toLowerCase())

    if (result.success) {
      await notificationStore.alert('Código reenviado. Revisa tu bandeja de entrada.', 'Código Enviado')
    } else {
      errorMessage.value = result.error || 'Error al reenviar el código.'
    }
  } catch (error) {
    errorMessage.value = 'Error al reenviar el código.'
    if (import.meta.env.DEV) {
      console.error('[ResendCode Error]:', error)
    }
  } finally {
    isLoading.value = false
  }
}
</script>