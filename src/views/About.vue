<template>
  <main class="flex-grow pt-20">
    <!-- HeroSection con padding para navbar fixed -->
    <div class="flex flex-col w-full pt-20">
      <div class="w-full">
        <div class="@container">
          <div class="w-full">
            <div 
              class="flex min-h-[480px] flex-col gap-6 items-center justify-center p-4 relative overflow-hidden"
            >
              <!-- Fondo responsivo con art direction -->
              <picture>
                <source 
                  media="(max-width: 768px)" 
                  :srcset="`${cdnUrl}/images/backgrounds/about/gienco-making-of-about-mobile.webp`"
                  type="image/webp"
                />
                <img 
                  :src="`${cdnUrl}/images/backgrounds/about/gienco-making-of-about.webp`"
                  alt="Gienco Band - About Hero Background"
                  class="absolute inset-0 w-full h-full object-cover object-[20%_center] md:object-left opacity-60 z-0"
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
              <!-- Gradient overlay -->
              <div class="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(24,17,17,0.3)] to-[rgba(24,17,17,1)]"></div>

              <div class="flex flex-col gap-2 text-center max-w-[800px] z-10">
                <h1 class="text-white text-5xl md:text-7xl leading-tight tracking-wide" style="font-family: 'Cinzel Decorative', serif; font-weight: 700;">
                  Somos Gienco
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="flex flex-col items-center w-full bg-background-dark py-10">
      <div class="w-full max-w-[960px] px-4 md:px-0">
        <!-- Our Story Header -->
        <div class="flex flex-col gap-2">
          <h2 class="text-white text-3xl font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 border-l-4 border-primary pl-4">La Historia</h2>
        </div>
        
        <!-- Body Text -->
        <div class="flex flex-col md:flex-row gap-8 py-6">
          <div class="flex-1">
            <p class="text-gray-300 text-lg font-normal leading-relaxed">
              La banda se forma en Agosto 2021 cuando Itai (Batería), Elías (Bajo y violín) y Joan (Guitarra y voz) deciden llevar a cabo el proyecto musical, siempre con la idea de componer canciones propias, pasan por varias formaciones hasta que en 2023 se une Norat (Teclados) y el grupo cierra así lo que es su formación actual.
            </p>
          </div>
          <div class="flex-1">
            <p class="text-gray-400 text-base font-normal leading-relaxed">
              Rock n' Roll desde nuestros corazones.
            </p>
            <p class="text-gray-400 text-base font-normal leading-relaxed mt-4">
              Somos un grupo de cuatro jóvenes a los que les apasiona la música, en nuestro repertorio encontrarás mucha variedad de estilos, así como versiones y temas propios. Sobre el escenario ofrecemos un directo muy enérgico y auténtico.
            </p>
            <p class="text-gray-400 text-base font-normal leading-relaxed mt-4">
              ¡Que no te lo cuenten!
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Band Carousel Section -->
    <BandCarousel />
  </main>
</template>

<script setup>
import BandCarousel from '../components/BandCarousel.vue'

const cdnUrl = import.meta.env.VITE_CDN_URL || ''
</script>
