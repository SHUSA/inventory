<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Coming Soon&#8482;</v-tab>
    </v-tabs>
    <order :order="selection" :items="items" v-if="search === 'order'"/>
    <template v-else>
      <admin-inventory :items="items" :assays="assays" :vendors="vendors" v-if="admin"/>
      <user-inventory :items="items" :assays="assays" v-if="user"/>
    </template>
  </div>
</template>

<script>
import Panel from './globals/Panel'
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
    'vendors'
  ],
  components: {
    Panel,
    AdminInventory,
    UserInventory,
    Order
  },
  data () {
    return {
      items: [],
      orders: []
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
        this.selection.entry.map(entry => {
          this.orders.push(entry.item)
        })
        // combine current stock and comments from entry to existing data
        this.items = (await itemService.show(this.orders)).data
        console.log(this.items)
      } else {
        this.items = (await itemService.index(this.selection, true, this.search.toLowerCase())).data
      }
    }
  }
}
</script>

<style scoped>

</style>
