/**
 * @file useContent.js
 * @description Composable para leer textos editables (gestionados desde el panel
 *   admin) desde la API pública.
 *
 *   Implementa:
 *     · Caché en dos niveles (memoria + localStorage) con TTL.
 *     · Deduplicación de peticiones concurrentes a la misma sección.
 *     · Sanitización defensiva de la respuesta — la web no se rompe ante
 *       payloads malformados.
 *     · Defaults como fallback — si la API se cae, los textos originales
 *       (los que estaban hardcoded) siguen apareciendo.
 *
 *   Uso:
 *     const content = useContent('home', {
 *       hero_title: 'Bienvenido',
 *       hero_subtitle: 'Música que vibra'
 *     })
 *
 *     <h1>{{ content.fields.hero_title }}</h1>
 *
 *   IMPLEMENTACIÓN:
 *   Devolvemos un objeto `reactive()` (no `ref()`) para que el acceso anidado
 *   `content.fields.X` funcione directamente en el template sin necesidad de
 *   `.value` ni de destructuring. Los refs anidados en objetos planos NO se
 *   auto-desempaquetan en templates de Vue 3.
 *
 *   Las claves de `defaults` deben coincidir con las del schema definido en
 *   Gienco_Admin (src/config/contentSchema.js) para que la edición sea efectiva.
 */
import { reactive, onMounted } from 'vue'

/**
 * Tiempo de vida del caché.
 * En desarrollo: 0 ms → siempre re-fetcha para ver cambios del admin al instante.
 * En producción: 10 minutos → evita peticiones innecesarias.
 */
const CACHE_TTL_MS = import.meta.env.DEV ? 0 : 10 * 60 * 1000

/** Caché en memoria por sesión. Más rápido que localStorage en navegación. */
const memCache = new Map()

/** Promesas en vuelo, para dedupar peticiones concurrentes a la misma sección. */
const inFlight = new Map()

/** Prefijo del key en localStorage — evita colisiones con otras claves del sitio. */
const STORAGE_PREFIX = 'gienco_content_'

/**
 * Obtiene la URL base de la API pública desde el entorno, validándola.
 * Si la variable está mal formada o ausente, devolvemos null en lugar de
 * lanzar — la web sigue funcionando con los defaults.
 *
 * @returns {string|null}
 */
function getApiBase() {
  const url = import.meta.env.VITE_API_URL
  if (!url || typeof url !== 'string') return null
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

/**
 * Sanitiza el objeto fields recibido (de la API o del caché).
 * Solo conserva entradas con clave string no vacía y valor string.
 * Defensa en profundidad ante payloads inesperados o caché corrupto.
 *
 * @param {unknown} raw
 * @returns {Object<string,string>}
 */
function sanitizeFields(raw) {
  if (!raw || typeof raw !== 'object') return {}
  const clean = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof key === 'string' && key && typeof value === 'string') {
      clean[key] = value
    }
  }
  return clean
}

/**
 * Lee del caché (memoria primero, luego localStorage) si todavía es válido.
 *
 * @param {string} section
 * @returns {Object<string,string>|null}
 */
function readCache(section) {
  // 1. Memoria
  const mem = memCache.get(section)
  if (mem && Date.now() < mem.expires) return mem.data

  // 2. localStorage
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${section}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.expires !== 'number' ||
      Date.now() >= parsed.expires
    ) {
      return null
    }

    const data = sanitizeFields(parsed.data)
    // Promociona a memoria para futuras lecturas en esta sesión
    memCache.set(section, { data, expires: parsed.expires })
    return data
  } catch {
    // localStorage puede fallar (incógnito, quota) o el JSON estar corrupto.
    return null
  }
}

/**
 * Persiste en ambos niveles de caché.
 *
 * @param {string} section
 * @param {Object<string,string>} data
 */
function writeCache(section, data) {
  const expires = Date.now() + CACHE_TTL_MS
  const entry = { data, expires }
  memCache.set(section, entry)
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${section}`, JSON.stringify(entry))
  } catch {
    // Quota excedida o modo privado — seguimos con caché en memoria.
  }
}

/**
 * Hace el fetch real a la API. Devuelve los fields ya sanitizados.
 *
 * @param {string} section
 * @returns {Promise<Object<string,string>>}
 * @throws {Error} Si la API URL no está configurada o el endpoint responde !2xx.
 */
async function fetchFromApi(section) {
  const base = getApiBase()
  if (!base) throw new Error('API URL no configurada')

  const url = `${base}/content?section=${encodeURIComponent(section)}`
  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json().catch(() => ({}))
  return sanitizeFields(json?.fields)
}

/**
 * Hook para leer textos editables de una sección.
 *
 * @param {string} section - ID de la sección (debe existir en el schema admin).
 * @param {Object<string,string>} [defaults={}] - Textos por defecto si la API
 *        falla o aún no terminó de cargar. Las claves DEBEN coincidir con las
 *        del schema en Gienco_Admin para que la edición sea efectiva.
 * @returns {{
 *   fields: Object<string,string>,
 *   isLoading: boolean,
 *   refetch: () => Promise<void>
 * }} Objeto reactive — accede directamente a `.fields.X` en templates.
 */
export function useContent(section, defaults = {}) {
  // Estado reactive — el acceso `content.fields.X` en templates funciona
  // sin destructuring porque reactive auto-proxa todas las propiedades anidadas.
  const state = reactive({
    fields: { ...defaults },
    isLoading: false
  })

  /**
   * Carga el contenido (de caché o de la API) y actualiza el estado.
   * Expuesto como `content.refetch()` por si el consumidor quiere forzar recarga.
   */
  async function refetch() {
    if (typeof section !== 'string' || !section) {
      if (import.meta.env.DEV) console.warn('[useContent] section inválida:', section)
      return
    }

    // Cache hit → resolución casi-síncrona
    const cached = readCache(section)
    if (cached) {
      state.fields = { ...defaults, ...cached }
      return
    }

    // Dedupar peticiones concurrentes a la misma sección
    let promise = inFlight.get(section)
    if (!promise) {
      promise = fetchFromApi(section).finally(() => inFlight.delete(section))
      inFlight.set(section, promise)
    }

    state.isLoading = true
    try {
      const data = await promise
      writeCache(section, data)
      state.fields = { ...defaults, ...data }
    } catch (err) {
      // Sin throw: el componente sigue funcionando con los defaults.
      if (import.meta.env.DEV) {
        console.warn(`[useContent] No se pudo cargar la sección "${section}":`, err)
      }
    } finally {
      state.isLoading = false
    }
  }

  // Adjunta refetch al estado. Las funciones no se proxan ni se hacen reactivas
  // por reactive(), pero son accesibles vía `content.refetch()`.
  state.refetch = refetch

  onMounted(refetch)

  return state
}
