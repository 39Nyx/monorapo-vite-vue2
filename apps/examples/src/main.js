import Vue from 'vue'

import App from './App.vue'
import router from './router'

import '@39nyx/theme/index.scss'; // 导入主题样式

import './assets/main.css'

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
