export const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, (s) => map[s]);
};

/**
 * Sanitiza nombres de archivos de imagen.
 * Evita ataques de Directory Traversal (../) y caracteres de ejecución.
 */
export const sanitizeImagePath = (rawPath) => {
  if (!rawPath || typeof rawPath !== 'string') return 'placeholder.webp';

  // 1. Limpieza de espacios y normalización
  const cleanPath = rawPath.trim();

  // 2. Extraer solo el nombre del archivo (evita rutas relativas como ../../etc/passwd)
  const fileName = cleanPath.split(/[\\/]/).pop();

  // 3. Regex estricta: Solo permite letras, números, puntos, guiones y guiones bajos.
  // Cualquier otro carácter (espacios, %, $, scripts) es eliminado.
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');

  return safeName || 'placeholder.webp';
};