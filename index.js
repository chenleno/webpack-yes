require('@babel/polyfill') // babel/polyfill 放在所有脚本之前

import 'assets/style.css'
import 'assets/style.less'

import Vue from 'vue'
import App from './App'

new Vue({
  render: h => h(App)
}).$mount('#app')
