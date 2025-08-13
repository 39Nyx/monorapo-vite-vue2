// 导入主题样式
import '../theme-light.scss';
import '../theme-dark.scss';
import '../variables.scss';

/**
 * 主题管理器
 */
class ThemeManager {
  constructor() {
    this.defaultTheme = 'dark';
    this.currentTheme = localStorage.getItem('theme') || this.defaultTheme;
    this.init();
  }

  /**
   * 初始化主题
   */
  init() {
    // 应用保存的主题或默认主题
    this.applyTheme(this.currentTheme);
    
    // 监听系统主题变化
    this.setupSystemThemeListener();
  }

  /**
   * 应用主题
   * @param {string} theme - 主题名称 ('light' 或 'dark')
   */
  applyTheme(theme) {
    // 移除所有主题类
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    
    // 添加新主题类
    document.documentElement.classList.add(`theme-${theme}`);
    
    // 保存当前主题到本地存储
    localStorage.setItem('theme', theme);
    
    // 更新当前主题
    this.currentTheme = theme;
    
    // 触发主题变化事件
    this.dispatchThemeChangeEvent(theme);
  }

  /**
   * 切换主题
   * 如果当前是亮色主题，则切换到暗色主题，反之亦然
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    return newTheme;
  }

  /**
   * 获取当前主题
   * @returns {string} 当前主题名称
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 设置主题
   * @param {string} theme - 主题名称 ('light' 或 'dark')
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.error('主题必须是 "light" 或 "dark"');
      return;
    }
    
    this.applyTheme(theme);
  }

  /**
   * 监听系统主题变化
   */
  setupSystemThemeListener() {
    // 检查浏览器是否支持媒体查询
    if (window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // 根据系统主题设置初始主题（如果用户没有手动设置过）
      if (!localStorage.getItem('theme')) {
        const systemTheme = darkModeMediaQuery.matches ? 'dark' : 'light';
        this.applyTheme(systemTheme);
      }
      
      // 监听系统主题变化
      darkModeMediaQuery.addEventListener('change', (e) => {
        // 只有当用户没有手动设置过主题时，才跟随系统主题变化
        if (!localStorage.getItem('theme')) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(systemTheme);
        }
      });
    }
  }

  /**
   * 触发主题变化事件
   * @param {string} theme - 主题名称
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { theme }
    });
    document.dispatchEvent(event);
  }

  /**
   * 监听主题变化
   * @param {Function} callback - 回调函数，接收主题名称作为参数
   * @returns {Function} 移除监听器的函数
   */
  onThemeChange(callback) {
    const handler = (event) => {
      callback(event.detail.theme);
    };
    
    document.addEventListener('themechange', handler);
    
    // 返回一个函数，用于移除监听器
    return () => {
      document.removeEventListener('themechange', handler);
    };
  }
}

// 创建并导出主题管理器实例
const themeManager = new ThemeManager();

export default themeManager;

// 导出一些常用方法
export const toggleTheme = () => themeManager.toggleTheme();
export const setTheme = (theme) => themeManager.setTheme(theme);
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const onThemeChange = (callback) => themeManager.onThemeChange(callback);