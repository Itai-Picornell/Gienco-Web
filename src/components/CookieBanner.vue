<template>
  <!--
    Banner de consentimiento de cookies. Solo se muestra mientras el usuario no
    haya decidido (consent === null). Las cookies técnicas necesarias no
    requieren consentimiento; este banner cubre el contenido de terceros
    (Spotify) que puede instalar cookies, conforme al art. 22.2 de la LSSI.
  -->
  <Transition name="cookie-fade">
    <div
      v-if="consent === null"
      class="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
    >
      <div
        class="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <p class="text-sm text-gray-300 leading-relaxed flex-1">
          Usamos cookies técnicas necesarias para que la web funcione. Con tu permiso,
          también cargamos contenido de terceros (reproductor de Spotify) que puede
          instalar sus propias cookies. Puedes consultar más en la
          <router-link to="/privacidad" class="text-white underline underline-offset-2 hover:text-gray-200">
            política de privacidad</router-link>.
        </p>
        <div class="flex items-center gap-3 shrink-0">
          <button
            type="button"
            @click="reject"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 border border-white/15 hover:bg-white/10 transition-colors"
          >
            Rechazar
          </button>
          <button
            type="button"
            @click="accept"
            class="px-5 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCookieConsent } from '../composables/useCookieConsent'

const { consent, accept, reject } = useCookieConsent()
</script>

<style scoped>
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
