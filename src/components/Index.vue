<template>
  <v-layout>
    <v-navigation-drawer
    clipped
    app
    temporary
    :value="drawer"
    hide-overlay
    stateless
    >
      <v-list>
        <v-list-tile>
          <v-list-tile-title>Inventory</v-list-tile-title>
          <v-list-tile-action>
            <v-btn icon @click="open">
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-title>Orders</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-for="(order, index) in orderList.splice().reverse()" :key="order.createdAt" @click="viewOrder(index)">
            <v-list-tile-action>
              <v-icon v-if="order.completed">check</v-icon>
              <v-icon v-else>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-if="order.new">{{order.name}}</v-list-tile-title>
            <v-list-tile-title v-else>Week of {{time(order.createdAt)}}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-title>Info</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>To be implemented</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-flex xs12 offset-xs3 v-if="drawer">
      <tabs :selection="list" :orders="orders" :assays="assays" :vendors="vendors" :search="search"/>
    </v-flex>
    <v-flex xs12 v-else>
      <tabs :selection="list" :orders="orders" :assays="assays" :vendors="vendors" :search="search"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import orderService from '@/services/OrderService.js'
import itemService from '@/services/ItemService.js'
import Tabs from './Tabs'
const moment = require('moment')

export default {
  data () {
    return {
      list: [],
      orderList: [],
      items: [],
      assays: [],
      vendors: [],
      orders: [],
      search: '',
      selection: ''
    }
  },

  components: {
    Tabs
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'drawer'
    ])
  },

  async mounted () {
    // call all index things here: item, vendor, assay, and pass them around
    // call all items here and sort them later
    this.assays = (await assayService.index(true)).data
    this.vendors = (await vendorService.index(true)).data
    this.orders = (await orderService.index()).data
    this.items = (await itemService.index(true)).data

    if (this.orders.length === 0) {
      this.orderList = [{name: 'Add New Order', new: true}]
    } else {
      this.orderList = this.orders
    }
  },

  methods: {
    time (order) {
      return moment(order).format('MMM-DD-YYYY')
    },

    open () {
      this.$store.dispatch('setTitle', 'All Items')
      this.$store.dispatch('setDrawer')
      this.list = this.items
      this.search = 'items'
    },

    viewOrder (index) {
      this.$store.dispatch('setDrawer')
      this.search = 'order'

      if (this.orders.length === 0) {
        this.$store.dispatch('setTitle', 'Create a New Order')
        this.list = []
      } else {
        this.$store.dispatch('setTitle', `Week of ${this.time(this.orders[index].createdAt)}`)
        this.list = this.orders[index]
      }
    }
  }
}
</script>

<style scoped>

</style>
