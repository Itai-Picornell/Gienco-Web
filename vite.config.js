import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Función de configuración de Rollup para dividir chunks manualmente.
         * Agrupa todas las dependencias de 'node_modules' en un chunk 'vendor' para mejorar caché.
         * 
         * @param {string} id - ID del módulo (ruta del archivo).
         * @returns {string|void} Nombre del chunk 'vendor' si coincide, o undefined.
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  }
})
