<template>
  <main class="flex flex-col">
    <section
      class="relative w-full h-[70vh] md:h-screen overflow-hidden group"
      role="region"
      aria-label="Galería de destacados de Gienco"
      @mouseenter="pauseCarousel"
      @mouseleave="resumeCarousel"
    >
      <h1 class="sr-only">Gienco - Banda Oficial de Música</h1>

      <div
        ref="carouselRef"
        class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pointer-events-auto touch-pan-x"
        aria-live="polite"
      >
        <div
          v-for="(slide, index) in gallery.items"
          :key="slide.filename"
          class="w-full h-full flex-none snap-center relative"
        >
          <img
            :src="slide.url"
            :alt="filenameToAlt(slide.filename)"
            class="absolute inset-0 w-full h-full object-cover object-center"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'low'"
            width="1920"
            height="1080"
          />
          <div class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <!-- Botones prev/next, solo visibles si hay más de 1 imagen -->
      <div
        v-if="gallery.items.length > 1"
        class="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 justify-between items-center px-4 md:px-10 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <button
          @click="scrollPrev"
          class="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
          aria-label="Ver imagen anterior"
        >
          <span class="material-symbols-outlined text-xl md:text-2xl">arrow_back</span>
        </button>

        <button
          @click="scrollNext"
          class="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
          aria-label="Ver siguiente imagen"
        >
          <span class="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
        </button>
      </div>

      <!-- Dots de paginación, solo visibles si hay más de 1 imagen -->
      <div
        v-if="gallery.items.length > 1"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2"
      >
        <button
          v-for="(_, i) in gallery.items"
          :key="i"
          @click="scrollToSlide(i)"
          :class="[
            'w-2 h-2 rounded-full transition-all',
            currentSlide === i ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
          ]"
          :aria-current="currentSlide === i ? 'true' : 'false'"
          :aria-label="`Ir a la diapositiva ${i + 1}`"
        ></button>
      </div>
    </section>

    <section class="py-12 md:py-20 bg-background-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20 items-center">
          <div class="flex-1 flex flex-col gap-8 text-center lg:text-left">
            <div class="flex flex-col gap-4">
              <span class="text-white font-bold tracking-widest text-sm uppercase">{{ content.fields.releases_kicker }}</span>
              <h2 class="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                {{ content.fields.releases_heading }}<br/>
              </h2>
              <p class="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 whitespace-pre-line">
                {{ content.fields.releases_body }}
              </p>
            </div>
          </div>

          <div class="w-full max-w-2xl mx-auto mt-8">
            <SpotifyPlayer spotifyId="2SuZxiVemUNCCrzzXZVJg3" type="artist" />
          </div>
        </div>

        <section class="w-full max-w-5xl mx-auto mt-20 mb-12 px-4">
          <h2 class="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-8 text-center lg:text-left">
            {{ content.fields.events_heading }}
          </h2>
          <EventsCalendar />
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import EventsCalendar from '../components/EventsCalendar.vue'

import { cdnUrl } from '../utils/cdn'
import { useContent } from '../composables/useContent'
import { useGallery } from '../composables/useGallery'

/**
 * Textos editables desde el panel admin (sección "home").
 * Los `defaults` reflejan el contenido original — si la API se cae, se ven estos.
 */
const content = useContent('home', {
  releases_kicker: 'Nuevo Lanzamiento',
  releases_heading: 'Nuestros Proyectos:',
  releases_body: 'Estamos muy contentos de anunciaros nuestro primer álbum "Manifiesto" el cual se encuentra en proceso de grabación. Os dejamos dos sorpresas que ya están disponibles.',
  events_heading: 'Próximos Eventos'
})

/**
 * Imágenes del hero — gestionadas dinámicamente desde el panel admin.
 * Los `defaults` son las imágenes originales: si la API se cae o aún no
 * cargó, el hero no se queda en blanco.
 */
const gallery = useGallery('home', [
  {
    filename: 'gienco-banda-luces-home.webp',
    url: `${cdnUrl}/images/backgrounds/home/gienco-banda-luces-home.webp`
  },
  {
    filename: 'gienco-fondo-concierto-home.webp',
    url: `${cdnUrl}/images/backgrounds/home/gienco-fondo-concierto-home.webp`
  }
])

/**
 * Genera un alt text legible a partir del nombre de archivo.
 *
 * Ejemplo:
 *   'gienco-banda-luces-home.webp' → 'Gienco banda luces home'
 *
 * @param {string} filename
 * @returns {string}
 */
function filenameToAlt(filename) {
  if (!filename || typeof filename !== 'string') return 'Imagen de Gienco'
  const base = filename.replace(/\.(webp|jpe?g|png)$/i, '')
  const cleaned = base.replace(/[-_]+/g, ' ').trim()
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

const AUTOPLAY_DELAY = 5000

const carouselRef = ref(null)
const currentSlide = ref(0)
let autoplayInterval = null
let resizeObserver = null

// ─── Navegación ────────────────────────────────────────────────────────────

const handleScroll = () => {
  if (!carouselRef.value) return
  const { scrollLeft, clientWidth } = carouselRef.value
  currentSlide.value = Math.round(scrollLeft / clientWidth)
}

const scrollToSlide = (index) => {
  if (!carouselRef.value) return
  const { clientWidth } = carouselRef.value
  carouselRef.value.scrollTo({
    left: index * clientWidth,
    behavior: 'smooth'
  })
}

const scrollNext = () => {
  if (!carouselRef.value) return
  const { scrollLeft, clientWidth, scrollWidth } = carouselRef.value
  if (scrollLeft + clientWidth >= scrollWidth - 10) {
    carouselRef.value.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    carouselRef.value.scrollBy({ left: clientWidth, behavior: 'smooth' })
  }
}

const scrollPrev = () => {
  if (!carouselRef.value) return
  const { scrollLeft, clientWidth, scrollWidth } = carouselRef.value
  if (scrollLeft <= 10) {
    carouselRef.value.scrollTo({ left: scrollWidth, behavior: 'smooth' })
  } else {
    carouselRef.value.scrollBy({ left: -clientWidth, behavior: 'smooth' })
  }
}

// ─── Autoplay ──────────────────────────────────────────────────────────────

const startAutoplay = () => {
  // No iniciar si solo hay una imagen — no tiene sentido el autoplay
  if (autoplayInterval || gallery.items.length <= 1) return
  autoplayInterval = setInterval(scrollNext, AUTOPLAY_DELAY)
}

const pauseCarousel = () => {
  clearInterval(autoplayInterval)
  autoplayInterval = null
}

const resumeCarousel = startAutoplay

// ─── Reactividad al cambio de imágenes ─────────────────────────────────────

/**
 * Cuando llegan imágenes nuevas de la API (o cambia el número), reseteamos
 * el carousel al inicio y reactivamos el autoplay. Sin esto, si las defaults
 * tenían 2 slides y la API devuelve 4, currentSlide podría quedar fuera de
 * rango y el autoplay no arranca.
 */
watch(
  () => gallery.items.length,
  (newLength, oldLength) => {
    if (newLength === oldLength) return
    currentSlide.value = 0
    if (carouselRef.value) {
      carouselRef.value.scrollTo({ left: 0, behavior: 'instant' })
    }
    pauseCarousel()
    startAutoplay()
  }
)

// ─── Lifecycle ─────────────────────────────────────────────────────────────

onMounted(() => {
  startAutoplay()

  if (carouselRef.value) {
    carouselRef.value.addEventListener('scroll', handleScroll, { passive: true })

    // Sincronización al cambiar orientación o tamaño de ventana
    resizeObserver = new ResizeObserver(() => {
      scrollToSlide(currentSlide.value)
    })
    resizeObserver.observe(carouselRef.value)
  }
})

onBeforeUnmount(() => {
  pauseCarousel()
  resizeObserver?.disconnect()
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

img {
  image-rendering: -webkit-optimize-contrast;
  backface-visibility: hidden;
}
</style>
