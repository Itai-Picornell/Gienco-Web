<template>
  <main class="flex-grow flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)]">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/backgrounds/Fondo_Registrarse.webp')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
    </div>
    
    <div class="w-full max-w-[550px] px-4 py-12 md:py-20 z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <span class="material-symbols-outlined text-white text-4xl">person_add</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
          REGISTRARSE
        </h1>
        <p class="text-text-muted text-base md:text-lg font-normal max-w-md mx-auto leading-relaxed">
          Crea tu cuenta y forma parte de este gran proyecto.
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 animate-fade-in">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-500">error</span>
          <p class="text-red-400 text-sm font-medium">{{ errorMessage }}</p>
        </div>
      </div>
      
      <!-- Sign Up Form -->
      <div class="bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-border-dark shadow-2xl relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>
        
        <form v-if="!showVerification" @submit.prevent="handleSignUp" class="flex flex-col gap-6 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Nombre</span>
              <input 
                v-model="form.firstName"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
                placeholder="Pepito" 
                type="text"
                required
              />
            </label>
            
            <label class="flex flex-col gap-2">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Apellido</span>
              <input 
                v-model="form.lastName"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
                placeholder="Grillo" 
                type="text"
                required
              />
            </label>
          </div>
          
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Correo Electrónico</span>
            <input 
              v-model="form.email"
              class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
              placeholder="gienco@ejemplo.com" 
              type="email"
              required
            />
          </label>
          
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Contraseña</span>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
                placeholder="Ingresa tu contraseña" 
                required
                minlength="8"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-text-muted">Debe tener al menos 8 caracteres</p>
          </label>
          
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Confirmar Contraseña</span>
            <div class="relative">
              <input 
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
                placeholder="Confirma tu contraseña" 
                required
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined text-xl">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
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
              Acepto los <a href="#" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium">Términos de Servicio</a>y la <a href="#" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium">Política de Privacidad</a>
            </span>
          </label>
          
          <button 
            :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
          >
            <span v-if="!isLoading">Crear Cuenta</span>
            <span v-else class="material-symbols-outlined animate-spin">refresh</span>
          </button>
        </form>

        <!-- Verification Code Form -->
        <form v-else @submit.prevent="handleVerification" class="flex flex-col gap-6 relative z-10 animate-fade-in">
            <div class="text-center mb-4">
                <span class="material-symbols-outlined text-white text-5xl mb-2">mark_email_read</span>
                <h3 class="text-xl font-bold text-white mb-2">Verifica tu correo</h3>
                <p class="text-text-muted text-sm">Hemos enviado un código a {{ form.email }}</p>
            </div>

            <label class="flex flex-col gap-2">
                <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Código de Verificación</span>
                <input 
                  v-model="verificationCode"
                  class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 text-center text-xl tracking-widest focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  placeholder="123456" 
                  type="text"
                  required
                />
            </label>

            <button 
                :disabled="isLoading"
                class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-primary border border-primary text-white text-base font-bold uppercase tracking-wider hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
            >
                <span v-if="!isLoading">Confirmar Cuenta</span>
                <span v-else class="material-symbols-outlined animate-spin">refresh</span>
            </button>
            
            <button 
                type="button" 
                @click="showVerification = false"
                class="text-sm text-gray-400 hover:text-white mt-2"
            >
                ¿Correo incorrecto? Volver
            </button>
        </form>
      </div>
      
      <!-- Login Link -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-400">
          ¿Ya tienes cuenta? 
          <router-link to="/login" class="text-white hover:bg-white hover:text-black px-2 py-1 rounded transition-colors font-bold ml-1">Iniciar sesión</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  newsletter: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const showVerification = ref(false)
const verificationCode = ref('')

// Procesa el formulario de registro y crea una nueva cuenta en Cognito
/**
 * Procesa el registro de un nuevo usuario.
 * Valida contraseñas y realiza la llamada a AWS Cognito mediante el store.
 * Si es exitoso, avanza al paso de verificación.
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleSignUp = async () => {
  errorMessage.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '¡Las contraseñas no coinciden!'
    return
  }

  isLoading.value = true
  
  try {
      // Registrar usuario en Cognito
      const result = await authStore.register(
          form.value.email, // username (usamos email)
          form.value.password,
          form.value.email,
          form.value.firstName,
          form.value.lastName
      )
      
      if (result.success) {
          // Si el registro es exitoso pero no está completo/confirmado, mostramos form de verificación
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
      console.error(error)
  } finally {
      isLoading.value = false
  }
}

// Verifica el código de confirmación enviado por correo electrónico
/**
 * Envía el código de verificación ingresado por el usuario para confirmar su cuenta en AWS Cognito.
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleVerification = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const result = await authStore.confirmRegistration(form.value.email, verificationCode.value)
        
        if (result.success) {
            await notificationStore.alert('¡Cuenta verificada correctamente! Ahora puedes iniciar sesión.', 'Verificación Exitosa')
            router.push('/login')
        } else {
            errorMessage.value = result.error || 'Código inválido o error en verificación.'
        }
    } catch (error) {
        errorMessage.value = 'Error al verificar el código.'
    } finally {
        isLoading.value = false
    }
}
</script>
