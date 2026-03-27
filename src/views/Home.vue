<template>
  <main class="flex flex-col">
    <section 
      class="relative w-full h-[70vh] md:h-screen overflow-hidden group"
      @mouseenter="pauseCarousel" 
      @mouseleave="resumeCarousel"
    >
      <h1 class="sr-only">Gienco Band - Banda Oficial de Música</h1>
      
      <div 
        ref="carouselRef"
        class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pointer-events-auto touch-pan-y"
      >
        <div class="w-full h-full flex-none snap-center relative">
          <picture class="absolute inset-0 w-full h-full block">
            <source 
              media="(max-width: 768px)" 
              :srcset="`${cdnUrl}/images/backgrounds/home/gienco-banda-luces-home-mobile.webp`"
              type="image/webp"
            />
            <img 
              :src="`${cdnUrl}/images/backgrounds/home/gienco-banda-luces-home.webp`"
              alt="Gienco Band - Luces de Concierto"
              class="w-full h-full object-cover object-center"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
          <div class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
        </div>

        <div class="w-full h-full flex-none snap-center relative">
          <picture class="absolute inset-0 w-full h-full block">
            <source 
              media="(max-width: 768px)" 
              :srcset="`${cdnUrl}/images/backgrounds/home/gienco-fondo-concierto-home-mobile.webp`"
              type="image/webp"
            />
            <img 
              :src="`${cdnUrl}/images/backgrounds/home/gienco-fondo-concierto-home.webp`"
              alt="Gienco Band - Fondo Concierto"
              class="w-full h-full object-cover object-center"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
          <div class="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
        </div>
      </div>
      
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between items-center px-4 md:px-10 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:flex">
        <button 
          @click="scrollPrev"
          class="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
          aria-label="Imagen anterior"
        >
          <span class="material-symbols-outlined text-xl md:text-2xl">arrow_back</span>
        </button>
        
        <button 
          @click="scrollNext"
          class="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
          aria-label="Imagen siguiente"
        >
          <span class="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
        </button>
      </div>
      
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button
          v-for="i in 2"
          :key="i"
          @click="scrollToSlide(i - 1)"
          :class="[
            'w-2 h-2 rounded-full transition-all',
            currentSlide === i - 1 ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
          ]"
          :aria-label="`Ir a imagen ${i}`"
        ></button>
      </div>
    </section>

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
          </div>
          
          <div class="w-full max-w-2xl mx-auto mt-8">
            <SpotifyPlayer 
              spotifyId="2SuZxiVemUNCCrzzXZVJg3" 
              type="artist" 
            />
          </div>
        </div>
        
        <section class="w-full max-w-5xl mx-auto mt-20 mb-12 px-4">
          <h2 class="text-white text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-8 text-center lg:text-left">
            Próximos Eventos
          </h2>
          <EventsCalendar />
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import EventsCalendar from '../components/EventsCalendar.vue'

// Lógica de entorno segura
const cdnUrl = import.meta.env.VITE_CDN_URL || ''

const carouselRef = ref(null)
const currentSlide = ref(0)
let autoplayInterval = null

// Manejo del scroll para detectar el slide actual
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

const startAutoplay = () => {
  if (autoplayInterval) return
  autoplayInterval = setInterval(scrollNext, 5000)
}

const pauseCarousel = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const resumeCarousel = () => {
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
  if (carouselRef.value) {
    carouselRef.value.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  pauseCarousel()
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 0.6; }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in:hover {
  opacity: 1 !important;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>