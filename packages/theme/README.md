# 主题切换系统

这是一个基于 SCSS 和 JavaScript 的主题切换系统，支持浅色和深色主题，并且可以根据系统主题自动切换。

## 安装

```bash
npm install @39nyx/theme
# 或
yarn add @39nyx/theme
# 或
pnpm add @39nyx/theme
```

## 使用方法

### 在 Vue 项目中使用

1. 在入口文件中导入主题样式和主题管理器：

```javascript
// main.js
import '@39nyx/theme/index.scss'; // 导入主题样式
import themeManager from '@39nyx/theme'; // 导入主题管理器
```

2. 在组件中使用主题变量：

```vue
<template>
  <div class="my-component">
    <button @click="toggleTheme">切换主题</button>
    <p>当前主题: {{ currentTheme }}</p>
  </div>
</template>

<script>
import { toggleTheme, getCurrentTheme, onThemeChange } from '@39nyx/theme';

export default {
  data() {
    return {
      currentTheme: getCurrentTheme()
    };
  },
  mounted() {
    // 监听主题变化
    this.removeListener = onThemeChange((theme) => {
      this.currentTheme = theme;
    });
  },
  beforeDestroy() {
    // 移除监听器
    if (this.removeListener) {
      this.removeListener();
    }
  },
  methods: {
    toggleTheme() {
      this.currentTheme = toggleTheme();
    }
  }
};
</script>

<style lang="scss">
@use '@39nyx/theme/index.scss' as theme;

.my-component {
  background-color: theme.$background-color;
  color: theme.$text-color;
  padding: 20px;
  border-radius: theme.$border-radius;
  transition: theme.$transition-duration;
  
  button {
    background-color: theme.$primary-color;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: theme.$border-radius;
    cursor: pointer;
    
    &:hover {
      background-color: theme.$secondary-color;
    }
  }
}
</style>
```

### 在 SCSS 中使用主题混合器

你可以使用 `@include themed()` 混合器来为不同主题应用不同的样式：

```scss
@use '@39nyx/theme/index.scss' as theme;

.my-element {
  // 共享样式
  padding: 20px;
  border-radius: theme.$border-radius;
  
  // 主题特定样式
  @include theme.themed() {
    background-color: theme.$background-color;
    color: theme.$text-color;
    box-shadow: theme.$box-shadow;
  }
}
```

### JavaScript API

主题管理器提供了以下 API：

- `toggleTheme()`: 切换主题（浅色/深色）
- `setTheme(theme)`: 设置特定主题 ('light' 或 'dark')
- `getCurrentTheme()`: 获取当前主题
- `onThemeChange(callback)`: 监听主题变化，返回一个用于移除监听器的函数

## 自定义主题

你可以通过修改 CSS 变量来自定义主题：

```css
:root.theme-light {
  --ui-primary-color: #your-custom-color;
  /* 其他变量 */
}

:root.theme-dark {
  --ui-primary-color: #your-custom-color;
  /* 其他变量 */
}
```

## 可用的 CSS 变量

### 颜色系统
- `--ui-primary-color`: 主要颜色
- `--ui-secondary-color`: 次要颜色
- `--ui-accent-color`: 强调颜色
- `--ui-text-color`: 文本颜色
- `--ui-background-color`: 背景颜色

### 尺寸系统
- `--ui-border-radius`: 边框圆角
- `--ui-button-min-width`: 按钮最小宽度
- `--ui-button-padding`: 按钮内边距
- `--ui-button-font-size`: 按钮字体大小

### 动画
- `--ui-transition-duration`: 过渡动画持续时间

### 阴影
- `--ui-box-shadow`: 盒子阴影