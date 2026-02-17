<template>
  <!-- Contenedor principal de la aplicación con estilos de Tailwind CSS -->
  <!-- bg-background-light/dark: fondo claro u oscuro según el modo -->
  <!-- text-slate-900/white: color de texto según el modo -->
  <!-- min-h-screen: altura mínima de toda la pantalla -->
  <!-- flex flex-col: diseño en columna para apilar navbar y contenido -->
  <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col">
    <!-- Barra de navegación visible en todas las páginas -->
    <Navbar />
    
    <!-- Contenedor donde se renderiza el componente de la ruta actual -->
    <!-- router-view es un componente especial de Vue Router que muestra el componente correspondiente a la URL actual -->
    <!-- flex-1 hace que el contenido crezca y empuje el footer al fondo -->
    <router-view class="flex-1" />
    
    <!-- Footer global - siempre pegado al fondo -->
    <Footer />
    
    <!-- Modal global para notificaciones -->
    <NotificationModal />
  </div>
</template>

<script setup>
// Importar el componente de la barra de navegación
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import NotificationModal from './components/NotificationModal.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

// Verifica si hay sesión activa al cargar la aplicación
onMounted(async () => {
  await authStore.checkAuth()
})
</script>
