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

      <v-tab-item
        v-for="n in 2"
        :id="'tab-' + n"
        :key="n"
      >
        <template v-if="n == 1">
          <order v-if="search === 'order'" :order="selection" :vendors="vendors"/>
          <list v-else-if="search === 'info'" :list="selection"/>
          <inventory v-else :items="selection" :assays="assays" :vendors="vendors" :orders="orders" :getInfo="getInfo"/>
        </template>
        <item v-else/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import Item from './information/Item'
import InfoList from './InfoList'
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
    Item,
    InfoList
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
        this.$store.dispatch('setItemInfo', {})
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
      this.$store.dispatch('setItemInfo', data)
      this.active = 'tab-2'
    }
  }
}
</script>

<style scoped>

</style>
