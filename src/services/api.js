/**
 * @file api.js
 * @description Servicio centralizado para llamadas HTTP autenticadas.
 * Inyecta automáticamente el JWT de AWS Cognito en cada petición.
 * Las URLs se pasan completas al llamar a get() o post().
 */
import { fetchAuthSession } from 'aws-amplify/auth'

/**
 * Obtiene los headers de autenticación con el token JWT de la sesión activa de Cognito.
 * Si no hay sesión activa, devuelve headers sin Authorization.
 *
 * @async
 * @returns {Promise<Object>} Headers con Content-Type y Authorization (si disponible).
 */
async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }

  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.accessToken?.toString()

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  } catch (error) {
    if (import.meta.env.DEV) console.warn('No se pudo obtener el token de sesión:', error)
  }

  return headers
}

/**
 * Realiza una petición GET autenticada.
 *
 * @async
 * @param {string} url - URL completa del endpoint (ej: 'https://xyz.execute-api.../products').
 * @returns {Promise<any>} Datos parseados de la respuesta JSON.
 * @throws {Error} Si la respuesta del servidor no es 2xx.
 */
async function get(url) {
  const headers = await getAuthHeaders()

  const response = await fetch(url, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Error al conectar con el servidor')
  }

  return response.json()
}

/**
 * Realiza una petición POST autenticada.
 *
 * @async
 * @param {string} url - URL completa del endpoint (ej: 'https://xyz.execute-api.../orders').
 * @param {Object} body - Cuerpo de la petición que será serializado a JSON.
 * @returns {Promise<any>} Datos parseados de la respuesta JSON.
 * @throws {Error} Si la respuesta del servidor no es 2xx.
 */
async function post(url, body) {
  const headers = await getAuthHeaders()

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Error en el servidor')
  }

  return response.json()
}

export { getAuthHeaders, get, post }
