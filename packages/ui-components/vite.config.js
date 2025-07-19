import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'
import { relative, dirname, join, basename, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

const cssPathMap = new Map()
const cssAssetsMap = new Map()

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = dirname(currentFilePath)

export default defineConfig({
  plugins: [
    vue2(),
    vue2Jsx(),
    {
      name: 'force-css-inject',
      transform(code, id) {
        if (id.endsWith('&lang.css')) {
          const relativePath = relative(join(currentDirPath, 'src'), id)
          const [prefix] = relativePath.split('?')
          cssPathMap.set(prefix, basename(relativePath))
          cssAssetsMap.set(basename(relativePath), parse(relativePath).dir)
        }
      },
      generateBundle(opts, bundle) {
        for (const [, chunk] of Object.entries(bundle)) {
          if (chunk.facadeModuleId && chunk.facadeModuleId.endsWith('.vue')) {
            const relativePath = relative(join(currentDirPath, 'src'), chunk.facadeModuleId)
            if (cssPathMap.has(relativePath)) {
              const cssFileName = cssPathMap.get(relativePath)
              const cssFilePath = cssFileName.replace(/[=&?]/g, '_')
              chunk.code = `import './${ cssFilePath }';\n${ chunk.code }`
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
          const name = basename(assetInfo.name)
          if (cssAssetsMap.has(name)) {
            return `${ cssAssetsMap.get(name) }/[name].css`
          }
          return 'assets/[name].css'
        }
      }
    }
  }
})
