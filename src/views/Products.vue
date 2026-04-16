<template>
  <main class="flex-grow pt-20 relative">

    <!-- Toast -->
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

    <!-- Hero -->
    <section class="relative w-full bg-gradient-to-b from-background-dark to-surface-dark pb-10 pt-16 font-sans">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>
      <div class="container mx-auto px-4 md:px-8 lg:px-20 relative z-10 text-center max-w-2xl mx-auto">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tight text-white mb-4">
          MERCHANDISING
        </h1>
        <p class="text-neutral-400 text-lg font-light tracking-wide">Viste nuestra música</p>
      </div>
    </section>

    <!-- Productos -->
    <section class="py-12 bg-black font-sans relative z-10 min-h-screen">
      <div class="container mx-auto px-4">

        <!-- Skeleton -->
        <div v-if="isLoading" class="flex flex-wrap justify-center gap-4 md:gap-6 max-w-7xl mx-auto">
          <div
            v-for="n in 8" :key="n"
            class="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-[280px] bg-[#111] border border-neutral-800 rounded-xl overflow-hidden"
          >
            <div class="aspect-square bg-neutral-900 animate-pulse"></div>
            <div class="p-4 space-y-3">
              <div class="h-3 bg-neutral-800 rounded animate-pulse w-3/4 mx-auto"></div>
              <div class="h-8 bg-neutral-800 rounded animate-pulse"></div>
              <div class="h-8 bg-neutral-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20" role="alert">
          <span class="material-symbols-outlined text-red-400 text-5xl mb-4 block">error</span>
          <p class="text-red-400 text-sm font-medium">{{ error }}</p>
          <button
            @click="fetchProducts"
            class="mt-6 px-6 py-2 border border-neutral-700 text-neutral-400 text-sm rounded-lg hover:border-neutral-500 hover:text-white transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- Estado vacío -->
        <div v-else-if="products.length === 0" class="text-center py-20">
          <span class="material-symbols-outlined text-neutral-700 text-5xl mb-4 block">inventory_2</span>
          <p class="text-neutral-500 text-sm">No hay productos disponibles en este momento.</p>
        </div>

        <!-- Grid de productos -->
        <div v-else class="flex flex-wrap justify-center gap-4 md:gap-6 max-w-7xl mx-auto">
          <article
            v-for="(producto, index) in products"
            :key="producto.id"
            class="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-[280px] bg-[#111] border border-neutral-800 rounded-xl overflow-hidden group hover:border-neutral-600 transition-all duration-500 hover:shadow-2xl flex flex-col"
          >
            <!-- Imagen -->
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

            <!-- Nombre -->
            <div class="px-4 pt-3">
              <h3 class="uppercase tracking-widest font-serif text-xs sm:text-sm font-bold text-center leading-tight break-words text-white">
                {{ producto.name }}
              </h3>
            </div>

            <!-- Controles -->
            <div class="px-4 pb-4 mt-auto pt-3 flex flex-col gap-2">

              <!-- Talla + Precio -->
              <div class="flex items-center gap-2">
                <div class="flex-1 relative">
                  <select
                    v-model="orderSelections[producto.id].selectedSize"
                    :aria-label="`Talla para ${producto.name}`"
                    class="w-full bg-neutral-900 border border-neutral-700 text-white text-xs rounded-lg pl-3 pr-8 h-8 appearance-none cursor-pointer hover:border-neutral-500 transition-colors uppercase font-bold focus:outline-none focus:border-neutral-500"
                  >
                    <option :value="null" disabled>Talla</option>
                    <option v-for="talla in producto.sizes" :key="talla" :value="talla">{{ talla }}</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-base pointer-events-none" aria-hidden="true">expand_more</span>
                </div>
                <span class="text-gray-300 font-semibold text-sm shrink-0" aria-label="Precio">
                  {{ formatPriceSafe(producto.price * (orderSelections[producto.id]?.quantity || 1)) }}
                </span>
              </div>

              <!-- Cantidad + Añadir -->
              <div class="flex items-center gap-2">
                <div class="w-1/2 flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded-lg px-1 h-8" role="group" :aria-label="`Cantidad de ${producto.name}`">
                  <button
                    @click="decrementarCantidad(producto.id)"
                    :disabled="(orderSelections[producto.id]?.quantity ?? 1) <= 1"
                    :aria-label="`Menos ${producto.name}`"
                    class="w-7 h-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >−</button>
                  <input
                    type="number"
                    min="1"
                    :max="producto.maxorder"
                    step="1"
                    v-model.number="orderSelections[producto.id].quantity"
                    @input="validarCantidad(producto.id, producto.maxorder)"
                    @blur="blurCantidad(producto.id)"
                    :aria-label="`Cantidad de ${producto.name}`"
                    class="w-8 bg-transparent text-center text-white font-bold text-xs outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                  />
                  <button
                    @click="incrementarCantidad(producto.id, producto.maxorder)"
                    :disabled="disponibilidad[producto.id] <= 0"
                    :aria-label="`Más ${producto.name}`"
                    class="w-7 h-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >+</button>
                </div>

                <button
                  @click="agregarAlCarrito(producto)"
                  :disabled="!orderSelections[producto.id]?.selectedSize || disponibilidad[producto.id] <= 0 || isAddingToCart[producto.id]"
                  :aria-label="`Añadir ${producto.name} al carrito`"
                  :class="[
                    'w-1/2 flex items-center justify-center rounded-lg h-8 transition-all duration-300 text-xs font-bold tracking-wide uppercase active:scale-95',
                    orderSelections[producto.id]?.selectedSize && !isAddingToCart[producto.id]
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-md shadow-white/10'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
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
import { ref, reactive, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { useCartStore } from '../stores/cart'
import { cdnUrl } from '../utils/cdn'
import { sanitizeHTML, sanitizeImagePath } from '../utils/security'

const cartStore = useCartStore()

const products = ref([])
const isLoading = ref(true)
const error = ref(null)
const orderSelections = reactive({})   // reactive en lugar de ref
const isAddingToCart = reactive({})

const toastMsg = ref('')
const toastType = ref('success')
let fetchAbortController = null

// ─── Toast con watchEffect — se limpia automáticamente ─────────────────────
watchEffect((onCleanup) => {
  if (!toastMsg.value) return
  const t = setTimeout(() => { toastMsg.value = '' }, 3000)
  onCleanup(() => clearTimeout(t))
})

// ─── Utilidades ─────────────────────────────────────────────────────────────

const formatPriceSafe = (value) => {
  const n = Number(value)
  if (isNaN(n) || n < 0) return '0,00 €'
  return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

const normalizeDynamoProduct = (raw) => {
  const parseTallas = (t) => {
    if (!t) return []
    if (Array.isArray(t)) return t
    if (t.L) return t.L.map(item => sanitizeHTML(item.S || item))
    try { return typeof t === 'string' ? JSON.parse(t) : [] } catch { return [] }
  }
  const fileName = sanitizeImagePath(raw.imagen?.S || raw.imagen || '')
  return {
    id: sanitizeHTML(raw.productId?.S || raw.productId),
    name: sanitizeHTML(raw.nombre?.S || raw.nombre || 'Producto sin nombre'),
    price: Math.max(0, Number(raw.precio?.N || raw.precio || 0)),
    image: `${cdnUrl}/images/merch/${fileName}`,
    maxorder: Math.min(100, Math.max(1, Number(raw.maxorder?.N || raw.maxorder || 50))),
    sizes: parseTallas(raw.tallas?.S || raw.tallas)
  }
}

// ─── Fetch ──────────────────────────────────────────────────────────────────

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null
  fetchAbortController = new AbortController()
  const timeoutId = setTimeout(() => fetchAbortController.abort(), 10000)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
      signal: fetchAbortController.signal,
      headers: { 'Accept': 'application/json' }
    })
    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    products.value = data.map(normalizeDynamoProduct)
    products.value.forEach(p => {
      orderSelections[p.id] = { quantity: 1, selectedSize: null }
      isAddingToCart[p.id] = false
    })
  } catch (e) {
    if (e.name === 'AbortError') return
    error.value = 'No se pudieron cargar los productos en este momento.'
    if (import.meta.env.DEV) console.error('[fetchProducts]:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProducts)
onBeforeUnmount(() => fetchAbortController?.abort())

// ─── Carrito ─────────────────────────────────────────────────────────────────

const getUnidadesEnCarrito = (id) =>
  cartStore.getProductQuantity?.(id) ??
  cartStore.items?.reduce((acc, c) => c.id === id ? acc + c.quantity : acc, 0) ?? 0

// Computed centralizado — evita recalcular en cada render del template
const disponibilidad = computed(() => {
  const result = {}
  products.value.forEach(p => {
    const enCarrito = getUnidadesEnCarrito(p.id)
    const sel = orderSelections[p.id]
    result[p.id] = p.maxorder - enCarrito - ((sel?.quantity || 1) - 1)
  })
  return result
})

const validarCantidad = (id, maxorder) => {
  const sel = orderSelections[id]
  const val = Number(sel.quantity)
  if (isNaN(val) || val <= 0) { sel.quantity = 1; return }
  const max = Math.max(1, maxorder - getUnidadesEnCarrito(id))
  if (val > max) sel.quantity = max
}

const blurCantidad = (id) => {
  const val = parseInt(orderSelections[id].quantity, 10)
  if (isNaN(val) || val < 1) orderSelections[id].quantity = 1
}

const incrementarCantidad = (id, maxorder) => {
  const sel = orderSelections[id]
  const max = Math.max(1, maxorder - getUnidadesEnCarrito(id))
  const val = parseInt(sel.quantity, 10) || 1
  if (val < max) sel.quantity = val + 1
}

const decrementarCantidad = (id) => {
  const val = parseInt(orderSelections[id].quantity, 10) || 1
  if (val > 1) orderSelections[id].quantity = val - 1
}

const showToast = (msg, type = 'success') => {
  toastMsg.value = msg
  toastType.value = type
}

// Debounce para evitar añadir duplicados por clicks rápidos
let addingDebounce = null
const agregarAlCarrito = (producto) => {
  if (addingDebounce) return
  addingDebounce = setTimeout(() => { addingDebounce = null }, 300)

  const sel = orderSelections[producto.id]
  if (!sel.selectedSize) return showToast('Selecciona una talla primero', 'error')

  const cantidad = parseInt(sel.quantity, 10)
  const enCarrito = getUnidadesEnCarrito(producto.id)
  if ((enCarrito + cantidad) > producto.maxorder) {
    return showToast(`Máximo ${producto.maxorder} unidades.`, 'error')
  }

  isAddingToCart[producto.id] = true

  try {
    cartStore.addToCart(
      { id: producto.id, name: producto.name, price: producto.price, image: producto.image, maxorder: producto.maxorder },
      sel.selectedSize,
      cantidad
    )
    showToast(`Añadido: ${producto.name}`)
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
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from { opacity: 0; transform: translateY(-20px) scale(0.9); }
.toast-leave-to   { opacity: 0; transform: translateY(-10px) scale(0.95); }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { appearance: none; margin: 0; }
input[type="number"] { appearance: textfield; -moz-appearance: textfield; }
</style>