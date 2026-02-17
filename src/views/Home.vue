<template>
  <main class="flex-grow">
    <!-- Sección Hero a pantalla completa -->
    <section class="relative w-full h-screen flex items-center justify-center overflow-hidden" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
      <h1 class="sr-only">Gienco Band - Banda Oficial de Música</h1>
      
      <!-- Carrusel de fondo -->
      <div class="absolute inset-0 z-0">
        <div 
          v-for="(imagen, indice) in imagenesFondo" 
          :key="indice"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          :class="indiceImagenActual === indice ? 'opacity-100' : 'opacity-0'"
          :style="`background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), url('${imagen}');`"
        ></div>
      </div>
      
      <!-- Controles de navegación -->
      <div v-if="imagenesFondo.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between items-center px-4 md:px-10 pointer-events-none">
        <!-- Flecha Izquierda -->
        <button 
          @click="cambiarImagen(-1)"
          class="pointer-events-auto group relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 opacity-0 hover:opacity-100 animate-fade-in"
          style="animation-delay: 0.5s; animation-fill-mode: forwards;"
          aria-label="Imagen anterior"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <!-- Flecha Derecha -->
        <button 
          @click="cambiarImagen(1)"
          class="pointer-events-auto group relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 opacity-0 hover:opacity-100 animate-fade-in"
          style="animation-delay: 0.5s; animation-fill-mode: forwards;"
          aria-label="Imagen siguiente"
        >
          <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Indicadores de posición -->
      <div v-if="imagenesFondo.length > 1" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button
          v-for="(imagen, indice) in imagenesFondo"
          :key="indice"
          @click="irAImagen(indice)"
          :class="[
            'w-2 h-2 rounded-full transition-all',
            indiceImagenActual === indice ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
          ]"
          :aria-label="`Ir a imagen ${indice + 1}`"
        ></button>
      </div>
    </section>

    <!-- Sección de Último Lanzamiento -->
    <section class="py-12 md:py-20 bg-background-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20 items-center">
          <div class="flex-1 flex flex-col gap-8 text-center lg:text-left">
            <div class="flex flex-col gap-4">
              <span class="text-primary font-bold tracking-widest text-sm uppercase">Nuevo Lanzamiento</span>
              <h2 class="text-white text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Nuestros Proyectos:<br/>
              </h2>
              <p class="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
Estamos muy contentos de anunciaros nuestro primer álbum "Manifiesto" el cual se encuentra en proceso de grabación pero, os dejamos dos sorpresas por aquí que ya están disponibles en nuestras plataformas digitales.
              </p>
            </div>
            <div class="flex gap-4 justify-center lg:justify-start">
              <a href="https://open.spotify.com/intl-es/artist/2SuZxiVemUNCCrzzXZVJg3?si=PHKjcjQYR8-pojyKJxMYew" target="_blank" class="bg-[#1db954] hover:bg-[#1ed760] text-black h-12 px-6 rounded-full font-bold flex items-center gap-2 transition-colors">
                <span class="material-symbols-outlined">play_arrow</span> Spotify
              </a>
            </div>
          </div>
          
          <div class="flex-1 w-full max-w-lg">
            <div class="bg-surface-dark border border-[#392829] rounded-xl p-6 shadow-2xl">
              <div class="grid gap-4">
                <div 
                  v-for="(pista, indice) in pistas" 
                  :key="indice"
                  class="group flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:text-black transition-colors cursor-pointer"
                  :class="pistaReproduciendo === pista.titulo && !estaPausado ? 'bg-primary/10 border border-primary/30' : ''"
                  @click="toggleAudio(pista)"
                >
                  <div 
                    class="w-16 h-16 rounded-md shrink-0 relative overflow-hidden" 
                    :class="pistaReproduciendo === pista.titulo && !estaPausado ? 'ring-2 ring-primary animate-pulse' : ''"
                  >
                    <img 
                      :src="pista.imagen" 
                      :alt="pista.titulo"
                      width="64"
                      height="64"
                      class="w-full h-full object-cover"
                    />
                    <div 
                      class="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity"
                      :class="pistaReproduciendo === pista.titulo && !estaPausado ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                    >
                      <span class="material-symbols-outlined text-white">
                        {{ pistaReproduciendo === pista.titulo && !estaPausado ? 'pause' : 'play_arrow' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-white font-bold truncate group-hover:text-black transition-colors">{{ pista.titulo }}</h3>
                    <p class="text-gray-400 text-sm">Gienco • {{ pista.duracion }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Imágenes del carrusel de fondo
const imagenesFondo = ref([
  '/images/backgrounds/Background3.webp',
  '/images/backgrounds/Fondo_Login.webp',
  '/images/backgrounds/Fondo_Registrarse.webp'
])

const indiceImagenActual = ref(0)
let idIntervalo = null

// Función para cambiar imagen (dirección: -1 izquierda, 1 derecha)
const cambiarImagen = (direccion) => {
  const totalImagenes = imagenesFondo.value.length
  indiceImagenActual.value = (indiceImagenActual.value + direccion + totalImagenes) % totalImagenes
}

// Función para ir directamente a una imagen
const irAImagen = (indice) => {
  indiceImagenActual.value = indice
}

// Funciones para pausar/reanudar el carrusel
const pauseCarousel = () => {
  if (idIntervalo) {
    clearInterval(idIntervalo)
    idIntervalo = null
  }
}

const resumeCarousel = () => {
  if (imagenesFondo.value.length > 1 && !idIntervalo) {
    idIntervalo = setInterval(() => {
      indiceImagenActual.value = (indiceImagenActual.value + 1) % imagenesFondo.value.length
    }, 5000)
  }
}

// Rota automáticamente cada 5 segundos
onMounted(() => {
  if (imagenesFondo.value.length > 1) {
    idIntervalo = setInterval(() => {
      indiceImagenActual.value = (indiceImagenActual.value + 1) % imagenesFondo.value.length
    }, 5000)
  }
})


// Limpia el intervalo al desmontar
onUnmounted(() => {
  if (idIntervalo) {
    clearInterval(idIntervalo)
  }
  // Detener y limpiar el audio al salir de la página
  if (audioActual) {
    audioActual.pause()
    audioActual.currentTime = 0
    audioActual = null
  }
})

const pistas = ref([
  {
    titulo: 'Florecer',
    duracion: '3:34',
    imagen: '/images/songs/Florecer_Fondo.webp',
    audio: '/audio/Florecer.wav'
  },
  {
    titulo: '¡Menudo Porvenir!',
    duracion: '2:46',
    imagen: '/images/songs/Menudo_Porvenir_Fondo.webp',
    audio: '/audio/Menudo_Porvenir.wav'
  },
])

// Audio player
let audioActual = null
const pistaReproduciendo = ref(null)
const estaPausado = ref(false)

const toggleAudio = (pista) => {
  // Si es la misma pista que está reproduciéndose
  if (pistaReproduciendo.value === pista.titulo && audioActual) {
    if (estaPausado.value) {
      // Reanudar
      audioActual.play()
      estaPausado.value = false
    } else {
      // Pausar
      audioActual.pause()
      estaPausado.value = true
    }
  } else {
    // Detener audio anterior si existe
    if (audioActual) {
      audioActual.pause()
      audioActual.currentTime = 0
    }
    
    // Crear nuevo elemento de audio y reproducirlo
    audioActual = new Audio(pista.audio)
    audioActual.play()
    pistaReproduciendo.value = pista.titulo
    estaPausado.value = false
    
    // Listener para cuando termina el audio
    audioActual.addEventListener('ended', () => {
      pistaReproduciendo.value = null
      estaPausado.value = false
    })
  }
}

</script>

<style scoped>
/* Animación sutil para las flechas */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

/* Efecto hover para mostrar completamente las flechas */
.animate-fade-in:hover {
  opacity: 1 !important;
}
</style>
