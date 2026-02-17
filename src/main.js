/**
 * @file main.js
 * @description Punto de entrada principal de la aplicación Vue.js.
 * Se encarga de la inicialización de plugins (Pinia, Router), configuración de AWS Amplify
 * y montaje de la aplicación en el DOM.
 */
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// --- Configuración de AWS Amplify ---
import { Amplify } from 'aws-amplify'

const userPoolId = import.meta.env.VITE_USER_POOL_ID
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID

console.log('Amplify Config Debug:', {
    userPoolId: userPoolId ? 'Defined' : 'Missing',
    userPoolClientId: userPoolClientId ? 'Defined' : 'Missing'
})

if (!userPoolId || !userPoolClientId) {
    console.error('CRITICAL: Missing Cognito configuration. Check .env or CI/CD secrets.')
}

/**
 * Configura la librería AWS Amplify con los recursos definidos en las variables de entorno.
 * Establece la integración con Amazon Cognito para autenticación.
 */
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: userPoolId,
            userPoolClientId: userPoolClientId,
            loginWith: {
                email: true,
            }
        }
    }
})

// --- Montaje de la Aplicación ---
app.use(pinia)  // Inicializa Pinia para gestión de estado global
app.use(router) // Inicializa Vue Router para manejo de rutas
app.mount('#app') // Monta la aplicación en el elemento #app del DOM
