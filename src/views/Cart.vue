<template>
  <main class="flex-grow pt-20">
    <!-- Header Section -->
    <section class="relative w-full bg-gradient-to-br from-background-dark via-surface-dark to-background-dark border-b border-[#392829] py-16 pt-28">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div class="container mx-auto px-4 md:px-10 lg:px-40 relative z-10">
        <div class="flex items-center gap-4 mb-6">

          <div>
            <h1 class="text-4xl md:text-5xl leading-tight tracking-wide text-white" style="font-family: 'Cinzel Decorative', serif; font-weight: 700;">
              Carrito de Compra
            </h1>
            <p class="text-text-muted text-sm mt-2">{{ cartStore.totalItems }} artículos en tu carrito</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty Cart State -->
    <section v-if="cartStore.items.length === 0" class="py-20 bg-surface-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="text-center max-w-md mx-auto">
          <div class="w-24 h-24 rounded-full bg-card-dark flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-text-muted text-5xl">shopping_cart</span>
          </div>
          <h2 class="text-white text-2xl font-bold mb-3">Tu carrito está vacío</h2>
          <p class="text-text-muted mb-8">¡Añade merchandising increíble para comenzar!</p>
          <router-link to="/products">
            <button class="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-black border border-white hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider mx-auto">
              <span class="material-symbols-outlined">storefront</span>
              Ver Productos
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Cart Items -->
    <section v-else class="py-12 bg-surface-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items List -->
          <div class="lg:col-span-2 space-y-4">
            <div 
              v-for="item in cartStore.items" 
              :key="`${item.id}-${item.size}`"
              class="bg-background-dark border border-[#392829] rounded-xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 hover:border-primary/50 transition-colors"
            >
              <!-- Product Image -->
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#181111] flex-shrink-0 mx-auto sm:mx-0">
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-full h-full object-contain p-2"
                />
              </div>
              
              <!-- Product Info and Controls -->
              <div class="flex-1 flex flex-col gap-3">
                <!-- Info -->
                <div>
                  <h3 class="text-white text-base md:text-lg font-bold mb-1">{{ item.name }}</h3>
                  <p class="text-text-muted text-sm mb-2">Talla: {{ item.size }}</p>
                  <p class="text-primary text-lg md:text-xl font-bold">{{ item.price }}€</p>
                </div>
                
                <!-- Quantity Controls and Remove Button -->
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <button 
                      @click="decreaseQuantity(item)"
                      class="w-8 h-8 rounded bg-card-dark hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white"
                    >
                      <span class="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span class="text-white font-bold w-8 text-center">{{ item.quantity }}</span>
                    <button 
                      @click="increaseQuantity(item)"
                      class="w-8 h-8 rounded bg-card-dark hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white"
                    >
                      <span class="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                  
                  <!-- Remove Button -->
                  <button 
                    @click="removeItem(item)"
                    class="text-text-muted hover:bg-white hover:text-black p-2 rounded transition-colors"
                  >
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-background-dark border border-[#392829] rounded-xl p-6 sticky top-24">
              <h2 class="text-white text-xl font-bold mb-6 uppercase tracking-tight">Resumen del Pedido</h2>
              
              <div class="space-y-4 mb-6 pb-6 border-b border-border-dark">
                <div class="flex justify-between text-text-muted">
                  <span>Subtotal ({{ cartStore.totalItems }} artículos)</span>
                  <span>{{ cartStore.totalPrice }}€</span>
                </div>
                <div class="flex justify-between text-text-muted">
                  <span>Envío</span>
                  <span class="text-green-500 font-medium">Gratis</span>
                </div>
              </div>
              
              <div class="flex justify-between text-white text-xl font-bold mb-6">
                <span>Total</span>
                <span class="text-primary">{{ cartStore.totalPrice }}€</span>
              </div>
              
              <button 
                @click="handleCheckout"
                class="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-black border border-white hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider mb-3"
              >
                <span class="material-symbols-outlined">shopping_bag</span>
                Pagar
              </button>
              
              <router-link to="/products">
                <button class="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-card-dark hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wider">
                  <span class="material-symbols-outlined">arrow_back</span>
                  Seguir Comprando
                </button>
              </router-link>
              
              <button 
                @click="clearCart"
                class="w-full mt-4 text-text-muted hover:bg-white hover:text-black px-2 py-1 rounded transition-colors text-sm font-medium"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Incrementa en uno la cantidad de un producto en el carrito
/**
 * Aumenta la cantidad de un item en el carrito en 1 unidad.
 * 
 * @param {Object} item - El objeto producto a modificar.
 */
const increaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.size, item.quantity + 1)
}

// Reduce en uno la cantidad de un producto (mínimo 1)
/**
 * Disminuye la cantidad de un item en el carrito en 1 unidad.
 * No reduce por debajo de 1.
 * 
 * @param {Object} item - El objeto producto a modificar.
 */
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.size, item.quantity - 1)
  }
}

// Elimina un producto específico del carrito
/**
 * Elimina completamente un producto del carrito.
 * 
 * @param {Object} item - El objeto producto a eliminar.
 */
const removeItem = (item) => {
  cartStore.removeFromCart(item.id, item.size)
}

// Vacía completamente el carrito tras confirmación del usuario
/**
 * Solicita confirmación al usuario y vacía todo el carrito.
 * 
 * @async
 * @returns {Promise<void>}
 */
const clearCart = async () => {
  const confirmed = await notificationStore.confirm('¿Estás seguro de que quieres vaciar tu carrito?', 'Vaciar Carrito')
  if (confirmed) {
    cartStore.clearCart()
  }
}

// URL de la función Lambda (API Gateway)
const LAMBDA_ORDER_URL = import.meta.env.VITE_LAMBDA_ORDER_URL

// Procesa el pago verificando autenticación y enviando el pedido al backend
/**
 * Inicia el proceso de checkout.
 * Verifica autenticación con AWS Cognito, valida el carrito y envía el pedido a la API Gateway.
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleCheckout = async () => {
    // Verificar estado de autenticación actualizado
    await authStore.checkAuth()
    
    if (authStore.isAuthenticated) {
        if (cartStore.items.length === 0) {
            await notificationStore.alert('El carrito está vacío')
            return
        }

        const confirmPurchase = await notificationStore.confirm(`¿Confirmar pedido por ${cartStore.totalPrice}€?`, 'Confirmar Pedido')
        if (!confirmPurchase) return

        try {
            // Preparar datos para el backend
            const orderData = {
                userId: authStore.user?.userId || authStore.user?.username,
                totalPrice: cartStore.totalPrice,
                items: cartStore.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    image: item.image
                })),
                userInfo: {
                    // Aquí podrías añadir datos reales si tuviéramos un perfil de usuario con dirección
                    email: authStore.user?.signInDetails?.loginId || 'usuario@gienco.com' 
                }
            }

            // Llamada a la Lambda
            // Nota: En producción, usar axios o fetch es igual. Usamos fetch nativo.
            const response = await fetch(LAMBDA_ORDER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })

            const result = await response.json()

            if (response.ok) {
                await notificationStore.alert(`¡Pedido realizado con éxito!\nID de pedido: ${result.orderId || 'Desconocido'}`, 'Pedido Confirmado')
                cartStore.clearCart()
                // router.push('/profile') // Opcional: ir al historial de pedidos
            } else {
                throw new Error(result.error || 'Error en el servidor')
            }

        } catch (error) {
            console.error('Error al procesar el pedido:', error)
            await notificationStore.alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.', 'Error')
        }

    } else {
        // Redirigir al login guardando la intención de volver
        await notificationStore.alert('Debes iniciar sesión para procesar el pago.', 'Autenticación Requerida')
        router.push({ path: '/login', query: { redirect: '/cart' } })
    }
}
</script>
