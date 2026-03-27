<template>
  <section class="w-full bg-background-dark py-16">
    <div class="w-full max-w-[960px] mx-auto px-4 md:px-0">
      <!-- Título -->
      <h2 class="text-5xl font-black italic tracking-tighter uppercase mb-6 text-white">
        CONCIERTOS
      </h2>

      <!-- Carrusel container -->
      <div 
        class="relative group"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
      >
        <!-- Scroll container -->
        <div 
          ref="scrollContainer"
          class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
        >
          <div
            v-for="(image, index) in bandImages"
            :key="index"
            class="flex-none w-[85vw] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] snap-start"
          >
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900">
              <img
                :src="`${cdnUrl}/images/band/${image}`"
                :alt="`Gienco Band - ${image.replace('.webp', '').replace(/-/g, ' ')}`"
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <!-- Subtle gradient overlay on hover -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        <!-- Flechas de navegación (visibles en desktop) -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <button
            @click="scrollPrev"
            class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 active:scale-95"
            aria-label="Imagen anterior"
          >
            <span class="material-symbols-outlined text-xl">arrow_back_ios</span>
          </button>
          <button
            @click="scrollNext"
            class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 active:scale-95"
            aria-label="Imagen siguiente"
          >
            <span class="material-symbols-outlined text-xl">arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const cdnUrl = import.meta.env.VITE_CDN_URL || ''

const bandImages = [
  'gienco-bajo-guitarra-banda.webp',
  'gienco-concierto-colaborativo-banda.webp',
  'gienco-concierto-instrumental-banda.webp',
  'gienco-guitarrista-banda.webp',
  'gienco-making-of-backstage-banda.webp',
  'gienco-saludo-banda.webp'
]

const scrollContainer = ref(null)
let autoplayInterval = null

/**
 * Calcula el ancho de un slide individual para scroll programático.
 * @returns {number} Ancho del slide incluyendo gap.
 */
const getSlideWidth = () => {
  if (!scrollContainer.value) return 0
  const firstChild = scrollContainer.value.querySelector(':first-child')
  if (!firstChild) return 0
  // Width of the slide + gap (16px = gap-4)
  return firstChild.offsetWidth + 16
}

/**
 * Desplaza el carrusel hacia la siguiente imagen.
 * Si se llega al final, vuelve al inicio.
 */
const scrollNext = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const slideWidth = getSlideWidth()
  const maxScroll = container.scrollWidth - container.clientWidth

  if (container.scrollLeft >= maxScroll - 10) {
    // Volver al inicio
    container.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    container.scrollTo({ left: container.scrollLeft + slideWidth, behavior: 'smooth' })
  }
}

/**
 * Desplaza el carrusel hacia la imagen anterior.
 * Si se está en el inicio, va al final.
 */
const scrollPrev = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const slideWidth = getSlideWidth()

  if (container.scrollLeft <= 10) {
    // Ir al final
    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
  } else {
    container.scrollTo({ left: container.scrollLeft - slideWidth, behavior: 'smooth' })
  }
}

/**
 * Inicia la rotación automática del carrusel cada 5 segundos.
 */
const startAutoplay = () => {
  if (autoplayInterval) return
  autoplayInterval = setInterval(scrollNext, 5000)
}

/**
 * Pausa la rotación automática (ej. hover con ratón).
 */
const pauseAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

/**
 * Reanuda la rotación automática tras salir el cursor.
 */
const resumeAutoplay = () => {
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  pauseAutoplay()
})
</script>

<style scoped>
/* Ocultar scrollbar en todos los navegadores */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
