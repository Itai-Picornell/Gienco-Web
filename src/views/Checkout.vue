<template>
  <main class="flex-grow pt-20 bg-surface-dark min-h-screen">
    <!-- Cabecera -->
    <section class="relative w-full bg-gradient-to-br from-background-dark via-surface-dark to-background-dark border-b border-[#392829] py-16 pt-28">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>
      <div class="container mx-auto px-4 md:px-10 lg:px-40 relative z-10">
        <h1 class="text-h1-hero font-display leading-none text-white">
          Finalizar pedido
        </h1>
        <p class="text-body-small font-sans-body text-text-muted mt-3">
          Confirma tus datos y completa el pago por Bizum una vez recibido el email de confirmación.
        </p>
      </div>
    </section>

    <!-- Contenido -->
    <section class="py-12">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Formulario -->
          <div class="lg:col-span-2">
            <form
              @submit.prevent="handleSubmit"
              novalidate
              class="bg-background-dark border border-[#392829] rounded-xl p-6 md:p-8"
            >
              <h2 class="text-h3 font-display text-white mb-6">
                Datos de contacto
              </h2>

              <!-- Error general -->
              <div
                v-if="errorMessage"
                role="alert"
                aria-live="assertive"
                class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 animate-fade-in"
              >
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-red-500 mt-0.5" aria-hidden="true">error</span>
                  <p class="text-red-400 text-sm font-medium">{{ errorMessage }}</p>
                </div>
              </div>

              <!-- Datos del usuario autenticado (informativos, no editables) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span class="text-xs font-medium text-gray-300 uppercase tracking-wide block mb-2">
                    Nombre
                  </span>
                  <div class="h-12 px-4 flex items-center rounded-lg bg-[#181111] border border-border-dark text-white text-sm">
                    {{ displayName || '—' }}
                  </div>
                </div>
                <div>
                  <span class="text-xs font-medium text-gray-300 uppercase tracking-wide block mb-2">
                    Email
                  </span>
                  <div class="h-12 px-4 flex items-center rounded-lg bg-[#181111] border border-border-dark text-white text-sm break-all">
                    {{ userEmail || '—' }}
                  </div>
                </div>
              </div>

              <p class="text-xs text-text-muted mb-6 -mt-3">
                Si necesitas cambiar estos datos, actualízalos desde tu perfil.
              </p>

              <!-- Teléfono -->
              <label class="flex flex-col gap-2 mb-5">
                <span class="text-xs font-medium text-gray-300 uppercase tracking-wide">
                  Teléfono móvil <span class="text-red-500">*</span>
                </span>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">
                    +34
                  </span>
                  <input
                    v-model="form.phoneLocal"
                    type="tel"
                    inputmode="numeric"
                    autocomplete="tel-national"
                    maxlength="9"
                    pattern="\d{9}"
                    placeholder="612 345 678"
                    class="w-full h-12 pl-14 pr-4 rounded-lg bg-[#181111] border border-border-dark text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted transition-all"
                    :disabled="isSubmitting"
                    required
                    @input="onPhoneInput"
                  />
                </div>
                <span class="text-[11px] text-text-muted">
                  Solo se usa para coordinar la recogida por WhatsApp tras confirmar el pago. España (+34).
                </span>
              </label>

              <!-- Notas -->
              <label class="flex flex-col gap-2 mb-6">
                <span class="text-xs font-medium text-gray-300 uppercase tracking-wide">
                  Notas para el pedido (opcional)
                </span>
                <textarea
                  v-model="form.notes"
                  maxlength="500"
                  rows="3"
                  placeholder="¿Algo que debamos saber? (preferencias de recogida, comentarios...)"
                  class="w-full px-4 py-3 rounded-lg bg-[#181111] border border-border-dark text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted transition-all resize-none"
                  :disabled="isSubmitting"
                ></textarea>
                <span class="text-[11px] text-text-muted">
                  {{ form.notes.length }} / 500
                </span>
              </label>

              <!-- Términos -->
              <label class="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  v-model="form.termsAccepted"
                  type="checkbox"
                  class="mt-1 w-4 h-4 rounded border-border-dark bg-[#181111] text-primary focus:ring-primary cursor-pointer"
                  :disabled="isSubmitting"
                  required
                />
                <span class="text-sm text-text-muted">
                  He leído y acepto los
                  <router-link to="/terminos" target="_blank" class="text-white hover:underline">
                    términos del servicio
                  </router-link>
                  y la
                  <router-link to="/privacidad" target="_blank" class="text-white hover:underline">
                    política de privacidad
                  </router-link>.
                  Entiendo que el pago se realiza por Bizum y que recibiré un email con las instrucciones.
                </span>
              </label>

              <!-- Botones -->
              <div class="flex flex-col-reverse sm:flex-row gap-3">
                <router-link to="/cart" class="sm:flex-1">
                  <button
                    type="button"
                    class="w-full h-12 rounded-lg bg-card-dark hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    :disabled="isSubmitting"
                  >
                    <span class="material-symbols-outlined text-lg" aria-hidden="true">arrow_back</span>
                    Volver al carrito
                  </button>
                </router-link>
                <button
                  type="submit"
                  :disabled="isSubmitting || !form.termsAccepted"
                  class="sm:flex-1 h-12 rounded-lg bg-black border border-white text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-base" aria-hidden="true">refresh</span>
                  <template v-else>
                    Confirmar pedido
                    <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
                  </template>
                </button>
              </div>
            </form>
          </div>

          <!-- Resumen del pedido -->
          <div class="lg:col-span-1">
            <div class="bg-background-dark border border-[#392829] rounded-xl p-6 sticky top-24">
              <h2 class="text-white text-lg font-bold mb-5 uppercase tracking-tight">
                Tu pedido
              </h2>

              <div class="space-y-3 mb-5 max-h-[300px] overflow-y-auto pr-1">
                <div
                  v-for="item in cartStore.items"
                  :key="`${item.id}-${item.size}`"
                  class="flex items-start gap-3 pb-3 border-b border-border-dark last:border-0"
                >
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-[#181111] flex-shrink-0">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">{{ item.name }}</p>
                    <p class="text-text-muted text-xs">
                      Talla {{ String(item.size).toUpperCase() }} · x{{ item.quantity }}
                    </p>
                  </div>
                  <p class="text-white text-sm font-semibold flex-shrink-0">
                    {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>
              </div>

              <div class="space-y-2 pb-4 border-b border-border-dark">
                <div class="flex justify-between text-text-muted text-sm">
                  <span>Subtotal ({{ cartStore.totalItems }} ud.)</span>
                  <span>{{ formatPrice(cartStore.totalPrice) }}</span>
                </div>
                <div class="flex justify-between text-text-muted text-sm">
                  <span>Envío</span>
                  <span class="text-green-500 font-medium">Recogida gratis</span>
                </div>
              </div>

              <div class="flex justify-between text-white text-lg font-bold pt-4">
                <span>Total</span>
                <span class="text-primary">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>

              <div class="mt-5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p class="text-xs text-amber-400 leading-relaxed">
                  <span class="material-symbols-outlined text-sm align-middle mr-1" aria-hidden="true">info</span>
                  El pago se hace por <strong>Bizum</strong> tras confirmar el pedido. Recibirás un email con el número y las instrucciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
/**
 * @file Checkout.vue
 * @description Pantalla de finalización del pedido.
 *
 * Flujo:
 *   1. Validar precondiciones (sesión activa + carrito no vacío). Si falla,
 *      redirigir a /login o /products según corresponda.
 *   2. Mostrar formulario con teléfono y notas. Nombre/email vienen del JWT
 *      y no son editables aquí (deben actualizarse desde el perfil).
 *   3. Al enviar, transformar los items del carrito al formato de la API
 *      (productId, variant, unitPrice) y POST al backend.
 *   4. Si éxito, guardar el resultado en sessionStorage y redirigir a
 *      /pedido/exito. El backend envía el email con instrucciones de Bizum.
 *
 * Seguridad:
 *   · El precio se envía pero el backend lo recalcula — el cliente no es
 *     fuente de verdad para importes.
 *   · El email del cliente se extrae del JWT en la Lambda, no del body —
 *     no se puede falsificar identidad aunque manipulen el cliente.
 *   · Toda interpolación usa {{ }} (Vue escapa HTML por defecto). Sin v-html.
 *   · Doble defensa contra envío múltiple: flag isSubmitting + disabled.
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { post } from '../services/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const API_URL = import.meta.env.VITE_API_URL || ''
const ORDERS_ENDPOINT = `${API_URL}/orders`

// ─── Estado del formulario ───────────────────────────────────────────────────

const form = ref({
  phoneLocal: '',     // Solo los 9 dígitos nacionales (España)
  notes: '',
  termsAccepted: false
})

const isSubmitting = ref(false)
const errorMessage = ref('')

// ─── Datos del usuario (informativos) ────────────────────────────────────────

const userEmail = computed(() =>
  authStore.userAttributes?.email ||
  authStore.user?.signInDetails?.loginId ||
  ''
)

const displayName = computed(() => {
  const given  = (authStore.userAttributes?.given_name || '').trim()
  const family = (authStore.userAttributes?.family_name || '').trim()
  const full   = `${given} ${family}`.trim()
  if (full) return full
  return (authStore.userAttributes?.name || '').trim()
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value) {
  const n = Number(value)
  if (isNaN(n) || n < 0) return '0,00 €'
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

/**
 * Filtra todo lo que no sea un dígito mientras el usuario escribe el teléfono.
 * Evita pegar texto con espacios, guiones o el prefijo +34 al inicio.
 *
 * @param {Event} e
 */
function onPhoneInput(e) {
  const digits = (e.target.value || '').replace(/\D/g, '').slice(0, 9)
  form.value.phoneLocal = digits
}

/**
 * Valida los campos del formulario antes de enviar.
 *
 * @returns {string|null} Mensaje de error, o null si está todo OK.
 */
function validateForm() {
  if (cartStore.items.length === 0) {
    return 'Tu carrito está vacío.'
  }
  if (!userEmail.value) {
    return 'No se pudo verificar tu email. Cierra sesión e inicia sesión de nuevo.'
  }
  if (!displayName.value) {
    return 'Tu cuenta no tiene un nombre asociado. Actualiza tu perfil antes de hacer un pedido.'
  }
  const phone = (form.value.phoneLocal || '').trim()
  if (!/^\d{9}$/.test(phone)) {
    return 'Introduce un teléfono móvil válido de 9 dígitos.'
  }
  if (!form.value.termsAccepted) {
    return 'Debes aceptar los términos del servicio para continuar.'
  }
  if (form.value.notes && form.value.notes.length > 500) {
    return 'Las notas no pueden exceder 500 caracteres.'
  }
  return null
}

// ─── Submit ──────────────────────────────────────────────────────────────────

async function handleSubmit() {
  if (isSubmitting.value) return
  errorMessage.value = ''

  const err = validateForm()
  if (err) {
    errorMessage.value = err
    return
  }

  if (!API_URL) {
    errorMessage.value = 'El servicio de pedidos no está configurado. Contacta con soporte.'
    return
  }

  isSubmitting.value = true

  try {
    // Transformamos los items al formato que espera la Lambda
    const items = cartStore.items.map(item => ({
      productId: item.id,
      name:      item.name,
      variant:   item.size,
      quantity:  Number(item.quantity),
      unitPrice: Number(item.price)
    }))

    // Mandamos email y nombre porque el access token de Cognito no los incluye.
    // La Lambda los acepta como fallback (sigue confiando en el `sub` del JWT
    // como identidad real, así que no se puede impersonar a otro usuario).
    const payload = {
      customerEmail: userEmail.value,
      customerName:  displayName.value,
      customerPhone: `34${form.value.phoneLocal.trim()}`,
      customerNotes: form.value.notes.trim(),
      items
    }

    const result = await post(ORDERS_ENDPOINT, payload)

    if (!result?.orderId) {
      throw new Error('Respuesta del servidor inválida.')
    }

    // Guardamos los datos del pedido en sessionStorage para mostrarlos en
    // la página de éxito. sessionStorage se limpia al cerrar la pestaña,
    // así que no quedan rastros del pedido si el usuario se va.
    try {
      sessionStorage.setItem('gienco-last-order', JSON.stringify({
        orderId:     result.orderId,
        totalAmount: result.totalAmount,
        status:      result.status || 'pending_payment',
        customerEmail: userEmail.value,
        createdAt:   new Date().toISOString()
      }))
    } catch {
      // Si sessionStorage falla (modo privado, etc.) no es crítico
    }

    cartStore.clearCart()
    router.push('/pedido/exito')

  } catch (error) {
    errorMessage.value = error?.message || 'No se pudo procesar el pedido. Inténtalo de nuevo.'
    if (import.meta.env.DEV) console.error('[Checkout] Error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// ─── Guardas de entrada ──────────────────────────────────────────────────────

onMounted(async () => {
  // 1. Comprobar autenticación. Si no, redirigir a login.
  await authStore.checkAuth()
  if (!authStore.isAuthenticated) {
    router.replace({ path: '/login', query: { redirect: '/checkout' } })
    return
  }

  // 2. Si el carrito está vacío, no tiene sentido estar aquí.
  if (cartStore.items.length === 0) {
    notificationStore.alert('Tu carrito está vacío.', 'Carrito Vacío')
    router.replace('/products')
    return
  }
})
</script>
