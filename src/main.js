// Configuración e inicialización de la aplicación Vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// AWS Amplify Configuration
import { Amplify } from 'aws-amplify'

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
            loginWith: {
                email: true,
            }
        }
    }
})

app.use(pinia)  // Gestión de estado global
app.use(router) // Navegación entre páginas
app.mount('#app')
