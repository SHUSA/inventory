<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Coming Soon&#8482;</v-tab>
    </v-tabs>
    <order v-if="search === 'order'" :order="selection" :orders="orders"/>
    <template v-else>
      <inventory :items="selection" :assays="assays" :vendors="vendors" :orders="orders"/>
    </template>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import { mapState } from 'vuex'

export default {
  props: [
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
  computed: {
    ...mapState([
      'user',
      'admin',
      'drawer'
    ])
  }
}
</script>

<style scoped>

</style>
