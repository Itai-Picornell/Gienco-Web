import { defineStore } from 'pinia'
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'

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

        // Obtener atributos del usuario (nombre, email)
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
          if (import.meta.env.DEV) console.log('[Auth] Paso adicional requerido:', nextStep)
          this.authError = `Paso requerido: ${nextStep.signInStep}`
          return false
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error('[Auth] Error en login:', error)
        if (error?.message === 'UNAUTHORIZED_ROLE') {
          this.authError = 'No tienes permisos de Administrador para acceder a este entorno.'
        } else {
          // Mensaje genérico — nunca exponer el error crudo de Cognito al usuario
          this.authError = error.message || 'Error en el inicio de sesión.'
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
        if (import.meta.env.DEV) console.error('[Auth] Error en logout:', error)
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
        if (import.meta.env.DEV) console.error('[Auth] Error en registro:', error)
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
        if (import.meta.env.DEV) console.error('[Auth] Error al confirmar registro:', error)
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
        if (import.meta.env.DEV) console.error('[Auth] Error al reenviar código:', error)
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
        if (import.meta.env.DEV) console.warn('[Auth] Acceso denegado: se requiere rol de Administrador.')
        await this.logout()
        throw new Error('UNAUTHORIZED_ROLE')
      }
    },

    /**
     * Inicia el flujo de recuperación de contraseña.
     * Envía un código de verificación (OTP) al email del usuario para que pueda restablecer su contraseña.
     * 
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @returns {Promise<{success: boolean, error?: string}>} Resultado del inicio de recuperación.
     */
    async forgotPassword(email) {
      this.authError = null
      try {
        const result = await resetPassword({ username: email })
        return { success: true }
      } catch (error) {
        if (import.meta.env.DEV) console.error('[Auth] Error en recuperación de contraseña:', error)
        let msg = error.message
        // Mensaje genérico para evitar enumeración de usuarios
        if (msg.includes('User does not exist') || msg.includes('Cannot reset password')) {
          msg = 'Si el correo está registrado, recibirás un código de verificación.'
        } else if (msg.includes('User account is disabled')) {
          msg = 'No se pudo procesar la solicitud. Contacta con soporte.'
        } else if (msg.includes('Too many requests') || msg.includes('Attempt limit exceeded')) {
          msg = 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.'
        } else {
          msg = 'No se pudo procesar la solicitud. Inténtalo de nuevo.'
        }
        this.authError = msg
        return { success: false, error: msg }
      }
    },

    /**
     * Confirma el restablecimiento de contraseña usando el código de verificación.
     * Se llama después de que el usuario ingresa el código OTP y la nueva contraseña.
     * 
     * @async
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} code - Código de confirmación de 6 dígitos.
     * @param {string} newPassword - Nueva contraseña del usuario.
     * @returns {Promise<{success: boolean, error?: string}>} Resultado de la confirmación de recuperación.
     */
    async confirmForgotPassword(email, code, newPassword) {
      this.authError = null
      try {
        await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword
        })
        return { success: true }
      } catch (error) {
        if (import.meta.env.DEV) console.error('[Auth] Error al restablecer contraseña:', error)
        let msg = error.message
        if (msg.includes('Incorrect confirmation code')) {
          msg = 'El código ingresado es incorrecto.'
        } else if (msg.includes('Attempt limit exceeded')) {
          msg = 'Número de intentos excedido. Solicita un nuevo código.'
        }
        this.authError = msg
        return { success: false, error: msg }
      }
    }
  }
})
