<template>
  <main class="flex-grow flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)]">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/backgrounds/Background3.webp')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
    </div>
    
    <div class="w-full max-w-[480px] px-4 py-12 md:py-20 z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <span class="material-symbols-outlined text-white text-4xl">admin_panel_settings</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
          ACCESO ADMIN
        </h1>
        <p class="text-text-muted text-base md:text-lg font-normal max-w-md mx-auto leading-relaxed">
          Área restringida. Se requieren credenciales de administrador.
        </p>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-500">error</span>
          <p class="text-red-400 text-sm font-medium">{{ errorMessage }}</p>
        </div>
      </div>
      
      <!-- Admin Login Form -->
      <div class="bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-border-dark shadow-2xl relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>
        
        <form @submit.prevent="handleAdminLogin" class="flex flex-col gap-6 relative z-10">
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Usuario</span>
            <input 
              v-model="form.username"
              class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
              placeholder="Ingrese usuario" 
              type="text"
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
                placeholder="Ingrese contraseña" 
                required
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>
          
          <button 
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all" 
            type="submit"
          >
            <span>Acceder al Panel Admin</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <!-- New Password Challenge Form -->
        <div v-if="newPasswordRequired" class="absolute inset-0 z-20 bg-white dark:bg-card-dark flex flex-col p-8 gap-6 animate-fade-in">
             <div class="text-center">
                <h2 class="text-xl font-bold text-primary mb-2">Crear Nueva Contraseña</h2>
                <p class="text-sm text-gray-500">Es tu primer acceso. Debes establecer una contraseña permanente.</p>
             </div>

             <form @submit.prevent="handleNewPasswordSubmit" class="flex flex-col gap-6">
                <label class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Nueva Contraseña</span>
                    <input 
                      v-model="newPassword"
                      class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                      placeholder="Mínimo 8 caracteres" 
                      type="password"
                      required
                    />
                </label>

                <button 
                    class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-primary border border-primary text-white text-base font-bold uppercase tracking-wider hover:bg-primary-dark active:scale-[0.98] transition-all" 
                    type="submit"
                >
                    <span>Confirmar y Acceder</span>
                    <span class="material-symbols-outlined text-lg">check_circle</span>
                </button>
             </form>
        </div>
      </div>
      
      <!-- Back to Home Link -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-sm text-gray-400 hover:bg-white hover:text-black px-2 py-1 rounded transition-colors">
          ← Volver a Inicio
        </router-link>
      </div>
      
      <!-- Warning Badge -->
      <div class="mt-12 flex items-center justify-center gap-2 opacity-50">
        <span class="material-symbols-outlined text-yellow-500 text-sm">warning</span>
        <span class="text-xs text-gray-400 uppercase tracking-wider">Solo Personal Autorizado</span>
      </div>
    </div>
    
    <Footer/>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import Footer from '../components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Redirige al panel de administración si ya está autenticado
/**
 * Verifica al montar el componente si el administrador ya está autenticado.
 * Si es así, redirige al panel de administración.
 */
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/admin')
  }
})

const form = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)
const errorMessage = ref('')

// Procesa el inicio de sesión de administrador con AWS Cognito
/**
 * Procesa el inicio de sesión del administrador.
 * Valida credenciales contra AWS Cognito y maneja errores o desafios de contraseña.
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleAdminLogin = async () => {
  errorMessage.value = ''
  
  const success = await authStore.login(form.value.username, form.value.password)
  
  if (success) {
    router.push('/admin')
  } else {
    // Traducir mensaje de error al español
    let mensaje = authStore.authError || 'Credenciales inválidas. Acceso denegado.'
    if (mensaje.includes('Incorrect username or password')) {
        mensaje = 'Usuario o contraseña incorrectos.'
    }
    
    // Detectar si requiere cambio de contraseña
    if (authStore.authError && authStore.authError.includes('CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED')) {
        newPasswordRequired.value = true
    } else {
        await notificationStore.alert(mensaje, 'Acceso Denegado')
    }
    
    // Limpiamos contraseña pero mantenemos usuario para facilidad
    form.value.password = ''
  }
}

const newPasswordRequired = ref(false)
const newPassword = ref('')

// Confirma y establece la nueva contraseña para el primer acceso
/**
 * Envía la nueva contraseña requerida por Cognito durante el primer inicio de sesión (Challenge NEW_PASSWORD_REQUIRED).
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleNewPasswordSubmit = async () => {
    if (!newPassword.value) return
    
    const success = await authStore.confirmNewPassword(newPassword.value)
    
    if (success) {
        router.push('/admin')
    } else {
        let mensaje = authStore.authError || 'Error al establecer la contraseña.'
        await notificationStore.alert(mensaje, 'Error')
    }
}
</script>
