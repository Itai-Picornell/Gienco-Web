<template>
  <main class="flex-grow pt-20">

    <section
      class="relative flex min-h-[480px] flex-col items-center justify-center overflow-hidden"
      role="banner"
      aria-labelledby="about-heading"
    >
      <img
        v-if="heroImage"
        :src="heroImage.url"
        :alt="filenameToAlt(heroImage.filename)"
        class="absolute inset-0 w-full h-full object-cover object-[20%_center] md:object-left opacity-60 z-0"
        loading="eager"
        fetchpriority="high"
        width="1920"
        height="1080"
      />

      <div class="absolute inset-0 z-[1] bg-gradient-to-b from-background-dark/30 to-background-dark pointer-events-none"></div>

      <div class="relative z-10 flex flex-col gap-2 text-center max-w-[800px] px-4">
        <h1
          id="about-heading"
          class="text-h1-hero font-display leading-tight text-white"
        >
          {{ content.fields.intro_heading }}
        </h1>
      </div>
    </section>

    <section class="flex flex-col items-center w-full bg-background-dark py-10" aria-labelledby="history-title">
      <div class="w-full max-w-[960px] px-4 md:px-0">
        <div class="flex flex-col gap-2">
          <h2 id="history-title" class="text-h1 font-display leading-tight text-white pb-3 pt-5 border-l-4 border-primary pl-4">
            {{ content.fields.history_heading }}
          </h2>
        </div>

        <article class="flex flex-col md:flex-row gap-8 py-6">
          <div class="flex-1">
            <p class="text-body-large font-sans-body text-gray-300 leading-relaxed whitespace-pre-line">
              {{ content.fields.history_body }}
            </p>
          </div>
          <div class="flex-1">
            <p class="text-body font-sans-body text-gray-400 leading-relaxed italic">
              "{{ content.fields.description_quote }}"
            </p>
            <p class="text-body font-sans-body text-gray-400 leading-relaxed mt-4 whitespace-pre-line">
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
import { computed } from 'vue'
import BandCarousel from '../components/BandCarousel.vue'
import { cdnUrl } from '../utils/cdn'
import { useContent } from '../composables/useContent'
import { useGallery } from '../composables/useGallery'

/**
 * Textos editables desde el panel admin (sección "about").
 * Los `defaults` son los textos originales: si la API se cae o aún no
 * llegó la respuesta, se muestran estos en lugar de quedarse en blanco.
 */
const content = useContent('about', {
  intro_heading: 'Somos Gienco',
  history_heading: 'La Historia',
  history_body: 'La banda se forma en Agosto 2021 cuando Itai (Batería), Elías (Bajo y violín) y Joan (Guitarra y voz) deciden llevar a cabo el proyecto musical...',
  description_quote: 'Rock n\' Roll desde nuestros corazones.',
  description_body: 'Somos un grupo de cuatro jóvenes a los que les apasiona la música... Sobre el escenario ofrecemos un directo muy enérgico y auténtico.'
})

/**
 * Imagen de fondo del hero — gestionada dinámicamente desde el panel admin.
 * El default es la imagen original: si la API se cae o aún no cargó,
 * el hero no se queda en blanco.
 *
 * Si hay varias imágenes en la sección, se muestra la primera por orden
 * alfabético — el admin puede renombrar con prefijo (`01-`, `00-`) para
 * controlar cuál sale.
 */
const gallery = useGallery('about', [
  {
    filename: 'gienco-making-of-about.webp',
    url: `${cdnUrl}/images/backgrounds/about/gienco-making-of-about.webp`
  }
])

/** Primera imagen disponible (o null si por alguna razón no hay ninguna). */
const heroImage = computed(() => gallery.items[0] || null)

/**
 * Genera un alt text legible a partir del nombre de archivo.
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
</script>

<style scoped>
.font-cinzel-decorative {
  font-family: 'Cinzel Decorative', serif;
  font-weight: 700;
}
</style>
