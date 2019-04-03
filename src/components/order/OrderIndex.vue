<template>
  <!-- list all orders and choose one to display -->
  <v-card v-if="loadComponent" flat>
    <error :response="response"/>
    <v-expansion-panel v-if="pageTitle === 'orders'" v-model="panels" expand>
      <!-- incomplete -->
      <v-expansion-panel-content :class="panelClass(0)">
        <div slot="header">
          <v-icon>fa-clipboard-list</v-icon>
          Incomplete Orders
        </div>
        <v-divider/>
        <v-list v-if="incompleteOrders.length > 0">
          <v-list-tile v-for="order in incompleteOrders" :key="order.createdAt" @click="viewOrder(order)">
            <v-list-tile-action>
              <v-icon>fa-angle-right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Week of {{time(order.createdAt)}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-alert :value="incompleteOrders.length === 0" color="success" icon="fa-check">All caught up!</v-alert>
      </v-expansion-panel-content>
      <!-- completed -->
      <v-expansion-panel-content :class="panelClass(1)">
        <div slot="header">
          <v-icon>fa-check-double</v-icon>
          Completed Orders
        </div>
        <v-divider/>
        <v-list  v-if="completedOrders.length > 0">
          <v-list-group
            v-for="group in completedOrders"
            v-model="group.active"
            :key="group.title"
            prepend-icon="fa-calendar-alt"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{group.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="order in group.orders"
              :key="order.createdAt"
              @click="viewOrder(order)"
            >
              <v-list-tile-action>
                <v-icon>fa-check</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Week of {{time(order.createdAt)}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
        <v-alert :value="completedOrders.length === 0" color="error" icon="fa-exclamation-triangle">No orders to display!</v-alert>
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
        let i = 0
        this.orders = [...this.response.data]

        this.orders.forEach((order, index) => {
          if (!order.completed) {
            this.incompleteOrders.push(order)
          } else {
            if (this.completedOrders.length > 0) {
              // compare previous create date with new create date
              let orderGroup = this.completedOrders[i]
              if (this.$moment(order.createdAt).isSame(this.$moment(orderGroup.orders[0].createdAt).startOf('week'), 'month')) {
                // if same month, push to current index
                orderGroup.orders.push(order)
              } else {
                // else push to next index
                this.completedOrders.push({
                  title: this.$moment(order.createdAt).startOf('week').format('MMMM YYYY'),
                  orders: []
                })
                i += 1
                this.completedOrders[i].orders.push(order)
              }
            } else {
              // create 'month - year' label for group title
              this.completedOrders.push({
                title: this.$moment(order.createdAt).startOf('week').format('MMMM YYYY'),
                orders: []
              })
              this.completedOrders[i].orders.push(order)
            }
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
