<template>
  <div>
    <v-tabs
      dark
      v-model="active"
    >
      <v-tab
        v-for="(value, index) in tabs"
        :href="'#tab-' + (index + 1)"
        :key="index"
      >
        {{value}}
      </v-tab>
      <!-- <v-tab href="#tab-1">Main</v-tab>
      <v-tab href="#tab-2">Info Tab</v-tab> -->
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
        <info-page v-else>
          <item/>
        </info-page>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import InfoPage from './information/InfoPage'
import Item from './information/Item'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      active: null,
      tabs: ['Main']
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
    InfoPage,
    Item
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'drawer'
    ])
  },

  watch: {
    active (val) {
      if (this.active === 'tab-1' && this.tabs.length > 1) {
        this.tabs.pop()
        this.$store.dispatch('setTabInfo', {})
      }
    },

    selection () {
      this.active = 'tab-1'
      this.tabs = ['Main']
    }
  },

  methods: {
    getInfo (data) {
      if (this.tabs.length < 2) {
        this.tabs.push('Item Info')
      }
      this.$store.dispatch('setTabInfo', data)
      this.active = 'tab-2'
    }
  }
}
</script>

<style scoped>

</style>
