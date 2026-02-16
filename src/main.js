// Configuración e inicialización de la aplicación Vue
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// AWS Amplify Configuration
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

app.use(pinia)  // Gestión de estado global
app.use(router) // Navegación entre páginas
app.mount('#app')
