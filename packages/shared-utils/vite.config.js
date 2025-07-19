import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'

export default defineConfig({
  plugins: [
    vue2(),
    vue2Jsx()
  ],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'SharedUtils',
      fileName: () => `index.es.js`,
      formats: ['es']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {},
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'lib/es',
        format: 'es',
        // 入口文件规则
        entryFileNames: '[name].js'
      }
    }
  }
})
