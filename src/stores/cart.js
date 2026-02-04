import { defineStore } from 'pinia'

const STORAGE_KEY = 'shoppingCart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  }),

  getters: {
    // Suma total de cantidades
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    // Precio total (precio * cantidad)
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },

  actions: {
    // Añade producto o incrementa cantidad si ya existe
    addToCart(product, size = 'M') {
      const existingItem = this.items.find(
        item => item.id === product.id && item.size === size
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: size,
          quantity: 1
        })
      }

      this.saveToLocalStorage()
    },

    // Elimina item por id y talla
    removeFromCart(itemId, size) {
      const index = this.items.findIndex(
        item => item.id === itemId && item.size === size
      )
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    // Actualiza cantidad (mínimo 1)
    updateQuantity(itemId, size, quantity) {
      const item = this.items.find(
        item => item.id === itemId && item.size === size
      )
      if (item) {
        item.quantity = Math.max(1, quantity)
        this.saveToLocalStorage()
      }
    },

    // Vacía el carrito
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    // Persiste en localStorage
    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    }
  }
})
