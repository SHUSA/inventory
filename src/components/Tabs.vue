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
          <template v-if="active == 'tab-1'">
            <order v-if="search === 'order'" :order="selection" :vendors="vendors"/>
            <template v-else>
              <inventory :items="selection" :assays="assays" :vendors="vendors" :orders="orders"/>
            </template>
          </template>
          <template v-else>
            {{JSON.stringify(infoTab)}}
          </template>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      // active: null
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
    Order
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'drawer',
      'infoTab',
      'activeTab'
    ]),

    active: {
      get () {
        return this.activeTab
      },
      set (value) {
        this.$store.dispatch('setActiveTab', value)
      }
    }
  },

  methods: {
    // test () {
    //   console.log('tab test')
    //   this.$store.dispatch('setActiveTab', 1)
    //   this.active = parseInt(this.active) + 1
    //   console.log(this.active)
    // }
  }
}
</script>

<style scoped>

</style>
