/**
 * @file cart.js
 * @description Store Pinia para la gestión del carrito de compra.
 * Persiste los datos en localStorage con validación segura.
 */
import { defineStore } from 'pinia'

const STORAGE_KEY = 'shoppingCart'
const MAX_CART_ITEMS = 50
const MAX_ITEM_QUANTITY = 100
const MAX_PRICE = 99999

/**
 * Lee y parsea el carrito desde localStorage de forma segura.
 * Si los datos están corruptos o manipulados, devuelve un array vacío
 * y limpia el storage para evitar errores recurrentes.
 *
 * @returns {Array} Array de items del carrito, o vacío si hay errores.
 */
function safeLoadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }

    // Filtrar items inválidos o manipulados
    return parsed.filter(item =>
      item &&
      typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 128 &&
      typeof item.name === 'string' && item.name.length > 0 && item.name.length <= 256 &&
      typeof item.size === 'string' && item.size.length > 0 && item.size.length <= 10 &&
      typeof item.price === 'number' && item.price > 0 && item.price <= MAX_PRICE && Number.isFinite(item.price) &&
      typeof item.quantity === 'number' && item.quantity >= 1 && item.quantity <= MAX_ITEM_QUANTITY && Number.isInteger(item.quantity) &&
      typeof item.image === 'string' && !item.image.startsWith('javascript:')
    ).slice(0, MAX_CART_ITEMS)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

/**
 * Sanitiza y valida un producto antes de insertarlo en el carrito.
 * Previene inyección de datos maliciosos desde la API o manipulación del cliente.
 *
 * @param {Object} product - Producto crudo.
 * @param {string} size - Talla seleccionada.
 * @param {number} quantity - Cantidad a añadir.
 * @returns {Object} Producto sanitizado listo para el carrito.
 */
function sanitizeCartItem(product, size, quantity) {
  return {
    id: String(product.id || '').slice(0, 128),
    name: String(product.name || 'Producto').slice(0, 256),
    price: Math.min(Math.max(0, Number(product.price) || 0), MAX_PRICE),
    image: typeof product.image === 'string' && !product.image.startsWith('javascript:')
      ? product.image.slice(0, 512)
      : '',
    size: String(size || '').slice(0, 10),
    quantity: Math.min(Math.max(1, parseInt(quantity, 10) || 1), MAX_ITEM_QUANTITY),
    maxorder: Math.min(MAX_ITEM_QUANTITY, Math.max(1, Number(product.maxorder) || 50))
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: safeLoadCart()
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        const subtotal = item.price * item.quantity
        return total + (Number.isFinite(subtotal) ? subtotal : 0)
      }, 0)
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
     * @throws {Error} Si se supera el límite de maxorder o el carrito está lleno.
     */
    addToCart(product, size, quantity) {
      // Límite de items diferentes en el carrito
      if (this.items.length >= MAX_CART_ITEMS && !this.items.find(i => i.id === product.id && i.size === size)) {
        throw new Error('El carrito está lleno. Elimina algún producto antes de añadir más.')
      }

      const sanitized = sanitizeCartItem(product, size, quantity)
      const maxOrder = sanitized.maxorder

      const existingItem = this.items.find(
        item => item.id === sanitized.id && item.size === sanitized.size
      )

      const currentQty = existingItem ? existingItem.quantity : 0

      if (currentQty + sanitized.quantity > maxOrder) {
         const remainingAllowed = Math.max(0, maxOrder - currentQty)
         
         if (remainingAllowed > 0) {
            if (existingItem) {
               existingItem.quantity += remainingAllowed
            } else {
               this.items.push({ ...sanitized, quantity: remainingAllowed })
            }
            this.saveToLocalStorage()
            throw new Error(`Ajustado. Solo puedes añadir ${remainingAllowed} unidades más.`)
         } else {
            throw new Error(`Ups. Ya tienes el límite permitido de este producto (${maxOrder}).`)
         }
      }

      // Si todo va bien
      if (existingItem) {
        existingItem.quantity += sanitized.quantity
      } else {
        this.items.push(sanitized)
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
         const safeQty = parseInt(quantity, 10)
         if (isNaN(safeQty)) return
         item.quantity = Math.min(Math.max(1, safeQty), maxOrder)
         this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch {
        // localStorage lleno o no disponible — fallo silencioso, el carrito sigue en memoria
      }
    }
  }
})
