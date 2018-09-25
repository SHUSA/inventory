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
          <v-list-tile v-for="(order, index) in orders" :key="order.createdAt" @click="viewOrder(index)">
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
          <v-list-tile @click="info('items')">
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Items</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="info('assays')">
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Assays</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="info('vendors')">
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Vendors</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-flex xs12 offset-xs3 v-if="drawer">
      <tabs :list="list" :selection="selection" :orders="orders" :assays="assays" :vendors="vendors" :search="search"/>
    </v-flex>
    <v-flex xs12 v-else>
      <tabs :list="list" :selection="selection" :orders="orders" :assays="assays" :vendors="vendors" :search="search"/>
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
      items: [],
      assays: [],
      vendors: [],
      orders: [],
      inactiveItems: [],
      inactiveAssays: [],
      inactiveVendors: [],
      allItems: [],
      allAssays: [],
      allVendors: [],
      search: '',
      selection: 'item'
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

    this.inactiveAssays = (await assayService.index(false)).data
    this.inactiveVendors = (await vendorService.index(false)).data
    this.inactiveItems = (await itemService.index(false)).data

    this.allAssays = [...this.assays, ...this.inactiveAssays]
    this.allVendors = [...this.vendors, ...this.inactiveVendors]
    this.allItems = [...this.items, ...this.inactiveItems]

    console.log(this.orders)

    if (this.orders.length === 0) {
      console.log('no orders')
      this.orders = [{name: 'No orders to list', new: true}]
      console.log(this.orders)
    }
  },

  methods: {
    time (order) {
      return moment(order).format('MMM-DD-YYYY')
    },

    open () {
      this.$store.dispatch('setTitle', 'Inventory')
      this.$store.dispatch('setDrawer')
      this.list = this.items
      this.search = 'items'
      this.selection = 'item'
    },

    info (list) {
      this.$store.dispatch('setTitle', 'Info List')
      this.$store.dispatch('setDrawer')

      switch (list) {
        case 'assays':
          this.list = this.allAssays
          this.selection = 'assay'
          break
        case 'vendors':
          this.list = this.allVendors
          this.selection = 'vendor'
          break
        default:
          this.list = this.allItems
          this.selection = 'item'
          break
      }
      this.search = 'info'
    },

    viewOrder (index) {
      this.$store.dispatch('setDrawer')
      this.search = 'order'

      if (this.orders[0].new) {
        this.$store.dispatch('setTitle', 'No Orders')
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
