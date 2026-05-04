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
          {{ content.fields.intro_heading }}
        </h1>
      </div>
    </section>

    <section class="flex flex-col items-center w-full bg-background-dark py-10" aria-labelledby="history-title">
      <div class="w-full max-w-[960px] px-4 md:px-0">
        <div class="flex flex-col gap-2">
          <h2 id="history-title" class="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white pb-3 pt-5 border-l-4 border-primary pl-4">
            {{ content.fields.history_heading }}
          </h2>
        </div>

        <article class="flex flex-col md:flex-row gap-8 py-6">
          <div class="flex-1">
            <p class="text-gray-300 text-lg font-normal leading-relaxed whitespace-pre-line">
              {{ content.fields.history_body }}
            </p>
          </div>
          <div class="flex-1">
            <p class="text-gray-400 text-base font-normal leading-relaxed italic">
              "{{ content.fields.description_quote }}"
            </p>
            <p class="text-gray-400 text-base font-normal leading-relaxed mt-4 whitespace-pre-line">
              {{ content.fields.description_body }}
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
import { useContent } from '../composables/useContent'

/**
 * Textos editables desde el panel admin (sección "about").
 * Los `defaults` son los textos originales: si la API se cae o aún no
 * llegó la respuesta, se muestran estos en lugar de quedarse en blanco.
 *
 * Para añadir/quitar campos, edita el schema en
 *   Gienco_Admin/src/config/contentSchema.js
 * y actualiza los `defaults` aquí + el template arriba.
 */
const content = useContent('about', {
  intro_heading: 'Somos Gienco',
  history_heading: 'La Historia',
  history_body: 'La banda se forma en Agosto 2021 cuando Itai (Batería), Elías (Bajo y violín) y Joan (Guitarra y voz) deciden llevar a cabo el proyecto musical...',
  description_quote: 'Rock n\' Roll desde nuestros corazones.',
  description_body: 'Somos un grupo de cuatro jóvenes a los que les apasiona la música... Sobre el escenario ofrecemos un directo muy enérgico y auténtico.'
})
</script>

<style scoped>
.font-cinzel-decorative {
  font-family: 'Cinzel Decorative', serif;
  font-weight: 700;
}
</style>