<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import Footer from '../components/Footer.vue'

const cartStore = useCartStore()
const selectedSizes = ref({}) // { productId: 'M', productId2: 'L', ... }

// Guarda la talla seleccionada para un producto
const selectSize = (productId, size) => {
  selectedSizes.value[productId] = size
}

// Añade producto al carrito con la talla seleccionada
const addToCart = (product) => {
  const selectedSize = selectedSizes.value[product.id]
  if (!selectedSize) {
    alert('Please select a size first')
    return
  }
  cartStore.addToCart(product, selectedSize)
  selectedSizes.value[product.id] = null // Reset
}

const products = ref([
  {
    id: 1,
    name: 'Classic Red Logo Tee',
    description: 'Premium cotton t-shirt with exclusive Gienco Band logo',
    price: 25,
    image: '/1.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'Tour Edition Tee',
    description: 'Limited edition tour merchandise with back print',
    price: 25,
    image: '/2.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    name: 'Echoes of Red Tee',
    description: 'Album artwork t-shirt in premium black cotton',
    price: 25,
    image: '/3.png',
    sizes: ['S', 'M', 'L', 'XL']
  }
])
</script>
