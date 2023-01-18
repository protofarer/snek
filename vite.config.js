import { 
  defineConfig, 
  loadEnv,
} from 'vite'

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<script src="index(.*?)\.js">.*/,
        `<script src="index-v${env.VITE_APP_VERSION}.js type="module"></script>`
      )
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      htmlPlugin()
    ],
    server: {
      open: true,
      host: '0.0.0.0',
      port: 3001,
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
    },
    main: new URL('./lab/lab.html', import.meta.url),
  }
})