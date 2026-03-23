import { defineStore } from 'pinia'
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, resendSignUpCode, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'

const APP_MODE = import.meta.env.VITE_APP_MODE || 'web'

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
     * Recupera atributos del usuario y verifica grupos (Admins/Customers).
     * 
     * @async
     * @returns {Promise<boolean>} True si el usuario está autenticado, False en caso contrario.
     */
    async checkAuth() {
      try {
        const user = await getCurrentUser()
        this.user = user
        this.isAuthenticated = true

        // Obtener atributos del usuario (nombre, email, etc.)
        const attributes = await fetchUserAttributes()
        this.userAttributes = attributes

        // Verificar si es admin obteniendo los grupos del token
        const session = await fetchAuthSession()
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] || []
        this.isAdmin = groups.includes('Admins')

        // Aplicar Role Enforcement según el modo de la app
        await this.enforceRole()

        return true
      } catch (error) {
        this.user = null
        this.userAttributes = null
        this.isAuthenticated = false
        this.isAdmin = false
        
        // Propagar explícitamente la excepción de Rol para que el Router pueda redirigir
        if (error?.message === 'UNAUTHORIZED_ROLE') {
          throw error
        }
        return false
      }
    },

    /**
     * Inicia sesión en la aplicación utilizando AWS Cognito.
     * El identificador es el correo electrónico del usuario.
     * 
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<boolean>} True si el inicio de sesión fue exitoso, False si falló.
     */
    async login(email, password) {
      this.authError = null
      try {
        const { isSignedIn, nextStep } = await signIn({ username: email, password })

        if (isSignedIn) {
          this.isAuthenticated = true
          await this.checkAuth()
          return true
        } else {
          console.log('Login next step:', nextStep)
          this.authError = `Paso requerido: ${nextStep.signInStep}`
          return false
        }
      } catch (error) {
        console.error('Login error:', error)
        if (error?.message === 'UNAUTHORIZED_ROLE') {
          this.authError = 'No tienes permisos de Administrador para acceder a este entorno.'
        } else {
          this.authError = error.message
        }
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
     * Registra un nuevo usuario en el User Pool de AWS Cognito.
     * El inicio de sesión es por email. El atributo obligatorio 'name' se envía como user attribute.
     * 
     * @async
     * @param {string} email - Correo electrónico (usado como identificador de login).
     * @param {string} password - Contraseña del usuario.
     * @param {string} name - Nombre completo del usuario.
     * @returns {Promise<{success: boolean, isSignUpComplete?: boolean, nextStep?: Object, error?: string}>} Resultado del registro.
     */
    async register(email, password, name) {
      this.authError = null
      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              name
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
     * Confirma el registro de un usuario mediante el código de verificación (OTP) enviado por email.
     * 
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} code - Código de confirmación de 6 dígitos.
     * @returns {Promise<{success: boolean, isSignUpComplete?: boolean, error?: string}>} Resultado de la confirmación.
     */
    async confirmRegistration(email, code) {
      this.authError = null
      try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username: email,
          confirmationCode: code
        })
        return { success: true, isSignUpComplete }
      } catch (error) {
        console.error('Confirm registration error:', error)
        this.authError = error.message
        return { success: false, error: error.message }
      }
    },

    /**
     * Reenvía el código de verificación (OTP) al correo electrónico del usuario.
     * Útil cuando el usuario no recibe el email de confirmación original.
     * 
     * @async
     * @param {string} email - Correo electrónico del usuario registrado.
     * @returns {Promise<{success: boolean, error?: string}>} Resultado del reenvío.
     */
    async resendCode(email) {
      this.authError = null
      try {
        await resendSignUpCode({ username: email })
        return { success: true }
      } catch (error) {
        console.error('Resend code error:', error)
        this.authError = error.message
        return { success: false, error: error.message }
      }
    },

    /**
     * Aplica la política de acceso basada en roles y la variable de entorno VITE_APP_MODE.
     * Si la app está en modo 'admin' y el usuario no pertenece al grupo Admins, se fuerza el signOut.
     * 
     * @async
     * @returns {Promise<void>}
     */
    async enforceRole() {
      if (APP_MODE === 'admin' && !this.isAdmin) {
        console.warn('Role Enforcement: Usuario expulsado. Se requiere rol de Administrador.')
        await this.logout()
        throw new Error('UNAUTHORIZED_ROLE')
      }
    }
  }
})
