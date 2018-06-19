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
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-title>{{drawerTitle}} Inventory</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-for="(item, index) in list" :key="item.name" @click="set(index)">
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <template v-if="admin">
          <v-list-group>
          <v-list-tile v-if="admin" slot="activator">
            <v-list-tile-title>Orders</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-for="(order, index) in orders" :key="order.createdAt" @click="viewOrder(index)">
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Week of {{time(order.createdAt)}}</v-list-tile-title>
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
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-flex xs12 offset-xs3 v-if="drawer">
      <tabs :selection="items[index]" :assays="assays" :vendors="vendors" :search="search"/>
    </v-flex>
    <v-flex xs12 v-else>
      <tabs :selection="items[index]" :assays="assays" :vendors="vendors" :search="search"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import orderService from '../services/OrderService.js'
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
      drawerTitle: '',
      search: '',
      index: 0
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
    this.assays = (await assayService.index(true)).data
    this.vendors = (await vendorService.index(true)).data
    this.orders = (await orderService.index()).data
    if (this.user) {
      this.list = this.assays
      this.drawerTitle = 'Assay'
    } else if (this.admin) {
      this.list = this.vendors
      this.drawerTitle = 'Vendor'
    } else {
      this.list = [{name: 1}, {name: 2}, {name: 3}]
      this.drawerTitle = 'Demo'
    }
  },
  methods: {
    time (order) {
      return moment(order).format('MMM-DD-YYYY')
    },

    set (index) {
      this.$store.dispatch('setTitle', this.list[index].name)
      this.$store.dispatch('setDrawer')
      this.index = index
      this.search = this.drawerTitle.toLowerCase()
      if (this.search === 'vendor') {
        this.list = this.vendors
      } else if (this.search === 'assay') {
        this.list = this.assays
      }
      this.items = this.list
    },

    viewOrder (index) {
      console.log('vieworder')
      this.$store.dispatch('setTitle', `Week of ${this.time(this.orders[index].createdAt)}`)
      this.$store.dispatch('setDrawer')
      this.index = index
      this.search = 'order'
      this.items = this.orders
    }
  }
}
</script>

<style scoped>

</style>
