import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    server: {
      host: 'localhost',
      port: parseInt(env.VITE_DEV_PORT) || 5173,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:9091',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}