/**
 * @file useCookieConsent.js
 * @description Estado global de consentimiento de cookies de terceros.
 *
 * Las cookies técnicas necesarias no requieren consentimiento. El contenido
 * embebido de terceros (Spotify) sí puede instalar cookies, así que el
 * art. 22.2 de la LSSI exige consentimiento previo: no se carga hasta que el
 * usuario acepta en el banner.
 *
 * El estado es un singleton (definido a nivel de módulo) para que el banner y
 * el reproductor compartan la misma decisión, y se persiste en localStorage.
 */
import { ref } from 'vue'

const STORAGE_KEY = 'gienco_cookie_consent'

/**
 * Lee la decisión guardada. Devuelve 'accepted', 'rejected' o null.
 * Envuelto en try/catch porque localStorage puede lanzar (modo privado, etc.).
 */
function readStored() {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        return value === 'accepted' || value === 'rejected' ? value : null
    } catch {
        return null
    }
}

// Singleton: se evalúa una sola vez al importar el módulo.
const consent = ref(readStored())

function persist(value) {
    try {
        localStorage.setItem(STORAGE_KEY, value)
    } catch {
        // Sin persistencia (modo privado / bloqueado): la decisión vale para esta sesión.
    }
}

export function useCookieConsent() {
    const accept = () => {
        consent.value = 'accepted'
        persist('accepted')
    }
    const reject = () => {
        consent.value = 'rejected'
        persist('rejected')
    }
    // Reabre el banner para permitir cambiar la decisión.
    const reset = () => {
        consent.value = null
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch {
            // no-op
        }
    }

    return { consent, accept, reject, reset }
}
