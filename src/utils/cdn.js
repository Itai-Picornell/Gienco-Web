export const cdnUrl = (() => {
  // Obtenemos la URL desde el entorno (inyectada por el Pipeline)
  const url = import.meta.env.VITE_CDN_URL;

  // Si no hay URL, no devolvemos nada para evitar peticiones rotas
  if (!url || typeof url !== 'string') return '';

  try {
    // Validamos que sea una URL bien formada
    const validatedUrl = new URL(url);
    
    // Devolvemos la URL sin la barra final para consistencia en el proyecto
    return validatedUrl.origin;
  } catch (error) {
    // Si la variable de entorno es maliciosa o está mal formada,
    // el sistema la ignora por completo (Fail-safe)
    if (import.meta.env.DEV) {
      console.warn('Configuración de CDN inválida o ausente en .env');
    }
    return '';
  }
})();