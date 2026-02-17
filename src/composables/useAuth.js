import { ref } from 'vue'

const isAuthenticated = ref(false)

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '12345'
}

// Composable para autenticación de admin
export function useAuth() {
  // Restaurar sesión desde localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminAuth')
    if (stored === 'true') {
      isAuthenticated.value = true
    }
  }

  /**
   * Valida credenciales de administrador y persiste la sesión si son correctas.
   * Credenciales hardcodeadas para acceso simple al panel.
   * 
   * @param {string} username - Nombre de usuario.
   * @param {string} password - Contraseña.
   * @returns {boolean} True si las credenciales son válidas, False en caso contrario.
   */
  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      isAuthenticated.value = true
      localStorage.setItem('adminAuth', 'true')
      return true
    }
    return false
  }

  /**
   * Cierra la sesión de administrador y elimina la persistencia local.
   * 
   * @returns {void}
   */
  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('adminAuth')
  }

  return {
    isAuthenticated,
    login,
    logout
  }
}
