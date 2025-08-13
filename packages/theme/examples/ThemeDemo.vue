<template>
  <div class="theme-demo">
    <div class="theme-card">
      <h2>主题切换演示</h2>
      <div class="theme-info">
        <p>当前主题: <strong>{{ currentTheme === 'light' ? '浅色' : '深色' }}</strong></p>
      </div>
      <div class="theme-controls">
        <button class="theme-button" @click="toggleTheme">
          切换主题
        </button>
        <div class="theme-selector">
          <button 
            class="theme-option light" 
            :class="{ active: currentTheme === 'light' }"
            @click="setTheme('light')">
            浅色
          </button>
          <button 
            class="theme-option dark" 
            :class="{ active: currentTheme === 'dark' }"
            @click="setTheme('dark')">
            深色
          </button>
        </div>
      </div>
      <div class="color-palette">
        <div class="color-item primary">
          <div class="color-preview"></div>
          <div class="color-info">
            <span class="color-name">主色调</span>
            <span class="color-value">Primary</span>
          </div>
        </div>
        <div class="color-item secondary">
          <div class="color-preview"></div>
          <div class="color-info">
            <span class="color-name">次要色</span>
            <span class="color-value">Secondary</span>
          </div>
        </div>
        <div class="color-item accent">
          <div class="color-preview"></div>
          <div class="color-info">
            <span class="color-name">强调色</span>
            <span class="color-value">Accent</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toggleTheme, setTheme, getCurrentTheme, onThemeChange } from '../src/index.js';

export default {
  name: 'ThemeDemo',
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
    },
    setTheme(theme) {
      setTheme(theme);
      this.currentTheme = theme;
    }
  }
};
</script>

<style lang="scss">
@use '../index.scss' as theme;

.theme-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: theme.$background-color;
  transition: theme.$transition-duration;
}

.theme-card {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: theme.$border-radius;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: theme.$box-shadow;
  
  h2 {
    color: theme.$primary-color;
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .theme-info {
    margin-bottom: 20px;
    text-align: center;
    
    p {
      color: theme.$text-color;
      font-size: 18px;
      
      strong {
        color: theme.$accent-color;
      }
    }
  }
  
  .theme-controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
    
    .theme-button {
      background-color: theme.$primary-color;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: theme.$border-radius;
      font-size: theme.$button-font-size;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: theme.$secondary-color;
      }
    }
    
    .theme-selector {
      display: flex;
      gap: 10px;
      
      .theme-option {
        flex: 1;
        padding: 10px;
        border: 2px solid transparent;
        border-radius: theme.$border-radius;
        cursor: pointer;
        transition: all 0.2s;
        
        &.light {
          background-color: #f8f9fa;
          color: #333;
        }
        
        &.dark {
          background-color: #212529;
          color: #fff;
        }
        
        &.active {
          border-color: theme.$accent-color;
          box-shadow: 0 0 0 2px rgba(0, 221, 235, 0.3);
        }
      }
    }
  }
  
  .color-palette {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    
    .color-item {
      display: flex;
      flex-direction: column;
      
      .color-preview {
        height: 60px;
        border-radius: theme.$border-radius;
        margin-bottom: 8px;
      }
      
      .color-info {
        display: flex;
        flex-direction: column;
        
        .color-name {
          font-size: 14px;
          color: theme.$text-color;
        }
        
        .color-value {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
      
      &.primary .color-preview {
        background-color: theme.$primary-color;
      }
      
      &.secondary .color-preview {
        background-color: theme.$secondary-color;
      }
      
      &.accent .color-preview {
        background-color: theme.$accent-color;
      }
    }
  }
}
</style>