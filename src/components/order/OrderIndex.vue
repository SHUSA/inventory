<template>
  <!-- list all orders and choose one to display -->
  <v-card v-if="loadComponent">
    <error :response="response"/>
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
        <v-alert :value="orders.length === 0" color="error" icon="fa-exclamation-triangle">No orders to display!</v-alert>
      </v-list>
    </template>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import orderService from '@/services/OrderService.js'

export default {
  data () {
    return {
      order: {},
      orders: [],
      response: '',
      loadComponent: false
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
    this.loadComponent = false
    this.initialize()
    // go to top
    window.scroll({
      top: 0,
      left: 0
    })
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'route'
    ])
  },

  methods: {
    async initialize () {
      this.$store.dispatch('setTitle', this.route.name)

      this.order = {}
      this.response = (await orderService.index())

      if (this.response.status === 200) {
        this.orders = this.response.data
      }
      this.loadComponent = true
    },

    time (order) {
      return this.$moment(order).startOf('week').format('MMM-DD-YYYY')
    },

    viewOrder (index) {
      this.$store.dispatch('setTitle', `Week of ${this.time(this.orders[index].createdAt)}`)
      this.order = this.orders[index]
      // store selected order and push Order component
      this.$store.dispatch('setOrder', this.order.id)
      this.$router.push({
        name: 'order'
      })
    }
  }
}
</script>

<style scoped>

</style>
