import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { darkModeKey, styleKey } from '@/config.js'
import VueNumberInput from '@chenfengyuan/vue-number-input'

import './css/main.css'

console.log('Enviroment', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
  store.dispatch('getAllProducts', 'products')
  store.dispatch('getAllOrders', 'orders')
} else {
  store.dispatch('getAllOrdersDevelop', 'orders')
  store.dispatch('getAllProductsDevelop', 'products')
}
/* App style */
store.dispatch('setStyle', localStorage[styleKey] = 'basic')

/* Dark mode */
if ((!localStorage[darkModeKey] && window.matchMedia('(prefers-color-scheme: dark)').matches) || localStorage[darkModeKey] === '1') {
  store.dispatch('darkMode', true)
}

/* Default title tag */
const defaultDocumentTitle = 'Churrys Waffles App'

/* Collapse mobile aside menu on route change */
router.beforeEach(to => {
  store.dispatch('asideMobileToggle', false)
  store.dispatch('asideLgToggle', false)
})

router.afterEach(to => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})
createApp(App).use(store).use(router).component(VueNumberInput.name, VueNumberInput).mount('#app')
