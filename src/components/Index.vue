<template>
  <v-layout>
    <!-- components -->
    <v-flex xs12 wrap>
      <inventory-index v-if="mode === 'inventory'"/>
      <order-index v-else-if="mode === 'orders'"/>
      <update v-else-if="mode === 'menu'"/>
    </v-flex>
    <!-- fab button -->
    <scroll/>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import InventoryIndex from './inventory/InventoryIndex'
import OrderIndex from './order/OrderIndex'
import Update from './Update'

export default {
  components: {
    InventoryIndex,
    OrderIndex,
    Update
  },

  mounted () {
    let initial = 'menu'
    this.$store.dispatch('setTitle', initial)
    this.$store.dispatch('setMode', initial)
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'mode'
    ])
  }
}
</script>

<style scoped>

</style>
