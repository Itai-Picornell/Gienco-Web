/**
 * Enterprise Security Utilities
 */

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeHTML = (str) => {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag])
  );
};

/**
 * Sanitizes image paths to prevent Directory Traversal attacks.
 * @param {string} rawPath - The raw path or filename.
 * @returns {string} - The sanitized filename.
 */
export const sanitizeImagePath = (rawPath) => {
  const path = String(rawPath || '').trim();
  if (!path) return 'placeholder.webp';
  // extracts filename and removes special characters except dots, dashes and underscores
  return path.split('/').pop().replace(/[^a-zA-Z0-9._-]/g, '').trim() || 'placeholder.webp';
};
