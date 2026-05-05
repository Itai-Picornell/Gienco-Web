/**
 * @file useGallery.js
 * @description Composable para leer el listado dinámico de imágenes de una
 *   sección desde la API pública (Lambda gienco-gallery-public).
 *
 *   Implementa:
 *     · Caché en dos niveles (memoria + localStorage) con TTL.
 *     · Deduplicación de peticiones concurrentes a la misma sección.
 *     · Sanitización defensiva — la web no se rompe ante payloads malformados.
 *     · Defaults como fallback — si la API se cae, las imágenes hardcoded
 *       siguen apareciendo y la web no se queda en blanco.
 *
 *   Uso:
 *     const gallery = useGallery('home', [
 *       { filename: 'gienco-fallback.webp',
 *         url: `${cdnUrl}/images/backgrounds/home/gienco-fallback.webp` }
 *     ])
 *
 *     <img v-for="img in gallery.items" :src="img.url" :alt="img.filename" />
 *
 *   IMPLEMENTACIÓN: igual que `useContent`, devolvemos un objeto `reactive()`
 *   para que el acceso `gallery.items` funcione directamente en templates sin
 *   `.value`. Los arrays anidados en objetos planos no se auto-desempaquetan.
 *
 *   Las secciones válidas deben coincidir con las definidas en el backend
 *   (ver `SECTION_PREFIXES` en gienco-gallery-public).
 */
import { reactive, onMounted } from 'vue'

/**
 * Tiempo de vida del caché.
 * En desarrollo: 0 ms → siempre re-fetcha para ver cambios al instante.
 * En producción: 10 minutos → reduce peticiones, las imágenes cambian poco.
 */
const CACHE_TTL_MS = import.meta.env.DEV ? 0 : 10 * 60 * 1000

/** Caché en memoria por sesión. Más rápido que localStorage en navegación. */
const memCache = new Map()

/** Promesas en vuelo, para dedupar peticiones concurrentes a la misma sección. */
const inFlight = new Map()

/** Prefijo del key en localStorage — evita colisiones con otras claves del sitio. */
const STORAGE_PREFIX = 'gienco_gallery_'

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
 * Sanitiza el array de items recibido (de la API o del caché).
 * Solo conserva entradas con `filename` y `url` strings no vacías.
 * Defensa en profundidad ante payloads inesperados o caché corrupto.
 *
 * @param {unknown} raw
 * @returns {Array<{filename: string, url: string}>}
 */
function sanitizeItems(raw) {
  if (!Array.isArray(raw)) return []
  const clean = []
  for (const item of raw) {
    if (
      item &&
      typeof item === 'object' &&
      typeof item.filename === 'string' &&
      typeof item.url === 'string' &&
      item.filename &&
      item.url
    ) {
      clean.push({ filename: item.filename, url: item.url })
    }
  }
  return clean
}

/**
 * Lee del caché (memoria primero, luego localStorage) si todavía es válido.
 *
 * @param {string} section
 * @returns {Array<{filename: string, url: string}>|null}
 */
function readCache(section) {
  const mem = memCache.get(section)
  if (mem && Date.now() < mem.expires) return mem.data

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

    const data = sanitizeItems(parsed.data)
    memCache.set(section, { data, expires: parsed.expires })
    return data
  } catch {
    return null
  }
}

/**
 * Persiste en ambos niveles de caché.
 *
 * @param {string} section
 * @param {Array<{filename: string, url: string}>} data
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
 * Hace el fetch real a la API. Devuelve los items ya sanitizados.
 *
 * @param {string} section
 * @returns {Promise<Array<{filename: string, url: string}>>}
 * @throws {Error} Si la API URL no está configurada o el endpoint responde !2xx.
 */
async function fetchFromApi(section) {
  const base = getApiBase()
  if (!base) throw new Error('API URL no configurada')

  const url = `${base}/gallery?section=${encodeURIComponent(section)}`
  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json().catch(() => ({}))
  return sanitizeItems(json?.items)
}

/**
 * Hook para leer el listado dinámico de imágenes de una sección.
 *
 * @param {string} section - ID de la sección (debe existir en el backend).
 * @param {Array<{filename: string, url: string}>} [defaults=[]] - Imágenes por
 *        defecto si la API falla o aún no terminó de cargar. Las claves
 *        DEBEN ser objetos con `filename` y `url`.
 * @returns {{
 *   items: Array<{filename: string, url: string}>,
 *   isLoading: boolean,
 *   refetch: () => Promise<void>
 * }} Objeto reactive — accede directamente a `.items` en templates.
 */
export function useGallery(section, defaults = []) {
  const state = reactive({
    items: [...defaults],
    isLoading: false
  })

  /**
   * Carga las imágenes (de caché o de la API) y actualiza el estado.
   * Expuesto como `gallery.refetch()` para forzar recarga manual.
   */
  async function refetch() {
    if (typeof section !== 'string' || !section) {
      if (import.meta.env.DEV) console.warn('[useGallery] section inválida:', section)
      return
    }

    // Cache hit → resolución casi-síncrona
    const cached = readCache(section)
    if (cached && cached.length > 0) {
      state.items = cached
      return
    }

    // Dedupar peticiones concurrentes
    let promise = inFlight.get(section)
    if (!promise) {
      promise = fetchFromApi(section).finally(() => inFlight.delete(section))
      inFlight.set(section, promise)
    }

    state.isLoading = true
    try {
      const data = await promise
      writeCache(section, data)
      // Si el backend devuelve [], conservamos los defaults para no romper la UI
      state.items = data.length > 0 ? data : [...defaults]
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`[useGallery] No se pudo cargar la sección "${section}":`, err)
      }
    } finally {
      state.isLoading = false
    }
  }

  state.refetch = refetch

  onMounted(refetch)

  return state
}
