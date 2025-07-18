import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'

export default defineConfig({
  plugins: [
    vue2(),
    vue2Jsx(),
    {
      name: 'force-css-inject',
      generateBundle(opts, bundle) {
        for (const [, chunk] of Object.entries(bundle)) {
          if (chunk.facadeModuleId && chunk.facadeModuleId.endsWith('.vue')) {
            const regexp = /scoped_[a-z0-9]+_lang\.js$/
            const findResult = (chunk.imports || []).find(item => {
              return regexp.test(item)
            })
            if (findResult) {
              const start = findResult.lastIndexOf('/')
              const url = findResult.slice(start, findResult.length - 3)
              chunk.code = `import '.${ url }.css';\n${ chunk.code }`
            }
          }
        }
      }
    }
  ],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'UiComponents',
      fileName: () => `index.es.js`,
      formats: ['es']
    },
    cssTarget: ['chrome112'],
    // 启用CSS代码切割，实现按需引入
    cssCodeSplit: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue'
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'lib/es',
        format: 'es',
        // 入口文件规则
        entryFileNames: '[name].js',
        // 静态资源规则
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('&lang.css') && assetInfo.name.startsWith('src/')) {
            const lastIndex = assetInfo.name.lastIndexOf('/')
            if (lastIndex !== -1) {
              const prefix = assetInfo.name.slice(4, lastIndex)
              return `${ prefix }/[name].css`
            }
          }
          return 'chunks/[name]-[hash].css'
        }
      }
    }
  }
})
