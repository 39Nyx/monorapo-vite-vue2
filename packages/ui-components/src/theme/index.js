// 主题管理模块

/**
 * 设置组件库主题
 * @param {Object} theme - 主题配置对象
 */
export function setTheme(theme = {}) {
  const root = document.documentElement;
  
  // 遍历主题对象，设置 CSS 变量
  Object.entries(theme).forEach(([key, value]) => {
    // 确保变量名称格式正确
    const cssVarName = key.startsWith('--ui-') ? key : `--ui-${key}`;
    root.style.setProperty(cssVarName, value);
  });
}

/**
 * 创建预设主题
 * @param {String} name - 主题名称
 * @param {Object} theme - 主题配置对象
 * @returns {Object} - 带有名称的主题对象
 */
export function createTheme(name, theme = {}) {
  return {
    name,
    ...theme
  };
}

// 预定义主题
export const themes = {
  // 默认主题（与 CSS 变量默认值相同）
  default: createTheme('default', {
    'primary-color': '#5b42f3',
    'secondary-color': '#af40ff',
    'accent-color': '#00ddeb',
    'text-color': '#ffffff',
    'background-color': 'rgb(5, 6, 45)',
    'border-radius': '8px',
    'button-min-width': '140px',
    'button-padding': '3px',
    'button-font-size': '18px',
    'transition-duration': '0.3s',
    'box-shadow': 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px'
  }),
  
  // 暗色主题
  dark: createTheme('dark', {
    'primary-color': '#2a2a72',
    'secondary-color': '#5a4fcf',
    'accent-color': '#00b4d8',
    'text-color': '#e0e0e0',
    'background-color': '#121212',
    'box-shadow': 'rgba(0, 0, 0, 0.3) 0 10px 20px -5px'
  }),
  
  // 亮色主题
  light: createTheme('light', {
    'primary-color': '#4361ee',
    'secondary-color': '#7209b7',
    'accent-color': '#4cc9f0',
    'text-color': '#333333',
    'background-color': '#f8f9fa',
    'box-shadow': 'rgba(149, 157, 165, 0.2) 0 8px 24px'
  })
};

// 导出默认主题设置函数
export function initDefaultTheme() {
  setTheme(themes.default);
}