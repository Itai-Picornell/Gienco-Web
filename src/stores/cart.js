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
    /**
     * Añade un producto al carrito o incrementa su cantidad si ya existe (mismo ID y Talla).
     * Persiste los cambios en LocalStorage.
     * 
     * @param {Object} product - Objeto del producto a añadir (debe incluir id, name, price, image).
     * @param {string} [size='M'] - Talla del producto. Default 'M'.
     */
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

    /**
     * Elimina un producto específico del carrito identificándolo por ID y Talla.
     * 
     * @param {string|number} itemId - ID del producto a eliminar.
     * @param {string} size - Talla del producto a eliminar.
     */
    removeFromCart(itemId, size) {
      const index = this.items.findIndex(
        item => item.id === itemId && item.size === size
      )
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    /**
     * Actualiza la cantidad de un producto específico en el carrito.
     * La cantidad mínima se mantiene en 1.
     * 
     * @param {string|number} itemId - ID del producto.
     * @param {string} size - Talla del producto.
     * @param {number} quantity - Nueva cantidad deseada.
     */
    updateQuantity(itemId, size, quantity) {
      const item = this.items.find(
        item => item.id === itemId && item.size === size
      )
      if (item) {
        item.quantity = Math.max(1, quantity)
        this.saveToLocalStorage()
      }
    },

    /**
     * Elimina todos los productos del carrito y limpia el LocalStorage.
     */
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    /**
     * Guarda el estado actual del carrito en el LocalStorage del navegador
     * para persistencia entre recargas.
     */
    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    }
  }
})
