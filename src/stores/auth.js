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
    /**
     * Inicializa el estado de autenticación verificando la sesión actual con AWS Cognito.
     * Recupera atributos del usuario y verifica grupos (admin).
     * 
     * @async
     * @returns {Promise<boolean>} True si el usuario está autenticado, False en caso contrario.
     */
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

    /**
     * Inicia sesión en la aplicación utilizando AWS Cognito.
     * 
     * @async
     * @param {string} username - Nombre de usuario o correo electrónico.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<boolean>} True si el inicio de sesión fue exitoso, False si falló o requiere pasos adicionales.
     */
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

    /**
     * Cierra la sesión del usuario actual en AWS Cognito y limpia el estado local.
     * 
     * @async
     * @returns {Promise<void>}
     */
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

    /**
     * Confirma el desafío de nueva contraseña (NEW_PASSWORD_REQUIRED) de AWS Cognito.
     * Comúnmente usado cuando un administrador crea un usuario temporal.
     * 
     * @async
     * @param {string} newPassword - La nueva contraseña definida por el usuario.
     * @returns {Promise<boolean>} True si el cambio fue exitoso y se inició sesión, False en caso contrario.
     */
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

    /**
     * Registra un nuevo usuario en el User Pool de AWS Cognito.
     * 
     * @async
     * @param {string} username - Nombre de usuario (generalmente el email).
     * @param {string} password - Contraseña del usuario.
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} firstName - Nombre de pila.
     * @param {string} lastName - Apellido.
     * @returns {Promise<{success: boolean, isSignUpComplete?: boolean, nextStep?: Object, error?: string}>} Resultado del registro.
     */
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
        let msg = error.message
        if (msg.includes('Password did not conform with policy')) {
          msg = 'La contraseña no cumple con la política de seguridad (mínimo 8 caracteres, mayúscula, minúscula y número).'
        } else if (msg.includes('User already exists')) {
          msg = 'El usuario ya está registrado.'
        }
        this.authError = msg
        return { success: false, error: msg }
      }
    },

    /**
     * Confirma el registro de un usuario mediante el código de verificación enviado por email (AWS Cognito).
     * 
     * @async
     * @param {string} username - Nombre de usuario.
     * @param {string} code - Código de confirmación de 6 dígitos.
     * @returns {Promise<{success: boolean, isSignUpComplete?: boolean, error?: string}>} Resultado de la confirmación.
     */
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
