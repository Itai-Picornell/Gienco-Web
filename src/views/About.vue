<template>
  <main class="flex-grow pt-20">

    <section
      class="relative flex min-h-[480px] flex-col items-center justify-center overflow-hidden"
      role="banner"
      aria-labelledby="about-heading"
    >
      <picture aria-hidden="true" class="absolute inset-0 w-full h-full">
        <source
          media="(max-width: 768px)"
          :srcset="`${cdnUrl}/images/backgrounds/about/gienco-making-of-about-mobile.webp`"
          type="image/webp"
          width="768"
          height="1024"
        />
        <source
          :srcset="`${cdnUrl}/images/backgrounds/about/gienco-making-of-about.webp`"
          type="image/webp"
          width="1920"
          height="1080"
        />
        <img
          :src="`${cdnUrl}/images/backgrounds/about/gienco-making-of-about.jpg`"
          alt=""
          class="absolute inset-0 w-full h-full object-cover object-[20%_center] md:object-left opacity-60 z-0"
          loading="eager"
          fetchpriority="high"
          width="1920"
          height="1080"
        />
      </picture>

      <div class="absolute inset-0 z-[1] bg-gradient-to-b from-background-dark/30 to-background-dark pointer-events-none"></div>

      <div class="relative z-10 flex flex-col gap-2 text-center max-w-[800px] px-4">
        <h1
          id="about-heading"
          class="text-white text-5xl md:text-7xl leading-tight tracking-wide font-cinzel-decorative"
        >
          Somos Gienco
        </h1>
      </div>
    </section>

    <section class="flex flex-col items-center w-full bg-background-dark py-10" aria-labelledby="history-title">
      <div class="w-full max-w-[960px] px-4 md:px-0">
        <div class="flex flex-col gap-2">
          <h2 id="history-title" class="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white pb-3 pt-5 border-l-4 border-primary pl-4">
            La Historia
          </h2>
        </div>

        <article class="flex flex-col md:flex-row gap-8 py-6">
          <div class="flex-1">
            <p class="text-gray-300 text-lg font-normal leading-relaxed">
              La banda se forma en Agosto 2021 cuando Itai (Batería), Elías (Bajo y violín) y Joan (Guitarra y voz) deciden llevar a cabo el proyecto musical...
            </p>
          </div>
          <div class="flex-1">
            <p class="text-gray-400 text-base font-normal leading-relaxed italic">
              "Rock n' Roll desde nuestros corazones."
            </p>
            <p class="text-gray-400 text-base font-normal leading-relaxed mt-4">
              Somos un grupo de cuatro jóvenes a los que les apasiona la música... Sobre el escenario ofrecemos un directo muy enérgico y auténtico.
            </p>
          </div>
        </article>
      </div>
    </section>

    <BandCarousel />
  </main>
</template>

<script setup>
import BandCarousel from '../components/BandCarousel.vue'
import { cdnUrl } from '../utils/cdn'
</script>

<style scoped>
.font-cinzel-decorative {
  font-family: 'Cinzel Decorative', serif;
  font-weight: 700;
}
</style>