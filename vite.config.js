import { 
  defineConfig, 
  // loadEnv 
} from 'vite'

export default defineConfig({
  // root: 'src',
  // envDir: '../',
  // publicDir: '../public',
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        a: 'index.js',
      },
      output: {
        dir: 'dist'
      },
    },
    // emptyOutDir: true,
    // sourcemap: true,
  },
  main: new URL('./lab/lab.html', import.meta.url)
})