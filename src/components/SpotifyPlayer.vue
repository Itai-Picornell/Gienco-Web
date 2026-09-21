<template>
  <div v-if="spotifyId" class="w-full mt-4 flex items-center justify-center">
    <!--
      El iframe de Spotify instala cookies de terceros, así que solo se carga
      cuando el usuario ha aceptado las cookies en el banner global
      (art. 22.2 LSSI). Tras aceptar, se monta automáticamente.
    -->
    <iframe
      v-if="consent === 'accepted'"
      title="Reproductor de Spotify oficial de Gienco"
      style="border-radius:12px"
      :src="`https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`"
      width="100%"
      :height="iframeHeight"
      frameBorder="0"
      allowfullscreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      class="shadow-xl"
    ></iframe>

    <!--
      Fallback cuando el usuario aún no ha aceptado (o ha rechazado) las cookies.
      La mayoría acepta en el banner y nunca ve esto; aquí ofrecemos aceptar
      puntualmente para cargar el reproductor.
    -->
    <div
      v-else
      class="w-full flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-center shadow-xl"
      :style="{ height: iframeHeight + 'px' }"
    >
      <span class="material-symbols-outlined text-3xl text-gray-300" aria-hidden="true">music_note</span>
      <span class="text-xs text-gray-400 max-w-xs">
        Acepta las cookies para cargar el reproductor de Spotify.
      </span>
      <button
        type="button"
        @click="accept"
        class="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
      >
        Aceptar cookies
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCookieConsent } from '../composables/useCookieConsent'

const props = defineProps({
  spotifyId: {
    type: String,
    required: false,
    default: null
  },
  type: {
    type: String,
    default: 'track',
    validator: (value) => ['track', 'album', 'artist', 'playlist'].includes(value)
  }
})

const { consent, accept } = useCookieConsent()

const iframeHeight = computed(() => {
  return props.type === 'track' ? '80' : '352'
})
</script>
