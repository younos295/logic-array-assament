import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_APP_BASE || '/',
    
    server: {
      port: 5173,
      host: true, 
      open: true, 
      strictPort: true, 
      cors: true,
      proxy: env.VITE_API_BASE_URL ? {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_TARGET || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL}`), '')
        }
      } : undefined
    },
    
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'vue': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            'vueuse': ['@vueuse/core']
          }
        }
      },
      chunkSizeWarningLimit: 1000 // in kB
    },
    
    css: {
      preprocessorOptions: {
        scss: {
        }
      }
    },
    
    plugins: [
      svgLoader(),
      vue({
        script: {
          defineModel: true,
          propsDestructure: true
        }
      }),
      vueJsx(),
    ],
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js'
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      'process.env': {}
    },
    
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ]
    }
  }
})
