# UI Components

一个基于 Vue 2 的组件库，支持自定义主题。

## 安装

```bash
npm install @39nyx/ui-components
```

## 使用组件

```javascript
import { MyButton } from '@39nyx/ui-components'

export default {
  components: {
    MyButton
  }
}
```

```html
<template>
  <div>
    <my-button text="点击我"></my-button>
  </div>
</template>
```

## 自定义主题

### 使用预定义主题

组件库提供了几个预定义的主题：

```javascript
import { setTheme, themes } from '@39nyx/ui-components'

// 使用暗色主题
setTheme(themes.dark)

// 使用亮色主题
setTheme(themes.light)

// 恢复默认主题
setTheme(themes.default)
```

### 自定义主题

你可以创建自己的主题：

```javascript
import { setTheme } from '@39nyx/ui-components'

// 自定义主题
setTheme({
  'primary-color': '#ff0000',  // 红色主题
  'secondary-color': '#ff6b6b',
  'accent-color': '#ffb347',
  'background-color': '#1a1a1a'
})

// 也可以只覆盖部分变量
setTheme({
  'primary-color': '#4caf50',  // 只修改主色调为绿色
  'button-font-size': '16px'   // 修改按钮字体大小
})
```

### 创建自定义主题

你可以创建并保存自己的主题：

```javascript
import { createTheme, setTheme } from '@39nyx/ui-components'

// 创建自定义主题
const myTheme = createTheme('my-theme', {
  'primary-color': '#673ab7',
  'secondary-color': '#9c27b0',
  'accent-color': '#e91e63',
  'text-color': '#f5f5f5',
  'background-color': '#212121'
})

// 使用自定义主题
setTheme(myTheme)
```

## 可自定义的主题变量

以下是所有可以自定义的主题变量：

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| primary-color | #5b42f3 | 主色调 |
| secondary-color | #af40ff | 次要色调 |
| accent-color | #00ddeb | 强调色 |
| text-color | #ffffff | 文本颜色 |
| background-color | rgb(5, 6, 45) | 背景色 |
| border-radius | 8px | 边框圆角 |
| button-min-width | 140px | 按钮最小宽度 |
| button-padding | 3px | 按钮内边距 |
| button-font-size | 18px | 按钮字体大小 |
| transition-duration | 0.3s | 过渡动画持续时间 |
| box-shadow | rgba(151, 65, 252, 0.2) 0 15px 30px -5px | 阴影效果 |

## 在项目入口处初始化主题

建议在项目的入口文件（如 `main.js`）中设置主题：

```javascript
import Vue from 'vue'
import App from './App.vue'
import { setTheme, themes } from '@39nyx/ui-components'

// 设置主题
setTheme(themes.light)

new Vue({
  render: h => h(App)
}).$mount('#app')