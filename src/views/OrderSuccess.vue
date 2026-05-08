<template>
  <main class="flex-grow pt-20 bg-surface-dark min-h-screen">
    <!-- Cabecera -->
    <section class="relative w-full bg-gradient-to-br from-background-dark via-surface-dark to-background-dark border-b border-[#392829] py-16 pt-28">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>
      <div class="container mx-auto px-4 md:px-10 lg:px-40 relative z-10 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
          <span class="material-symbols-outlined text-emerald-400 text-5xl" aria-hidden="true">check_circle</span>
        </div>
        <h1 class="text-h1-hero font-display leading-none text-white mb-4">
          ¡Pedido recibido!
        </h1>
        <p class="text-body font-sans-body text-text-muted max-w-xl mx-auto">
          Hemos registrado tu pedido. Para confirmarlo, completa el pago por <strong class="text-white">Bizum</strong> siguiendo las instrucciones que te hemos enviado por email.
        </p>
      </div>
    </section>

    <!-- Sin pedido en sessionStorage → mensaje neutral con CTA -->
    <section v-if="!order" class="py-12">
      <div class="container mx-auto px-4 md:px-10 lg:px-40 max-w-2xl">
        <div class="bg-background-dark border border-[#392829] rounded-xl p-8 text-center">
          <span class="material-symbols-outlined text-text-muted text-5xl block mb-4" aria-hidden="true">inbox</span>
          <h2 class="text-h3 font-display text-white mb-2">No hay información reciente del pedido</h2>
          <p class="text-body-small text-text-muted mb-6">
            Si acabas de hacer un pedido, revisa tu correo electrónico — te hemos enviado todos los detalles.
          </p>
          <router-link to="/products">
            <button class="inline-flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-black border border-white hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider">
              <span class="material-symbols-outlined" aria-hidden="true">storefront</span>
              Volver a la tienda
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Pedido encontrado → mostrar detalle -->
    <section v-else class="py-12">
      <div class="container mx-auto px-4 md:px-10 lg:px-40 max-w-2xl">
        <!-- ID y total -->
        <div class="bg-background-dark border border-[#392829] rounded-xl p-6 md:p-8 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p class="text-text-muted text-xs uppercase tracking-wider mb-1">Número de pedido</p>
              <p class="text-white text-2xl md:text-3xl font-black font-mono tracking-tight">{{ order.orderId }}</p>
            </div>
            <div class="md:text-right">
              <p class="text-text-muted text-xs uppercase tracking-wider mb-1">Total</p>
              <p class="text-primary text-2xl md:text-3xl font-black">{{ formatPrice(order.totalAmount) }}</p>
            </div>
          </div>

          <!-- Email de confirmación -->
          <div class="p-4 rounded-lg bg-[#181111] border border-border-dark">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-emerald-400 mt-0.5" aria-hidden="true">mark_email_read</span>
              <div class="flex-1">
                <p class="text-white text-sm font-medium mb-1">Email de confirmación enviado</p>
                <p class="text-text-muted text-xs break-all">
                  Hemos enviado las instrucciones a <strong class="text-white">{{ order.customerEmail }}</strong>
                </p>
                <p class="text-text-muted text-[11px] mt-2">
                  Si no lo encuentras, revisa también la carpeta de spam o promociones.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pasos siguientes -->
        <div class="bg-background-dark border border-[#392829] rounded-xl p-6 md:p-8 mb-6">
          <h2 class="text-white text-xl font-bold mb-6 uppercase tracking-tight">¿Y ahora qué?</h2>

          <ol class="space-y-5">
            <li class="flex gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
                1
              </div>
              <div class="flex-1">
                <p class="text-white text-sm font-semibold mb-1">Realiza el pago por Bizum</p>
                <p class="text-text-muted text-xs leading-relaxed">
                  Abre la app Bizum de tu banco e introduce los datos que aparecen en el email.
                  <strong class="text-white">Es imprescindible incluir el número de pedido <span class="font-mono">{{ order.orderId }}</span> en el concepto</strong> para que podamos identificar tu pago.
                </p>
              </div>
            </li>

            <li class="flex gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
                2
              </div>
              <div class="flex-1">
                <p class="text-white text-sm font-semibold mb-1">Confirmación del pago</p>
                <p class="text-text-muted text-xs leading-relaxed">
                  En cuanto recibamos el Bizum te enviaremos un email confirmando que estamos preparando tu pedido.
                  Suele tardar pocas horas en horario habitual.
                </p>
              </div>
            </li>

            <li class="flex gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
                3
              </div>
              <div class="flex-1">
                <p class="text-white text-sm font-semibold mb-1">Recogida en mano</p>
                <p class="text-text-muted text-xs leading-relaxed">
                  Cuando esté listo, nos pondremos en contacto contigo por WhatsApp para coordinar la recogida.
                  Sin envíos: la entrega es siempre en persona.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Aviso de plazo -->
        <div class="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-amber-400" aria-hidden="true">schedule</span>
            <div class="flex-1">
              <p class="text-amber-300 text-sm font-medium mb-1">Plazo de pago: 48 horas</p>
              <p class="text-amber-300/80 text-xs leading-relaxed">
                Si no recibimos el Bizum en 48 horas, el pedido se cancelará automáticamente y tendrás que repetir el proceso.
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row gap-3">
          <router-link to="/products" class="flex-1">
            <button class="w-full h-12 rounded-lg bg-card-dark hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg" aria-hidden="true">storefront</span>
              Seguir comprando
            </button>
          </router-link>
          <router-link to="/" class="flex-1">
            <button class="w-full h-12 rounded-lg bg-black border border-white hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg" aria-hidden="true">home</span>
              Volver al inicio
            </button>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
/**
 * @file OrderSuccess.vue
 * @description Pantalla de confirmación tras crear un pedido.
 *
 * Lee los datos del último pedido desde sessionStorage (escritos por
 * Checkout.vue al recibir respuesta del backend). Es deliberadamente
 * "sin endpoint público": no consultamos al backend por orderId para evitar
 * exponer datos del pedido a cualquiera con la URL.
 *
 * Si no hay datos en sessionStorage (refresco tras cerrar pestaña, llegada
 * directa por URL...) se muestra un mensaje neutral indicando que la info
 * está en el correo. El email es la fuente de verdad para el cliente.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const order = ref(null)

/**
 * Lee el último pedido de sessionStorage y valida sus campos.
 * Solo aceptamos datos con la forma esperada — descartamos cualquier
 * cosa rara que pudiera haber sido inyectada por una extensión o un script.
 */
function loadOrder() {
  try {
    const raw = sessionStorage.getItem('gienco-last-order')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.orderId !== 'string' || !parsed.orderId) return null
    return {
      orderId:       String(parsed.orderId).slice(0, 50),
      totalAmount:   Number(parsed.totalAmount) || 0,
      status:        String(parsed.status || 'pending_payment').slice(0, 30),
      customerEmail: String(parsed.customerEmail || '').slice(0, 254),
      createdAt:     String(parsed.createdAt || '').slice(0, 40)
    }
  } catch {
    return null
  }
}

function formatPrice(value) {
  const n = Number(value)
  if (isNaN(n) || n < 0) return '0,00 €'
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

onMounted(() => {
  order.value = loadOrder()
  // Hacemos scroll a la parte alta — útil si el usuario llega tras el form
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
})

onBeforeUnmount(() => {
  // Limpiar el sessionStorage al salir — el dato ya no es necesario
  // y así si el usuario vuelve por error a /pedido/exito ve el estado neutral.
  try {
    sessionStorage.removeItem('gienco-last-order')
  } catch {
    /* noop */
  }
})
</script>
