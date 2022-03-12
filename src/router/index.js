import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { islogin } from '@/utils/firebase'

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'OrderHistory'
    },
    path: '/orderHistory',
    name: 'OrderHistory',
    component: () => import(/* webpackChunkName: "tables" */ '@/views/OrderHistory.vue')
  },
  {
    meta: {
      title: 'NewOrder'
    },
    path: '/newOrder',
    name: 'NewOrder',
    component: () => import(/* webpackChunkName: "newOrder" */ '@/views/NewOrder.vue')
  },
  {
    meta: {
      title: 'products'
    },
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "products" */ '@/views/Products.vue')
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    meta: {
      title: 'Error',
      fullScreen: true
    },
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to, from) => {
  const isAuth = await islogin()
  if (!isAuth && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router
