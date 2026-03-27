<template>
  <section class="w-full bg-background-dark py-16" aria-labelledby="carousel-heading">
    <div class="w-full max-w-[960px] mx-auto px-4 md:px-0">

      <h2
        id="carousel-heading"
        class="text-5xl font-black italic tracking-tighter uppercase mb-6 text-white"
      >
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
          class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar touch-pan-x"
          role="region"
          aria-label="Carrusel de imágenes de la banda en concierto"
        >
          <div
            v-for="(slide, index) in BAND_SLIDES"
            :key="slide.filename"
            class="flex-none w-[85vw] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] snap-start"
          >
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900">
              <img
                :src="`${cdnUrl}/images/band/${slide.filename}`"
                :alt="slide.alt"
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                :loading="index === 0 ? 'eager' : 'lazy'"
                decoding="async"
                width="800"
                height="600"
                @error="handleImageError"
              />
              <!-- Gradient overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </div>

        <!-- Botones de navegación -->
        <div class="flex items-center justify-center gap-4 mt-6" role="group" aria-label="Controles del carrusel">
          <button
            @click="scrollPrev"
            class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 active:scale-95"
            aria-label="Ver imagen anterior de la banda"
          >
            <span class="material-symbols-outlined text-xl" aria-hidden="true">arrow_back_ios</span>
          </button>
          <button
            @click="scrollNext"
            class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 active:scale-95"
            aria-label="Ver siguiente imagen de la banda"
          >
            <span class="material-symbols-outlined text-xl" aria-hidden="true">arrow_forward_ios</span>
          </button>
        </div>

        <!-- Indicador de movimiento reducido -->
        <p
          v-if="motionReduced"
          class="text-center text-xs text-neutral-500 mt-3"
          aria-live="polite"
        >
          Reproducción automática desactivada por preferencias de accesibilidad
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { cdnUrl } from '../utils/cdn'

/**
 * MEJORA: Array de objetos con alt texts individuales.
 * Antes era un array de strings y el alt se generaba manipulando el filename,
 * lo que producía textos como "gienco bajo guitarra banda" — poco descriptivos.
 */
const BAND_SLIDES = [
  { filename: 'gienco-bajo-guitarra-banda.webp', alt: 'Gienco Band - Bajo y guitarra en concierto' },
  { filename: 'gienco-concierto-colaborativo-banda.webp', alt: 'Gienco Band - Concierto colaborativo' },
  { filename: 'gienco-concierto-instrumental-banda.webp', alt: 'Gienco Band - Momento instrumental en directo' },
  { filename: 'gienco-guitarrista-banda.webp', alt: 'Gienco Band - Guitarrista en acción' },
  { filename: 'gienco-making-of-backstage-banda.webp', alt: 'Gienco Band - Backstage y making of' },
  { filename: 'gienco-saludo-banda.webp', alt: 'Gienco Band - Saludo al público' }
]

/** Intervalo de autoplay en ms */
const AUTOPLAY_DELAY = 5000

const scrollContainer = ref(null)
let autoplayInterval = null
let resizeObserver = null

/**
 * FIX: Detecta si el usuario prefiere movimiento reducido.
 * Esto es un requisito de accesibilidad (WCAG 2.1 - 2.3.3) para usuarios
 * con epilepsia fotosensible, mareo por movimiento, u otras condiciones.
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const motionReduced = ref(prefersReducedMotion.matches)

// Escuchamos cambios en la preferencia (el usuario puede cambiarla en caliente)
const handleMotionPreferenceChange = (e) => {
  motionReduced.value = e.matches
  if (e.matches) {
    pauseAutoplay()
  } else {
    startAutoplay()
  }
}

// ─── Navegación ─────────────────────────────────────────────────────────────

/**
 * Calcula el ancho de un slide incluyendo el gap.
 * @returns {number}
 */
const getSlideWidth = () => {
  if (!scrollContainer.value) return 0
  const firstChild = scrollContainer.value.querySelector(':first-child')
  if (!firstChild) return 0
  return firstChild.offsetWidth + 16 // 16px = gap-4
}

const scrollNext = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const slideWidth = getSlideWidth()
  const maxScroll = container.scrollWidth - container.clientWidth

  if (container.scrollLeft >= maxScroll - 10) {
    container.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    container.scrollTo({ left: container.scrollLeft + slideWidth, behavior: 'smooth' })
  }
}

const scrollPrev = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const slideWidth = getSlideWidth()

  if (container.scrollLeft <= 10) {
    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
  } else {
    container.scrollTo({ left: container.scrollLeft - slideWidth, behavior: 'smooth' })
  }
}

// ─── Autoplay ────────────────────────────────────────────────────────────────

const startAutoplay = () => {
  // FIX: No iniciamos autoplay si el usuario prefiere movimiento reducido
  if (autoplayInterval || motionReduced.value) return
  autoplayInterval = setInterval(scrollNext, AUTOPLAY_DELAY)
}

const pauseAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const resumeAutoplay = () => {
  startAutoplay()
}

// ─── Error handling de imágenes ──────────────────────────────────────────────

/**
 * FIX: Cuando una imagen falla al cargar, ocultamos el elemento roto
 * en vez de dejar el alt text flotando en una card vacía.
 *
 * @param {Event} event
 */
const handleImageError = (event) => {
  const img = event.target
  img.style.visibility = 'hidden'
  if (import.meta.env.DEV) {
    console.warn('[BandCarousel] Imagen no pudo cargarse:', img.src)
  }
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
  startAutoplay()

  prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange)

  if (scrollContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      const container = scrollContainer.value
      const slideWidth = getSlideWidth()
      const index = Math.round(container.scrollLeft / slideWidth)
      container.scrollTo({ left: index * slideWidth, behavior: 'instant' })
    })
    resizeObserver.observe(scrollContainer.value)
  }
})

onBeforeUnmount(() => {
  pauseAutoplay()
  resizeObserver?.disconnect()
  prefersReducedMotion.removeEventListener('change', handleMotionPreferenceChange)
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>