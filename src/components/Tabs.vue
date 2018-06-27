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
      <inventory :items="items" :assays="assays" :vendors="vendors"/>
    </template>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import itemService from '@/services/ItemService.js'
import { mapState } from 'vuex'

export default {
  props: [
    'items',
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
      orderEntries: [],
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
        let entry = this.selection.entry || []
        entry.map(entry => {
          this.orderEntries.push(entry.item)
        })
        // combine current stock and comments from entry to existing data
        this.orderItems = (await itemService.show(this.orderEntries)).data
        this.orderItems.map(x => {
          for (let i = 0; i < entry.length; i++) {
            if (entry[i].item === x._id) {
              Object.assign(x, entry[i])
              break
            }
          }
        })
        // reset orders to prevent inflation
        this.orderEntries = []
      }
    }
  }
}
</script>

<style scoped>

</style>
