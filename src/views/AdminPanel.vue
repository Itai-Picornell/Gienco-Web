<template>
  <main class="flex-grow pt-28">
    <!-- Header Section -->
    <section class="relative w-full bg-gradient-to-br from-background-dark via-surface-dark to-background-dark border-b border-[#392829]">
      <div class="container mx-auto px-4 md:px-10 lg:px-40 py-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-4xl">admin_panel_settings</span>
            </div>
            <div>
              <h1 class="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">Panel de Administración</h1>
              <p class="text-gray-400 text-sm mt-1">Gestionar Pedidos de Gienco Band</p>
            </div>
          </div>
          <button 
            @click="handleLogout"
            class="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-black border border-white hover:bg-white hover:text-black transition-colors text-white text-sm font-bold uppercase tracking-wide"
          >
            <span class="material-symbols-outlined text-lg">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </section>

    <!-- Orders Section -->
    <section class="py-12 bg-background-dark">
      <div class="container mx-auto px-4 md:px-10 lg:px-40">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-white text-2xl font-bold uppercase tracking-tight">Pedidos Recientes</h2>
          <button @click="fetchOrders" class="text-white text-sm font-bold hover:bg-white hover:text-black px-3 py-1 rounded transition-colors uppercase flex items-center gap-2">
            <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': isLoading }">refresh</span>
            Actualizar
          </button>
        </div>

        <div v-if="isLoading" class="flex justify-center py-12">
           <span class="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
        </div>

        <div v-else-if="error" class="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center">
            <p class="text-red-400 mb-2">{{ error }}</p>
            <button @click="fetchOrders" class="text-white underline text-sm">Intentar de nuevo</button>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-400">
            <span class="material-symbols-outlined text-5xl mb-4 opacity-50">shopping_cart_off</span>
            <p>No hay pedidos registrados aún.</p>
        </div>

        <div v-else class="bg-surface-dark border border-[#392829] rounded-xl overflow-hidden">
          <div class="divide-y divide-[#392829]">
            <div 
              v-for="order in orders" 
              :key="order.orderId"
              class="p-6 hover:bg-white/10 transition-colors"
            >
              <div class="flex flex-col md:flex-row md:items-center gap-4">
                <!-- Icon -->
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-white text-xl">shopping_bag</span>
                </div>
                
                <!-- Main Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-bold text-lg">Pedido {{ order.orderId }}</h3>
                  <p class="text-gray-300 text-sm mt-1">
                    <span class="text-gray-500">Usuario:</span> {{ order.email || order.userId }}
                  </p>
                   <p class="text-gray-400 text-xs mt-1">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>

                <!-- Products Summary -->
                <div class="hidden md:block flex-1 border-l border-[#392829] pl-4">
                    <p class="text-sm text-gray-400 mb-1">Productos:</p>
                    <ul class="text-xs text-gray-300">
                        <li v-for="(item, idx) in order.items.slice(0, 2)" :key="idx">
                            {{ item.quantity }}x {{ item.name }} ({{ item.size }})
                        </li>
                        <li v-if="order.items.length > 2" class="text-gray-500 italic">
                            +{{ order.items.length - 2 }} más...
                        </li>
                    </ul>
                </div>

                <!-- Price and Status -->
                <div class="flex items-center gap-4 mt-4 md:mt-0 justify-between md:justify-end min-w-[150px]">
                    <div class="text-right">
                        <p class="text-white font-black text-xl">{{ typeof order.totalCurrentPrice === 'number' ? order.totalCurrentPrice.toFixed(2) : order.totalCurrentPrice }}€</p>
                    </div>
                    
                    <span 
                        class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        :class="getStatusClass(order.status)"
                    >
                        {{ getStatusText(order.status) }}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Footer from '../components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const orders = ref([])
const isLoading = ref(false)
const error = ref('')

// URL del API Gateway (Asegúrate de haber creado la ruta GET /pedidos)
const API_URL = import.meta.env.VITE_API_ORDERS_URL

const fetchOrders = async () => {
    isLoading.value = true
    error.value = ''
    try {
        // Note: Currently not sending Authorization header to avoid issues
        // The Lambda function doesn't validate auth yet, but this should be added in the future
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) {
            throw new Error('Error al conectar con el servidor')
        }

        const data = await response.json()
        orders.value = data
    
    } catch (err) {
        console.error('Error fetching orders:', err)
        error.value = 'No se pudieron cargar los pedidos. Verifica tu conexión o la API.'
    } finally {
        isLoading.value = false
    }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const formatDate = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(date)
}

const getStatusClass = (status) => {
    switch(status) {
        case 'COMPLETED': return 'bg-green-500/10 text-green-500'
        case 'PENDING': return 'bg-yellow-500/10 text-yellow-500'
        case 'CANCELLED': return 'bg-red-500/10 text-red-500'
        default: return 'bg-blue-500/10 text-blue-500'
    }
}

const getStatusText = (status) => {
    switch(status) {
        case 'COMPLETED': return 'Completado'
        case 'PENDING': return 'Pendiente'
        case 'CANCELLED': return 'Cancelado'
        default: return status || 'Pendiente'
    }
}

onMounted(() => {
    fetchOrders()
})
</script>
