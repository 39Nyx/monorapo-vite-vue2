import Vue from 'vue'

import App from './App.vue'
import router from './router'

import { setTheme, themes } from '@39nyx/ui-components'

setTheme(themes.default)

import './assets/main.css'

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
