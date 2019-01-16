<template>
  <!-- list all orders and choose one to display -->
  <v-card v-if="loadComponent" flat>
    <error :response="response"/>
    <v-expansion-panel v-if="pageTitle === 'orders'" v-model="panels" expand>
      <!-- incomplete -->
      <v-expansion-panel-content :class="panelClass(0)">
        <div slot="header">
          <v-icon small>fa-list-ul</v-icon>
          Incomplete Orders
        </div>
        <v-divider/>
        <v-list>
          <v-list-tile v-for="order in incompleteOrders" :key="order.createdAt" @click="viewOrder(order)">
            <v-list-tile-action>
              <v-icon>fa-angle-right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-if="order.new">{{order.name}}</v-list-tile-title>
            <v-list-tile-title v-else>Week of {{time(order.createdAt)}}</v-list-tile-title>
          </v-list-tile>
          <v-alert :value="incompleteOrders.length === 0" color="success" icon="fa-check">All caught up!</v-alert>
        </v-list>
      </v-expansion-panel-content>
      <!-- completed -->
      <v-expansion-panel-content :class="panelClass(1)">
        <div slot="header">
          <v-icon small>fa-check</v-icon>
          Completed Orders
        </div>
        <v-divider/>
        <v-list>
          <v-list-tile v-for="order in completedOrders" :key="order.createdAt" @click="viewOrder(order)">
            <v-list-tile-action>
              <v-icon>fa-check</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-if="order.new">{{order.name}}</v-list-tile-title>
            <v-list-tile-title v-else>Week of {{time(order.createdAt)}}</v-list-tile-title>
          </v-list-tile>
          <v-alert :value="completedOrders.length === 0" color="error" icon="fa-exclamation-triangle">No orders to display!</v-alert>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import orderService from '@/services/OrderService.js'

export default {
  data () {
    return {
      orders: [],
      completedOrders: [],
      incompleteOrders: [],
      panels: [true, false],
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
      this.response = (await orderService.index())
      this.orders = []
      this.completedOrders = []
      this.incompleteOrders = []

      if (this.response.status === 200) {
        this.orders = [...this.response.data]
        this.orders.forEach(order => {
          if (order.completed) {
            this.completedOrders.push(order)
          } else {
            this.incompleteOrders.push(order)
          }
        })
      }
      this.loadComponent = true
    },

    time (order) {
      return this.$moment(order).startOf('week').format('MMM-DD-YYYY')
    },

    panelClass (index) {
      return this.panels[index] ? 'info' : 'gray lighten-2'
    },

    viewOrder (order) {
      this.$store.dispatch('setTitle', `Week of ${this.time(order.createdAt)}`)
      // store selected order and push Order component
      this.$store.dispatch('setOrder', order.id)
      this.$router.push({
        name: 'order'
      })
    }
  }
}
</script>

<style scoped>

</style>
