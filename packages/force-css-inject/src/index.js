import { relative, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const cssPathMap = new Map()

export function forceCSSInject(baseUrl) {
  const currentFilePath = fileURLToPath(baseUrl)
  const currentDirPath = dirname(currentFilePath)
  
  // 存储组件和样式的映射关系
  const componentStyles = new Map()
  
  return {
    name: 'force-css-inject',
    
    // 处理 Vue 组件
    transform(code, id) {
      if (id.endsWith('.vue') && id.includes('components/')) {
        // 提取组件路径信息
        const relativePath = relative(join(currentDirPath, 'src'), id)
        const componentPath = relativePath.split('components/')[1].split('/index.vue')[0]
        // 存储组件路径，用于后续处理
        componentStyles.set(id, {
          componentPath,
          componentOriginPath: relativePath.split('/index.vue')[0],
          hasStyle: false
        })
      }
      
      // 处理样式文件
      if (id.includes('type=style')) {
        // 找到对应的 Vue 组件
        for (const [vueId, info] of componentStyles.entries()) {
          if (id.includes(vueId)) {
            info.hasStyle = true
            info.styleId = id
            info.styleCssId = id.replace('scss', 'css')
            break
          }
        }
      }
      
      return null
    },
    
    // 处理最终的打包文件
    generateBundle(options, bundle) {
      // 收集所有 CSS 文件
      const cssFiles = new Map()
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css')) {
          cssFiles.set(fileName, chunk)
        }
      }
      
      // 处理每个组件的样式
      for (const [, info] of componentStyles.entries()) {
        if (info.hasStyle) {
          // 找到对应的 CSS 文件
          for (const [cssFileName, cssChunk] of cssFiles.entries()) {
            const cssFileRealName = cssFileName.startsWith('assets/')? cssFileName.split('assets/')[1] : cssFileName
            // 检查是否为该组件的样式
            if (info.styleCssId.replaceAll(/[=&?]/g, '_').includes(cssFileRealName) && cssChunk.source) {
              // 创建新的样式文件
              const newFileName = `${info.componentOriginPath}/style.css`
              
              // 添加到 bundle 中
              this.emitFile({
                type: 'asset',
                fileName: newFileName,
                source: cssChunk.source
              })
              

              // 可选：从原始 bundle 中删除该 CSS 文件
              // delete bundle[cssFileName]
              
              break
            }
          }
        }
      }
    }
  }
}

// 简化的 assetFileNames 函数，因为我们现在使用 emitFile 手动控制文件输出
export function assetFileNames() {
  // 默认将所有资源文件放在 assets 目录下
  return 'assets/[name][extname]'
}
