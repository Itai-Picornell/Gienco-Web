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

  // Valida credenciales y guarda en localStorage
  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      isAuthenticated.value = true
      localStorage.setItem('adminAuth', 'true')
      return true
    }
    return false
  }

  // Cierra sesión
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
