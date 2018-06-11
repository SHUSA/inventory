import Vue from 'vue'
import Router from 'vue-router'
// temp route
import Index from '@/components/Dev/Index'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
