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
        <v-alert :value="!orders" color="error" icon="fa-exclamation-triangle">No orders to display!</v-alert>
      </v-list>
    </template>
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
    this.initialize()
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'mode',
      'route'
    ])
  },

  methods: {
    async initialize () {
      this.$store.dispatch('setTitle', this.route.name)
      this.$store.dispatch('setMode', this.route.name)

      this.order = {}
      this.orders = (await orderService.index()).data
    },

    time (order) {
      return this.$moment(order).startOf('week').format('MMM-DD-YYYY')
    },

    viewOrder (index) {
      this.$store.dispatch('setTitle', `Week of ${this.time(this.orders[index].createdAt)}`)
      this.order = this.orders[index]
      // store selected order and push Order component
      this.$store.dispatch('setOrder', this.order)
      this.$router.push({
        name: 'order'
      })
    }
  }
}
</script>

<style scoped>

</style>
