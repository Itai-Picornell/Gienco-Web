<template>
  <main class="flex-grow flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)]">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/backgrounds/Background1.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
    </div>
    
    <div class="w-full max-w-[480px] px-4 py-12 md:py-20 z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <span class="material-symbols-outlined text-white text-4xl">lock</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
          INICIAR SESIÓN
        </h1>
      </div>
      
      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 animate-fade-in">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-500">error</span>
          <p class="text-red-400 text-sm font-medium">{{ errorMessage }}</p>
        </div>
      </div>
      
      <!-- Login Form -->
      <div class="bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-border-dark shadow-2xl relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>
        
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6 relative z-10">
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
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wide">Contraseña</span>
            </div>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input w-full rounded-lg border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-[#181111] text-slate-900 dark:text-white h-12 px-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted transition-all" 
                placeholder="Ingresa tu contraseña" 
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
            :disabled="isLoading"
            class="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-black border border-white text-white text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
          >
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else class="material-symbols-outlined animate-spin">refresh</span>
            <span v-if="!isLoading" class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>
      </div>
      
      <!-- Sign Up Link -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-400">
          ¿No tienes cuenta? 
          <router-link to="/signup" class="text-white hover:bg-white hover:text-black px-2 py-1 rounded transition-colors font-bold ml-1">Regístrate gratis</router-link>
        </p>
      </div>
    </div>
    
    <Footer />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import Footer from '../components/Footer.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

// Verificar si ya está logueado
onMounted(async () => {
    if (authStore.isAuthenticated) {
        handleRedirect()
    }
})

const handleRedirect = () => {
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
}

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
      // Usamos el email como username según la config de AWS que hicimos
      const success = await authStore.login(form.value.email, form.value.password)
      
      if (success) {
          handleRedirect()
      } else {
          // Traducir mensaje de error al español
          let mensaje = authStore.authError || 'Credenciales incorrectas o error en el inicio de sesión.'
          if (mensaje.includes('Incorrect username or password')) {
              mensaje = 'Usuario o contraseña incorrectos.'
          }
          await notificationStore.alert(mensaje, 'Error de Autenticación')
          // Limpiar pass
          form.value.password = ''
      }
  } catch (error) {
      await notificationStore.alert('Ocurrió un error inesperado.', 'Error')
      console.error(error)
  } finally {
      isLoading.value = false
  }
}
</script>
