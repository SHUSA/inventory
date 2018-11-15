import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import OrderIndex from '@/components/order/OrderIndex.vue'
import InventoryIndex from '@/components/inventory/InventoryIndex.vue'
// import Order from '@/components/order/Order.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderIndex
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryIndex
    },
    // {
    //   path: '/orders/:orderId',
    //   name: 'order',
    //   props: true,
    //   component: Order
    // },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
