import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Obtiene la ruta del directorio raíz del proyecto.
const rootEnvDir = fileURLToPath(new URL('../', import.meta.url))

// Configuración de Vite para Vue y Tailwind CSS 4.
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno desde la raíz.
  const env = loadEnv(mode, rootEnvDir, '')

  return {
    envDir: rootEnvDir,

    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],

    // Configura el puerto del frontend desde el .env.
    server: {
      port: Number(env.FRONTEND_PORT),
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
