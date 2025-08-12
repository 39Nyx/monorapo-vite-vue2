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
        console.log('relativePath: ', relativePath)
        const componentPath = relativePath.split('components/')[1].split('/index.vue')[0]
        
        // 存储组件路径，用于后续处理
        componentStyles.set(id, {
          componentPath,
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
            break
          }
        }
      }
      
      return null
    },
    
    // 在构建完成后处理 CSS 文件
    renderChunk(code, chunk) {
      // 如果是 Vue 组件
      if (chunk.facadeModuleId && chunk.facadeModuleId.endsWith('.vue')) {
        const info = componentStyles.get(chunk.facadeModuleId)
        if (info && info.hasStyle) {
          // 在组件代码前添加样式导入
          return `import './style.css';\n${code}`
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
            // 检查是否为该组件的样式
            if (cssFileName.includes('scoped') && cssChunk.source) {
              // 创建新的样式文件
              const newFileName = `components/${info.componentPath}/style.css`
              
              // 添加到 bundle 中
              this.emitFile({
                type: 'asset',
                fileName: newFileName,
                source: cssChunk.source
              })
              
              console.log(`Created component style: ${newFileName}`)
              
              // 可选：从原始 bundle 中删除该 CSS 文件
              // delete bundle[cssFileName]
              
              break
            }
          }
        }
      }
      
      // 处理 Vue 组件的样式引用
      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.facadeModuleId && chunk.facadeModuleId.endsWith('.vue')) {
          const relativePath = relative(join(currentDirPath, 'src'), chunk.facadeModuleId)
          
          // 提取组件路径信息
          let componentPath = '';
          if (relativePath.includes('components/')) {
            componentPath = relativePath.split('components/')[1].split('/index.vue')[0];
          }
          
          if (cssPathMap.has(relativePath)) {
            const cssFileName = cssPathMap.get(relativePath)
            const cssFilePath = cssFileName.replace(/[=&?]/g, '_')
            
            // 如果是组件，使用相对路径引入样式
            if (componentPath) {
              chunk.code = `import './style.css';\n${ chunk.code }`
            } else {
              chunk.code = `import './${ cssFilePath }';\n${ chunk.code }`
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
