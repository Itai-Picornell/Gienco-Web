<template>
  <div class="w-full max-w-4xl mx-auto my-8 p-6 rounded-2xl">
    <a class="bit-widget-initializer"
       data-artist-name="Gienco"
       data-background-color="transparent" 
       data-text-color="#FFFFFF"
       data-button-text-color="#000000"
       data-button-background-color="#FFFFFF"
       data-radius="12"
       data-display-local-dates="true"
       data-display-past-dates="false"
       data-language="es"
       data-display-play-my-city="false"
       data-display-header="true"
       href="https://www.bandsintown.com/a/15639624">
    </a>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let scriptEl = null

onMounted(() => {
  scriptEl = document.createElement('script')
  scriptEl.src = 'https://widget.bandsintown.com/main.min.js'
  scriptEl.async = true
  scriptEl.charset = 'utf-8'
  document.body.appendChild(scriptEl)
})

onUnmounted(() => {
  if (scriptEl && scriptEl.parentNode) {
    scriptEl.parentNode.removeChild(scriptEl)
    scriptEl = null
  }
})
</script>
