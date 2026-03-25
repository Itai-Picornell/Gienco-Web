<template>
  <main class="flex-grow pt-20 relative">
    
    <!-- Designer Grade Toast -->
    <transition name="toast">
      <div v-if="toastMsg" :class="`fixed top-24 right-4 md:right-10 z-50 bg-[#1c1c1e] border ${toastType === 'error' ? 'border-red-500/50' : 'border-white/10'} text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3`">
        <div :class="`w-6 h-6 rounded-full flex items-center justify-center text-black ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'}`">
          <span class="material-symbols-outlined text-[14px] font-bold">{{ toastType === 'error' ? 'close' : 'check' }}</span>
        </div>
        <span class="text-sm font-medium tracking-tight">{{ toastMsg }}</span>
      </div>
    </transition>

    <!-- Hero Section -->
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

    <!-- Products Grid (Flex wrap Layout) -->
    <section class="py-12 bg-[#000000] font-sans relative z-10 min-h-screen">
      <div class="container mx-auto px-4">

        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <span class="material-symbols-outlined animate-spin text-white opacity-50 text-4xl">sync</span>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-400 mt-2 text-sm font-medium">{{ error }}</p>
        </div>

        <div v-else class="flex flex-wrap justify-center gap-4 md:gap-6 max-w-7xl mx-auto">
          <div
            v-for="producto in products"
            :key="producto.id"
            class="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-[280px] bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden group hover:border-neutral-600 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
          >
            <!-- Grupo Imagen + Título -->
            <div class="flex flex-col gap-0.5">
              <!-- Imagen arriba -->
              <div class="relative w-full aspect-square overflow-hidden bg-[#0a0a0a]">
                <img
                  :src="producto.image"
                  :alt="producto.name"
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  @error="(e) => e.target.src = 'https://placehold.co/600x600/181111/FFF?text=Gienco+Merch'"
                />
              </div>

              <!-- Título inmediatamente debajo -->
              <div class="px-3 md:px-5 pt-3">
                <h3 class="uppercase tracking-widest font-serif text-xs sm:text-sm font-bold text-center whitespace-normal leading-tight break-words mb-2 text-white">
                  {{ producto.name }}
                </h3>
              </div>
            </div>

            <!-- Controles debajo de la imagen y el título -->
            <div class="px-3 md:px-5 pb-3 md:pb-5 flex flex-col flex-grow">

              <div class="flex-grow"></div>

              <!-- Fila 1: Talla y Precio -->
              <div class="flex items-center justify-between gap-2 mb-3">
                <div class="w-full sm:w-auto relative">
                  <select
                    v-model="orderSelections[producto.id].selectedSize"
                    class="w-full bg-neutral-900 border border-neutral-700 text-white text-left text-xs sm:text-sm rounded-lg pl-3 pr-8 py-0 h-8 appearance-none cursor-pointer hover:border-neutral-500 transition-colors uppercase font-bold focus:outline-none"
                  >
                    <option :value="null" disabled>Talla</option>
                    <option v-for="talla in producto.sizes" :key="talla" :value="talla" class="uppercase">
                      {{ talla }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-neutral-400">
                    <span class="material-symbols-outlined text-[1rem]">expand_more</span>
                  </div>
                </div>

                <div class="text-gray-300 font-semibold text-sm sm:text-base sm:shrink-0 whitespace-nowrap">
                  {{ formatPriceSafe(producto.price * (orderSelections[producto.id]?.quantity || 1)) }}
                </div>
              </div>

              <!-- Fila 2: Cantidad y CTA -->
              <div class="flex items-center justify-between gap-2">
                <!-- Stepper -->
                <div class="w-1/2 flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded-lg p-1 h-8">
                  <button
                    @click="decrementarCantidad(producto.id)"
                    :disabled="(orderSelections[producto.id]?.quantity ?? 1) <= 1"
                    class="w-8 h-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    v-model="orderSelections[producto.id].quantity"
                    @input="validarCantidad(producto.id, producto.maxorder)"
                    @blur="blurCantidad(producto.id)"
                    class="w-10 bg-transparent text-center text-white font-bold text-xs sm:text-sm outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 min-w-0"
                  />
                  <button
                    @click="incrementarCantidad(producto.id, producto.maxorder)"
                    :disabled="cantidadesDisponibles(producto) <= 0"
                    class="w-8 h-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>

                <!-- CTA Botón -->
                <button
                  @click="agregarAlCarrito(producto)"
                  :disabled="!orderSelections[producto.id]?.selectedSize || (cantidadesDisponibles(producto) <= 0 && isNewAdd(producto))"
                  :class="[
                    'w-1/2 flex items-center justify-center rounded-lg h-8 transition-all duration-300 text-xs font-bold tracking-wide uppercase active:scale-95',
                    orderSelections[producto.id]?.selectedSize
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-md shadow-white/10'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-800'
                  ]"
                >
                  {{ orderSelections[producto.id]?.selectedSize ? 'AÑADIR' : 'AÑADIR' }}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const products = ref([])
const isLoading = ref(true)
const error = ref(null)

// El objeto del Local State por cada producto
const orderSelections = ref({})

// Toasts
const toastMsg = ref('')
const toastType = ref('success') // 'success' o 'error'
let toastTimeout

const IMAGE_PLACEHOLDER = 'https://placehold.co/600x600/181111/FFF?text=Gienco+Merch'

const formatPriceSafe = (value) => {
  const numericValue = Number(value)
  if (isNaN(numericValue)) return '0,00 €'
  return numericValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

const normalizeDynamoProduct = (raw) => {
  const parseTallas = (tallasObj) => {
    if (!tallasObj) return []
    if (Array.isArray(tallasObj)) return tallasObj
    if (tallasObj.L && Array.isArray(tallasObj.L)) return tallasObj.L.map(t => t.S || t)
    return []
  }

  const rawImage = raw.imagen?.S || raw.imagen
  
  return {
    id: raw.productId?.S || raw.productId,
    name: raw.nombre?.S || raw.nombre || 'Producto sin nombre',
    price: Number(raw.precio?.N || raw.precio || 0),
    image: rawImage || IMAGE_PLACEHOLDER,
    maxorder: Number(raw.maxorder?.N || raw.maxorder || 50),
    sizes: parseTallas(raw.tallas)
  }
}

const fetchProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`)
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
    const data = await response.json()
    products.value = data.map(normalizeDynamoProduct)
    
    // Inicializar
    products.value.forEach(p => {
      orderSelections.value[p.id] = { quantity: 1, selectedSize: null }
    })
  } catch (e) {
    error.value = 'No se pudieron cargar los productos en este momento.'
    console.error('[fetchProducts]', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProducts)

const getSelection = (id) => {
  if (!orderSelections.value[id]) orderSelections.value[id] = { quantity: 1, selectedSize: null }
  return orderSelections.value[id]
}

// Saber cuánto puedo poner basandome en lo que ya hay en el cart
const cantidadesDisponibles = (producto) => {
  const sel = getSelection(producto.id)
  
  // Getter del Store: Devuelve suma de units que hay en carrito de todos los items que tienen el mismo id
  let yaEnCarrito = 0;
  if(cartStore.getProductQuantity) {
      yaEnCarrito = cartStore.getProductQuantity(producto.id);
  } else {
     yaEnCarrito = cartStore.items.reduce((acc, curr) => curr.id === producto.id ? acc + curr.quantity : acc, 0)
  }
  
  const remaining = producto.maxorder - yaEnCarrito
  return remaining - (sel.quantity - 1) // Remaining for the [+] button allowed step
}

const isNewAdd = (producto) => {
  let yaEnCarrito = 0;
  if(cartStore.getProductQuantity) {
      yaEnCarrito = cartStore.getProductQuantity(producto.id);
  } else {
     yaEnCarrito = cartStore.items.reduce((acc, curr) => curr.id === producto.id ? acc + curr.quantity : acc, 0)
  }
  return yaEnCarrito >= producto.maxorder
}

const validarCantidad = (id, maxorder) => {
  const sel = getSelection(id)
  let val = Number(sel.quantity)
  
  let yaEnCarrito = 0;
  if(cartStore.getProductQuantity) yaEnCarrito = cartStore.getProductQuantity(id);
  else yaEnCarrito = cartStore.items.reduce((acc, curr) => curr.id === id ? acc + curr.quantity : acc, 0);

  const maxReal = Math.max(1, maxorder - yaEnCarrito)
  
  if (val > maxReal) sel.quantity = maxReal
}

const blurCantidad = (id) => {
  const sel = getSelection(id)
  let val = parseInt(sel.quantity, 10)
  if (isNaN(val) || val < 1) sel.quantity = 1
}

const incrementarCantidad = (id, maxorder) => {
  const sel = getSelection(id)
  let val = parseInt(sel.quantity, 10) || 1
  
  let yaEnCarrito = 0;
  if(cartStore.getProductQuantity) yaEnCarrito = cartStore.getProductQuantity(id);
  else yaEnCarrito = cartStore.items.reduce((acc, curr) => curr.id === id ? acc + curr.quantity : acc, 0);

  const maxReal = Math.max(1, maxorder - yaEnCarrito)

  if (val < maxReal) sel.quantity = val + 1
}

const decrementarCantidad = (id) => {
  const sel = getSelection(id)
  let val = parseInt(sel.quantity, 10) || 1
  if (val > 1) sel.quantity = val - 1
}

const showToast = (msg, type = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMsg.value = ''
  }, 3000)
}

const agregarAlCarrito = (producto) => {
  const sel = getSelection(producto.id)
  if (!sel.selectedSize) return

  try {
    cartStore.addToCart(
      {
        id: producto.id,
        name: producto.name,
        price: producto.price,
        image: producto.image,
        maxorder: producto.maxorder
      },
      sel.selectedSize,
      sel.quantity
    )
    
    showToast(`Añadido: ${producto.name}`, 'success')
    // Reset inputs
    sel.quantity = 1
    sel.selectedSize = null

  } catch (err) {
    showToast(err.message, 'error')
    
    // Auto adjust al máximo que deja
    let yaEnCarrito = 0;
    if(cartStore.getProductQuantity) yaEnCarrito = cartStore.getProductQuantity(producto.id);
    else yaEnCarrito = cartStore.items.reduce((acc, curr) => curr.id === producto.id ? acc + curr.quantity : acc, 0);
    
    const available = producto.maxorder - yaEnCarrito
    sel.quantity = Math.max(1, available)
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
