import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Se utiliza la configuración del .env ubicado en la raíz del proyecto.
const rootEnvDir = fileURLToPath(new URL('../', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDir, '')

  return {
    envDir: rootEnvDir,

    plugins: [vue(), vueDevTools(), tailwindcss()],

    server: {
      port: Number(env.FRONTEND_PORT),
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // Configuración de pruebas unitarias.
    test: {
      environment: 'jsdom',
      include: ['test/**/*.spec.ts'],

      coverage: {
        provider: 'v8',
        include: [
          'src/components/**/*.vue',
          'src/composables/**/*.ts',
          'src/services/**/*.ts',
          'src/utils/**/*.ts',
          'src/views/**/*.vue',
          'src/App.vue',
        ],
        exclude: ['src/**/*.d.ts'],
        reporter: ['text', 'html'],

        // La cobertura mínima exigida es del 80 %.
        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  }
})
