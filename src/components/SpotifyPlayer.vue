<template>
  <div v-if="spotifyId" class="w-full mt-4 flex items-center justify-center">
    <!--
      Reproductor real de Spotify. Solo se monta tras el consentimiento explícito
      del usuario (click-to-load), porque el embed de Spotify instala cookies de
      terceros y el art. 22.2 de la LSSI exige consentimiento previo para ellas.
    -->
    <iframe
      v-if="loaded"
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
      Fachada previa al consentimiento: no carga nada de Spotify, no pone cookies.
      Al pulsar, el usuario consiente cargar el reproductor (y sus cookies).
    -->
    <button
      v-else
      type="button"
      @click="loaded = true"
      class="w-full flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 text-center shadow-xl"
      :style="{ height: iframeHeight + 'px' }"
      :aria-label="'Cargar el reproductor de Spotify de Gienco'"
    >
      <span class="material-symbols-outlined text-4xl text-gray-200" aria-hidden="true">play_circle</span>
      <span class="text-sm font-semibold text-gray-200">Cargar reproductor de Spotify</span>
      <span class="text-xs text-gray-400 max-w-xs">
        Al pulsar aceptas cargar contenido de Spotify, que puede instalar cookies de terceros.
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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

// El iframe (y sus cookies) solo se cargan tras el consentimiento explícito del usuario.
const loaded = ref(false)

const iframeHeight = computed(() => {
  return props.type === 'track' ? '80' : '352'
})
</script>
