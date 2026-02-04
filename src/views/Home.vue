<template>
  <main class="flex-grow">
    <!-- Sección Hero a pantalla completa -->
    <section class="relative w-full h-screen flex items-center justify-center overflow-hidden">
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
      
    </section>

    <!-- Sección de Último Lanzamiento -->
    <section class="py-20 bg-background-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
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
                    <h4 class="text-white font-bold truncate group-hover:text-black transition-colors">{{ pista.titulo }}</h4>
                    <p class="text-gray-500 text-sm">Gienco • {{ pista.duracion }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <Footer />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Footer from '../components/Footer.vue'

// Imágenes del carrusel de fondo
const imagenesFondo = ref([
  '/images/backgrounds/Background1.jpg',
  '/images/backgrounds/Background2.jpg',
  '/images/backgrounds/Background3.jpeg'
])

const indiceImagenActual = ref(0)
let idIntervalo = null

// Rota automáticamente cada 5 segundos
onMounted(() => {
  idIntervalo = setInterval(() => {
    indiceImagenActual.value = (indiceImagenActual.value + 1) % imagenesFondo.value.length
  }, 5000)
})

// Limpia el intervalo al desmontar
onUnmounted(() => {
  if (idIntervalo) {
    clearInterval(idIntervalo)
  }
})

const pistas = ref([
  {
    titulo: 'Florecer',
    duracion: '3:34',
    imagen: '/images/songs/Florecer_Fondo.png',
    audio: '/audio/Florecer.wav'
  },
  {
    titulo: '¡Menudo Porvenir!',
    duracion: '2:46',
    imagen: '/images/songs/Menudo_Porvenir_Fondo.jpg',
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
