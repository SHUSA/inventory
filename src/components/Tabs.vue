<template>
  <div>
    <v-tabs
      dark
      v-model="active"
    >
      <v-tab href="#tab-1">Main</v-tab>
      <v-tab href="#tab-2">Coming Soon&#8482;</v-tab>
      <v-tab-item
        v-for="n in 2"
        :id="'tab-' + n"
        :key="n"
      >
        <template v-if="n == 1">
          <order v-if="search === 'order'" :order="selection" :vendors="vendors"/>
          <template v-else>
            <inventory :items="selection" :assays="assays" :vendors="vendors" :orders="orders" :getInfo="getInfo"/>
          </template>
        </template>
        <info-page v-else/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import InfoPage from './InfoPage'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      active: null
    }
  },

  props: [
    'search',
    'assays',
    'vendors',
    'orders',
    'selection'
  ],

  components: {
    Inventory,
    Order,
    InfoPage
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'drawer'
    ])
  },

  methods: {
    getInfo (data) {
      this.$store.dispatch('setTabInfo', data)
      this.active = 'tab-2'
    }
  }
}
</script>

<style scoped>

</style>
