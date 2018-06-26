<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Coming Soon&#8482;</v-tab>
    </v-tabs>
    <order :order="selection" :orders="orders" :items="items" v-if="search === 'order'"/>
    <template v-else>
      <admin-inventory :items="items" :assays="assays" :vendors="vendors" v-if="admin"/>
      <user-inventory :items="items" :assays="assays" v-if="user"/>
    </template>
  </div>
</template>

<script>
import AdminInventory from './AdminInventory'
import UserInventory from './UserInventory'
import Order from './Order'
import itemService from '@/services/ItemService.js'
import { mapState } from 'vuex'

export default {
  props: [
    'selection',
    'search',
    'assays',
    'vendors',
    'orders'
  ],
  components: {
    AdminInventory,
    UserInventory,
    Order
  },
  data () {
    return {
      items: [],
      orderEntries: []
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
        this.items = (await itemService.show(this.orderEntries)).data
        this.items.map(x => {
          for (let i = 0; i < entry.length; i++) {
            if (entry[i].item === x._id) {
              Object.assign(x, entry[i])
              break
            }
          }
        })
        // reset orders to prevent inflation
        this.orderEntries = []
      } else {
        this.items = (await itemService.index(this.selection, true, this.search.toLowerCase())).data || []
      }
    }
  }
}
</script>

<style scoped>

</style>
