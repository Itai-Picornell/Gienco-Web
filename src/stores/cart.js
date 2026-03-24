import { defineStore } from 'pinia'

const STORAGE_KEY = 'shoppingCart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    // Getter útil para limitar dinámicamente cuántas unidades hay ya en el carrito
    getProductQuantity: (state) => {
      return (productId) => state.items.reduce((total, item) => item.id === productId ? total + item.quantity : total, 0)
    }
  },

  actions: {
    /**
     * Añade un producto al carrito o incrementa su cantidad si ya existe (mismo ID y Talla).
     * 
     * @param {Object} product - Objeto del producto normalizado (contiene maxorder).
     * @param {string} size - Talla seleccionada.
     * @param {number} quantity - Cantidad a añadir.
     */
    addToCart(product, size, quantity) {
      const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1)
      const maxOrder = product.maxorder || 50

      const existingItem = this.items.find(
        item => item.id === product.id && item.size === size
      )

      // Regla pedida explícitamente:
      const currentQty = existingItem ? existingItem.quantity : 0;

      if (currentQty + safeQuantity > maxOrder) {
         const remainingAllowed = Math.max(0, maxOrder - currentQty)
         
         if (remainingAllowed > 0) {
            if (existingItem) {
               existingItem.quantity += remainingAllowed
            } else {
               this.items.push({
                 id: product.id,
                 name: product.name,
                 price: product.price,
                 image: product.image,
                 size: size,
                 quantity: remainingAllowed,
                 maxorder: maxOrder
               })
            }
            this.saveToLocalStorage()
            throw new Error(`Ajustado. Solo puedes añadir ${remainingAllowed} unidades más.`)
         } else {
            throw new Error(`Ups. Ya tienes el límite permitido de este producto (${maxOrder}).`)
         }
      }

      // Si todo va bien
      if (existingItem) {
        existingItem.quantity += safeQuantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: size,
          quantity: safeQuantity,
          maxorder: maxOrder
        })
      }

      this.saveToLocalStorage()
    },

    removeFromCart(itemId, size) {
      const index = this.items.findIndex(
        item => item.id === itemId && item.size === size
      )
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    updateQuantity(itemId, size, quantity) {
      const item = this.items.find(
        item => item.id === itemId && item.size === size
      )
      if (item) {
         const maxOrder = item.maxorder || 50
         item.quantity = Math.min(Math.max(1, quantity), maxOrder)
         this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    }
  }
})
