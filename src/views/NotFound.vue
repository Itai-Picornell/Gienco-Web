<template>
  <section
    id="not-found-page"
    class="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center"
  >
    <!-- Animated 404 heading -->
    <h1
      class="text-[10rem] leading-none font-bold tracking-tighter select-none sm:text-[14rem]"
      :class="glitchClass"
      @mouseenter="triggerGlitch"
    >
      <span class="bg-gradient-to-br from-white via-gray-400 to-gray-600 bg-clip-text text-transparent">
        404
      </span>
    </h1>

    <!-- Subtitle -->
    <p class="mt-4 max-w-md text-lg text-text-muted sm:text-xl">
      Parece que te has salido del setlist&hellip;
    </p>
    <p class="mt-2 max-w-sm text-sm text-text-muted/60">
      La página que buscas no existe o ha sido movida.
    </p>

    <!-- Divider -->
    <div class="mt-8 h-px w-24 bg-border-dark" aria-hidden="true"></div>

    <!-- Back to Home button -->
    <router-link
      id="not-found-home-btn"
      to="/"
      class="group mt-8 inline-flex items-center gap-2 rounded-full border border-border-dark bg-card-dark px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95"
    >
      <span
        class="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:-translate-x-0.5"
        aria-hidden="true"
      >
        arrow_back
      </span>
      Volver al inicio
    </router-link>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Vista 404 — Catch-All
 * Se muestra cuando ninguna ruta coincide con la URL actual.
 * Mantiene la estética oscura de Gienco y ofrece un CTA claro
 * para redirigir al usuario al inicio.
 */

const glitchClass = ref('')

function triggerGlitch() {
  glitchClass.value = 'animate-pulse'
  setTimeout(() => {
    glitchClass.value = ''
  }, 600)
}
</script>
