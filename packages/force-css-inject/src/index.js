import { relative, dirname, join, basename, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

const cssPathMap = new Map()
const cssAssetsMap = new Map()

export function forceCSSInject(baseUrl) {
  const currentFilePath = fileURLToPath(baseUrl)
  const currentDirPath = dirname(currentFilePath)
  return {
    name: 'force-css-inject',
    transform(code, id) {
      if (id.endsWith('&lang.css')) {
        const relativePath = relative(join(currentDirPath, 'src'), id)
        const [prefix] = relativePath.split('?')
        if (cssAssetsMap.has(prefix)) {
          console.warn(`Duplicate CSS file found: ${ prefix }`)
        }
        cssPathMap.set(prefix, basename(relativePath))
        const cssFineName = basename(relativePath)
        if (cssAssetsMap.has(cssFineName)) {
          console.warn(`Duplicate CSS file found: ${ cssFineName }`)
        }
        cssAssetsMap.set(cssFineName, parse(relativePath).dir)
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
}

export function assetFileNames(assetInfo) {
  const name = basename(assetInfo.name)
  if (cssAssetsMap.has(name)) {
    return `${ cssAssetsMap.get(name) }/[name].css`
  }
  return 'assets/[name]-[hash].css'
}