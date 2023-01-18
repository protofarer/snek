import { 
  defineConfig, 
  loadEnv 
} from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(`app vers`, env.VITE_APP_VERSION)
  
  return {
    // root: 'src',
    // envDir: '../',
    // publicDir: '../public',
    server: {
      open: true,
      host: '0.0.0.0',
      port: 3001,
      // usePolling: true,
    },
    build: {
      rollupOptions: {
        input: {
          index: 'index.js',
        },
        output: {
          dir: 'dist',
          entryFileNames: `index-v${env.VITE_APP_VERSION}.js`
        },
      },
      // emptyOutDir: true,
      // sourcemap: true,
    },
    main: new URL('./lab/lab.html', import.meta.url),
  }
})