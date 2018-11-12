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
    <order v-else :orderId="orderId"/>
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
      orders: [],
      orderId: null
    }
  },

  async mounted () {
    this.orderId = null
    this.orders = (await orderService.index()).data

    // when no orders exist; initial db state
    if (this.orders.length === 0) {
      this.orders = [{name: 'No orders to list', new: true}]
    }
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle'
    ])
  },

  methods: {
    time (order) {
      return this.$moment(order).format('MMM-DD-YYYY')
    },

    viewOrder (index) {
      if (this.orders[0].new) {
        this.$store.dispatch('setTitle', 'No Orders')
      } else {
        this.$store.dispatch('setTitle', `Week of ${this.time(this.orders[index].createdAt)}`)
        this.orderId = this.orders[index].id
      }
    }
  }
}
</script>

<style scoped>

</style>
