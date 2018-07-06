<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Coming Soon&#8482;</v-tab>
    </v-tabs>
    <order v-if="search === 'order'" :order="selection" :orders="orders" :items="orderItems"/>
    <template v-else>
      <inventory :items="selection" :assays="assays" :vendors="vendors"/>
    </template>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import itemService from '@/services/ItemService.js'
import orderService from '@/services/OrderService.js'
import { mapState } from 'vuex'

export default {
  props: [
    'search',
    'assays',
    'vendors',
    'orders',
    'selection'
  ],
  components: {
    Inventory,
    Order
  },
  data () {
    return {
      orderItems: []
    }
  },
  computed: {
    ...mapState([
      'user',
      'admin',
      'drawer'
    ])
  },
  watch: {
    async selection () {
      if (this.search === 'order') {
        this.orderItems = [(await orderService.show(this.selection.id)).data]
        // get array of order entries and pass it to order component
      }
    }
  }
}
</script>

<style scoped>

</style>
