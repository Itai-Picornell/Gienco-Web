<template>
  <div v-if="spotifyId" class="w-full mt-4 flex items-center justify-center">
    <iframe
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
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const iframeHeight = computed(() => {
  return props.type === 'track' ? '80' : '352'
})
</script>
