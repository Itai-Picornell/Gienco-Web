import { defineStore } from 'pinia'
import { signIn, signOut, getCurrentUser, confirmSignIn, signUp, confirmSignUp, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    userAttributes: null,
    authError: null
  }),

  actions: {
    // Inicializa el estado verificando si hay sesión activa
    async checkAuth() {
      try {
        const user = await getCurrentUser()
        this.user = user
        this.isAuthenticated = true

        // Obtener atributos del usuario (nombre, apellido, email, etc.)
        const attributes = await fetchUserAttributes()
        this.userAttributes = attributes

        // Verificar si es admin obteniendo los grupos del token
        const session = await fetchAuthSession()
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] || []
        this.isAdmin = groups.includes('Admins')

        return true
      } catch (error) {
        this.user = null
        this.userAttributes = null
        this.isAuthenticated = false
        this.isAdmin = false
        return false
      }
    },

    // Inicia sesión con Cognito
    async login(username, password) {
      this.authError = null
      try {
        const { isSignedIn, nextStep } = await signIn({ username, password })

        if (isSignedIn) {
          this.isAuthenticated = true
          await this.checkAuth() // Obtener detalles del usuario
          return true
        } else {
          console.log('Login next step:', nextStep)
          // Manejar flujos adicionales como cambiar contraseña si es necesario
          this.authError = `Paso requerido: ${nextStep.signInStep}`
          return false
        }
      } catch (error) {
        console.error('Login error:', error)
        this.authError = error.message
        this.isAuthenticated = false
        return false
      }
    },

    // Cierra sesión
    async logout() {
      try {
        await signOut()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isAuthenticated = false
        this.user = null
        this.userAttributes = null
        this.isAdmin = false
      }
    },

    // Confirmar nueva contraseña (para primer login)
    async confirmNewPassword(newPassword) {
      this.authError = null
      try {
        const { isSignedIn, nextStep } = await confirmSignIn({ challengeResponse: newPassword })

        if (isSignedIn) {
          this.isAuthenticated = true
          await this.checkAuth()
          return true
        } else {
          console.log('ConfirmPassword next step:', nextStep)
          this.authError = `Siguiente paso: ${nextStep.signInStep}`
          return false
        }
      } catch (error) {
        console.error('ConfirmPassword error:', error)
        this.authError = error.message
        return false
      }
    },

    // Registro de nuevo usuario
    async register(username, password, email, firstName, lastName) {
      this.authError = null
      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email,
              given_name: firstName,
              family_name: lastName
              // Puedes añadir más atributos si están configurados en Cognito
            }
          }
        })

        return { success: true, isSignUpComplete, nextStep }
      } catch (error) {
        console.error('Register error:', error)
        this.authError = error.message
        return { success: false, error: error.message }
      }
    },

    // Confirmar registro con código de verificación
    async confirmRegistration(username, code) {
      this.authError = null
      try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username,
          confirmationCode: code
        })
        return { success: true, isSignUpComplete }
      } catch (error) {
        console.error('Confirm registration error:', error)
        this.authError = error.message
        return { success: false, error: error.message }
      }
    }
  }
})
