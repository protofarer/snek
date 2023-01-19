import { 
  defineConfig, 
} from 'vite'

export default defineConfig({
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3001,
  },
  VITE_APP_VER: JSON.stringify(process.env.npm_package_version),
})