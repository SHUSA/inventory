import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import OrderIndex from '@/components/order/OrderIndex.vue'
import InventoryIndex from '@/components/inventory/InventoryIndex.vue'
import Order from '@/components/order/Order.vue'
import Inventory from '@/components/inventory/Inventory.vue'
import UserInventory from '@/components/inventory/UserInventory.vue'
import NotFound from '@/components/NotFound.vue'

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
    {
      path: '/orders/table',
      name: 'order',
      component: Order
    },
    {
      path: '/inventory/table',
      name: 'inventory-table',
      component: Inventory
    },
    {
      path: '/inventory/user',
      name: 'inventory-user',
      component: UserInventory
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})
