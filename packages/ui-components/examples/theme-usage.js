import { MyButton, setTheme, themes } from '@39nyx/ui-components'

// 使用预定义主题
setTheme(themes.dark)

// 或者自定义主题
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