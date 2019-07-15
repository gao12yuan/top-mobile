import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Tabbar',
    component: () => import('@/views/tabbar'),
    children: [{
      path: '',
      name: 'home',
      component: () => import('@/views/home')
    }]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  }
  ]
})
