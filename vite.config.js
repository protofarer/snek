import { 
  defineConfig, 
} from 'vite'

export default defineConfig({
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3001,
  }
})