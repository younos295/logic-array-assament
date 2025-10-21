import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Base public path when served in development or production
    base: env.VITE_APP_BASE || '/',
    
    // Development server options
    server: {
      port: 5173,
      host: true, // Listen on all network interfaces
      open: true, // Open browser on server start
      strictPort: true, // Exit if port is already in use
      cors: true, // Enable CORS
      // Proxy API requests in development
      proxy: env.VITE_API_BASE_URL ? {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_TARGET || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL}`), '')
        }
      } : undefined
    },
    
    // Build configuration
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
    
    // Global CSS
    css: {
      preprocessorOptions: {
        scss: {
          // Custom SCSS variables and mixins can be added here
        }
      }
    },
    
    // Plugins
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
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js'
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      'process.env': {}
    },
    
    // Optimize dependencies
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
