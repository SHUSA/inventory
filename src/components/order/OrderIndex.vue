<template>
  <!-- list all orders and choose one to display -->
  <v-card>
    <template v-if="pageTitle === 'orders'">
      <v-list>
        <v-list-tile v-for="(order, index) in orders" :key="order.createdAt" @click="viewOrder(index)">
          <v-list-tile-action>
            <v-icon v-if="order.completed">fa-check</v-icon>
            <v-icon v-else>fa-angle-right </v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-if="order.new">{{order.name}}</v-list-tile-title>
          <v-list-tile-title v-else>Week of {{time(order.createdAt)}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </template>
    <order v-else-if="mode === 'orders' && pageTitle !== 'orders'" :order="order"/>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import orderService from '@/services/OrderService.js'
import Order from './Order'

export default {
  components: {
    Order
  },

  data () {
    return {
      order: {},
      orders: [],
      orderId: null
    }
  },

  watch: {
    pageTitle (val) {
      if (val === 'orders') {
        this.initialize()
      }
    }
  },

  mounted () {
    console.log('order mount')
    this.initialize()
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'mode'
    ])
  },

  methods: {
    async initialize () {
      this.order = {}
      this.orders = (await orderService.index()).data

      // when no orders exist; initial db state
      if (this.orders.length === 0) {
        this.orders = [{name: 'No orders to list', new: true}]
      }
    },

    time (order) {
      return this.$moment(order).format('MMM-DD-YYYY')
    },

    viewOrder (index) {
      if (this.orders[0].new) {
        this.$store.dispatch('setTitle', 'No Orders')
      } else {
        this.$store.dispatch('setTitle', `Week of ${this.time(this.orders[index].createdAt)}`)
        this.order = this.orders[index]
      }
    }
  }
}
</script>

<style scoped>

</style>
