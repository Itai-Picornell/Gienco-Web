<template>
  <main class="flex-grow pt-20 relative">
    
    <transition name="toast">
      <div
        v-if="toastMsg"
        role="status"
        aria-live="polite"
        :class="`fixed top-24 right-4 md:right-10 z-50 bg-[#1c1c1e] border ${toastType === 'error' ? 'border-red-500/50' : 'border-white/10'} text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3`"
      >
        <div :class="`w-6 h-6 rounded-full flex items-center justify-center text-black ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'}`">
          <span class="material-symbols-outlined text-[14px] font-bold" aria-hidden="true">
            {{ toastType === 'error' ? 'close' : 'check' }}
          </span>
        </div>
        <span class="text-sm font-medium tracking-tight">{{ toastMsg }}</span>
      </div>
    </transition>

    <section class="relative w-full bg-gradient-to-b from-background-dark to-surface-dark pb-10 pt-16 font-sans">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>
      <div class="container mx-auto px-4 md:px-8 lg:px-20 relative z-10">
        <div class="text-center max-w-2xl mx-auto">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tight text-white mb-4 break-words">
            MERCHANDISING
          </h1>
          <p class="text-neutral-400 text-lg font-light tracking-wide">
            Viste nuestra música
          </p>
        </div>
      </div>
    </section>

    <section class="py-12 bg-[#000000] font-sans relative z-10 min-h-screen">
      <div class="container mx-auto px-4">

        <div v-if="isLoading" class="flex justify-center items-center py-20" aria-label="Cargando productos" role="status">
          <span class="material-symbols-outlined animate-spin text-white opacity-50 text-4xl" aria-hidden="true">sync</span>
        </div>

        <div v-else-if="error" class="text-center py-20" role="alert">
          <p class="text-red-400 mt-2 text-sm font-medium">{{ error }}</p>
        </div>

        <div v-else class="flex flex-wrap justify-center gap-4 md:gap-6 max-w-7xl mx-auto">
          <article
            v-for="(producto, index) in products"
            :key="producto.id"
            class="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-[280px] bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden group hover:border-neutral-600 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
          >
            <div class="flex flex-col gap-0.5">
              <div class="relative w-full aspect-square overflow-hidden bg-[#0a0a0a]">
                <img
                  :src="producto.image"
                  :alt="producto.name"
                  width="400"
                  height="400"
                  :loading="index < 4 ? 'eager' : 'lazy'"
                  :fetchpriority="index < 4 ? 'high' : 'auto'"
                  decoding="async"
                  class="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
              <div class="px-3 md:px-5 pt-3">
                <h3 class="uppercase tracking-widest font-serif text-xs sm:text-sm font-bold text-center whitespace-normal leading-tight break-words mb-2 text-white">
                  {{ producto.name }}
                </h3>
              </div>
            </div>

            <div class="px-3 md:px-5 pb-3 md:pb-5 flex flex-col flex-grow">
              <div class="flex-grow"></div>

              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="w-full sm:w-auto relative">
                  <select
                    v-model="orderSelections[producto.id].selectedSize"
                    :aria-label="`Seleccionar talla para ${producto.name}`"
                    class="w-full bg-neutral-900 border border-neutral-700 text-white text-left text-xs sm:text-sm rounded-lg pl-3 pr-8 py-0 h-8 appearance-none cursor-pointer hover:border-neutral-500 transition-colors uppercase font-bold focus:outline-none"
                  >
                    <option :value="null" disabled>Talla</option>
                    <option v-for="talla in producto.sizes" :key="talla" :value="talla" class="uppercase">
                      {{ talla }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-neutral-400">
                    <span class="material-symbols-outlined text-[1rem]" aria-hidden="true">expand_more</span>
                  </div>
                </div>

                <div class="text-gray-300 font-semibold text-sm sm:text-base sm:shrink-0 whitespace-nowrap" aria-label="Precio">
                  {{ formatPriceSafe(producto.price * (orderSelections[producto.id]?.quantity || 1)) }}
                </div>
              </div>

              <div class="flex items-center justify-between gap-2">
                <div class="w-1/2 flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded-lg p-1 h-8" role="group" aria-label="Selector de cantidad">
                  <button
                    @click="decrementarCantidad(producto.id)"
                    :disabled="(orderSelections[producto.id]?.quantity ?? 1) <= 1"
                    :aria-label="`Disminuir cantidad de ${producto.name}`"
                    class="w-8 h-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    v-model="orderSelections[producto.id].quantity"
                    @input="validarCantidad(producto.id, producto.maxorder)"
                    @blur="blurCantidad(producto.id)"
                    :aria-label="`Cantidad actual de ${producto.name}`"
                    class="w-10 bg-transparent text-center text-white font-bold text-xs sm:text-sm outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 min-w-0"
                  />
                  <button
                    @click="incrementarCantidad(producto.id, producto.maxorder)"
                    :disabled="cantidadesDisponibles(producto) <= 0"
                    :aria-label="`Aumentar cantidad de ${producto.name}`"
                    class="w-8 h-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  @click="agregarAlCarrito(producto)"
                  :disabled="!orderSelections[producto.id]?.selectedSize || (cantidadesDisponibles(producto) <= 0 && isNewAdd(producto)) || isAddingToCart[producto.id]"
                  :class="[
                    'w-1/2 flex items-center justify-center rounded-lg h-8 transition-all duration-300 text-xs font-bold tracking-wide uppercase active:scale-95',
                    orderSelections[producto.id]?.selectedSize && !isAddingToCart[producto.id]
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-md shadow-white/10'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-800'
                  ]"
                >
                  <span v-if="isAddingToCart[producto.id]" class="material-symbols-outlined animate-spin text-sm" aria-hidden="true">refresh</span>
                  <span v-else>AÑADIR</span>
                </button>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

/**
 * SEGURIDAD: Validación de origen del CDN
 */
const ALLOWED_CDN_ORIGINS = ['https://d2iume3cn1sk35.cloudfront.net']
const cdnUrl = (() => {
  const url = import.meta.env.VITE_CDN_URL || ''
  if (!url) return ''
  try {
    const origin = new URL(url).origin
    return ALLOWED_CDN_ORIGINS.includes(origin) ? url : ''
  } catch { return '' }
})()

const products = ref([])
const isLoading = ref(true)
const error = ref(null)
const orderSelections = ref({})
const isAddingToCart = reactive({})

const toastMsg = ref('')
const toastType = ref('success')
let toastTimeout = null
let fetchAbortController = null

// ─── Utilidades de Seguridad ───────────────────────────────────────────────

const sanitizeHTML = (str) => {
  if (!str) return ''
  return String(str).replace(/[&<>"']/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[tag]))
}

const sanitizeImagePath = (path) => {
  if (!path) return 'placeholder.webp'
  return path.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '').trim()
}

const formatPriceSafe = (value) => {
  const numericValue = Number(value)
  if (isNaN(numericValue) || numericValue < 0) return '0,00 €'
  return numericValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

const normalizeDynamoProduct = (raw) => {
  const parseTallas = (t) => {
    if (!t) return []
    if (Array.isArray(t)) return t
    if (t.L) return t.L.map(item => sanitizeHTML(item.S || item))
    try { return typeof t === 'string' ? JSON.parse(t) : [] } catch { return [] }
  }

  const rawImage = raw.imagen?.S || raw.imagen || ''
  const fileName = sanitizeImagePath(rawImage)
  
  return {
    id: sanitizeHTML(raw.productId?.S || raw.productId),
    name: sanitizeHTML(raw.nombre?.S || raw.nombre || 'Producto sin nombre'),
    price: Math.max(0, Number(raw.precio?.N || raw.precio || 0)),
    image: `${cdnUrl}/images/merch/${fileName}`,
    thumbnail: `${cdnUrl}/images/merch/${fileName.replace('.webp', '-thumb.webp')}`,
    maxorder: Math.min(100, Math.max(1, Number(raw.maxorder?.N || raw.maxorder || 50))),
    sizes: parseTallas(raw.tallas?.S || raw.tallas)
  }
}

// ─── Fetch & Lifecycle ──────────────────────────────────────────────────────

const fetchProducts = async () => {
  fetchAbortController = new AbortController()
  const timeoutId = setTimeout(() => fetchAbortController.abort(), 10000)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
      signal: fetchAbortController.signal
    })
    clearTimeout(timeoutId)

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`)
    const data = await response.json()
    products.value = data.map(normalizeDynamoProduct)
    
    products.value.forEach(p => {
      orderSelections.value[p.id] = { quantity: 1, selectedSize: null }
      isAddingToCart[p.id] = false
    })
  } catch (e) {
    if (e.name === 'AbortError') return
    error.value = 'No se pudieron cargar los productos en este momento.'
    if (import.meta.env.DEV) console.error('[fetchProducts Error]:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProducts)

onBeforeUnmount(() => {
  fetchAbortController?.abort()
  if (toastTimeout) clearTimeout(toastTimeout)
})

// ─── Lógica de Carrito ──────────────────────────────────────────────────────

const getUnidadesEnCarrito = (productoId) => {
  if (cartStore.getProductQuantity) return cartStore.getProductQuantity(productoId)
  return cartStore.items?.reduce((acc, curr) => curr.id === productoId ? acc + curr.quantity : acc, 0) || 0
}

const cantidadesDisponibles = (producto) => {
  const sel = orderSelections.value[producto.id]
  const yaEnCarrito = getUnidadesEnCarrito(producto.id)
  const remaining = producto.maxorder - yaEnCarrito
  return remaining - (sel.quantity - 1)
}

const isNewAdd = (producto) => getUnidadesEnCarrito(producto.id) >= producto.maxorder

const validarCantidad = (id, maxorder) => {
  const sel = orderSelections.value[id]
  let val = Number(sel.quantity)
  if (isNaN(val) || val <= 0) { sel.quantity = 1; return }
  const yaEnCarrito = getUnidadesEnCarrito(id)
  const maxReal = Math.max(1, maxorder - yaEnCarrito)
  if (val > maxReal) sel.quantity = maxReal
}

const blurCantidad = (id) => {
  const sel = orderSelections.value[id]
  const val = parseInt(sel.quantity, 10)
  if (isNaN(val) || val < 1) sel.quantity = 1
}

const incrementarCantidad = (id, maxorder) => {
  const sel = orderSelections.value[id]
  const val = parseInt(sel.quantity, 10) || 1
  const yaEnCarrito = getUnidadesEnCarrito(id)
  const maxReal = Math.max(1, maxorder - yaEnCarrito)
  if (val < maxReal) sel.quantity = val + 1
}

const decrementarCantidad = (id) => {
  const sel = orderSelections.value[id]
  const val = parseInt(sel.quantity, 10) || 1
  if (val > 1) sel.quantity = val - 1
}

const showToast = (msg, type = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => { toastMsg.value = '' }, 3000)
}

const agregarAlCarrito = async (producto) => {
  const sel = orderSelections.value[producto.id]
  if (!sel.selectedSize) return showToast('Selecciona una talla primero', 'error')

  const cantidadDeseada = parseInt(sel.quantity, 10)
  const yaEnCarrito = getUnidadesEnCarrito(producto.id)
  if ((yaEnCarrito + cantidadDeseada) > producto.maxorder) {
    return showToast(`Stock limitado. Máximo ${producto.maxorder} unidades.`, 'error')
  }

  isAddingToCart[producto.id] = true

  try {
    await cartStore.addToCart(
      {
        id: producto.id,
        name: producto.name,
        price: producto.price,
        image: producto.image,
        maxorder: producto.maxorder
      },
      sel.selectedSize,
      cantidadDeseada
    )
    showToast(`Añadido: ${producto.name}`, 'success')
    sel.quantity = 1
    sel.selectedSize = null
  } catch (err) {
    showToast(err.message || 'Error al añadir al carrito', 'error')
  } finally {
    isAddingToCart[producto.id] = false
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from { opacity: 0; transform: translateY(-20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }

/* FIX: CSS Vendor Prefix & Standard Property */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>