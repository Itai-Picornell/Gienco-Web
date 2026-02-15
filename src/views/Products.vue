<template>
  <main class="flex-grow">
    <!-- Hero Section -->
    <section class="relative w-full bg-gradient-to-br from-background-dark via-surface-dark to-background-dark border-b border-[#392829] py-20">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div class="container mx-auto px-4 md:px-10 lg:px-40 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-black leading-none tracking-tighter text-white mb-6">
            MERCHANDISING
          </h1>
          <p class="text-text-muted text-lg md:text-xl font-normal leading-relaxed">
            Viste nuestra música
          </p>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="py-16 bg-surface-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="producto in productos" 
            :key="producto.id"
            class="bg-background-dark border border-[#392829] rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
          >
            <!-- Product Image -->
            <div class="relative aspect-square overflow-hidden bg-[#181111]">
              <img 
                :src="producto.image" 
                :alt="producto.name"
                class="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
                <span class="text-white text-xs font-bold uppercase tracking-wider">Nuevo</span>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-6">
              <h3 class="text-white text-xl font-bold mb-2 group-hover:text-black transition-colors">
                {{ producto.name }}
              </h3>
              <p class="text-text-muted text-sm mb-4">
                {{ producto.description }}
              </p>
              
              <!-- Price & Sizes -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex flex-col">
                  <span class="text-primary text-2xl font-black">{{ producto.price }}€</span>
                  <span class="text-text-muted text-xs">Envío gratis</span>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="text-text-muted text-xs text-right">Elige talla:</span>
                  <div class="flex gap-2">
                    <button 
                      v-for="talla in producto.sizes" 
                      :key="talla"
                      @click="seleccionarTalla(producto.id, talla)"
                      :class="[
                        'w-8 h-8 flex items-center justify-center border rounded text-xs font-bold transition-colors',
                        tallasSeleccionadas[producto.id] === talla 
                          ? 'bg-white border-white text-black' 
                          : 'border-border-dark text-white hover:bg-white hover:text-black hover:border-white'
                      ]"
                    >
                      {{ talla }}
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Add to Cart Button -->
              <button 
                @click="agregarAlCarrito(producto)"
                :disabled="!tallasSeleccionadas[producto.id]"
                :class="[
                  'w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 transition-colors text-sm font-bold uppercase tracking-wider',
                  tallasSeleccionadas[producto.id]
                    ? 'bg-black border border-white hover:bg-white hover:text-black text-white active:scale-95 cursor-pointer'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                ]"
              >
                <span class="material-symbols-outlined">shopping_cart</span>
                {{ tallasSeleccionadas[producto.id] ? 'Añadir al Carrito' : 'Elige Talla Primero' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useNotificationStore } from '../stores/notification'
import Footer from '../components/Footer.vue'

const almacenCarrito = useCartStore()
const notificationStore = useNotificationStore()
const tallasSeleccionadas = ref({}) // {productId: 'M', productId2: 'L'}

// Guarda la talla seleccionada para un producto
const seleccionarTalla = (idProducto, talla) => {
  tallasSeleccionadas.value[idProducto] = talla
}

// Añade producto al carrito con talla seleccionada
const agregarAlCarrito = async (producto) => {
  const tallaSeleccionada = tallasSeleccionadas.value[producto.id]
  if (!tallaSeleccionada) {
    await notificationStore.alert('Por favor, elige una talla primero', 'Selecciona Talla')
    return
  }
  almacenCarrito.addToCart(producto, tallaSeleccionada)
  tallasSeleccionadas.value[producto.id] = null // Reset
}

const productos = ref([
  {
    id: 1,
    name: 'Gienco',
    description: 'BÁSICA',
    price: 15,
    image: '/images/merch/1.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'Nada bajo control',
    description: 'VERSIÓN LILA',
    price: 25,
    image: '/images/merch/2.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    name: 'Nada bajo control',
    description: 'VERSIÓN VERDE',
    price: 25,
    image: '/images/merch/3.png',
    sizes: ['S', 'M', 'L', 'XL']
  }
])
</script>
