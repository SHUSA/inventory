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
          <order v-if="search === 'order'" :order="list" :vendors="vendors"/>
          <info-list v-else-if="search === 'info'" :list="list" :getInfo="getInfo"/>
          <inventory v-else :items="list" :assays="assays" :vendors="vendors" :orders="orders" :getInfo="getInfo"/>
        </template>
        <item v-if="type === 'item' && active === 'tab-2'"/>
        <assay v-if="type === 'assay' && active === 'tab-2'"/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Inventory from './Inventory'
import Order from './Order'
import Item from './information/Item'
import Assay from './information/Assay'
import InfoList from './InfoList'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      active: null,
      tabs: ['Main'],
      type: null
    }
  },

  props: [
    'search',
    'assays',
    'vendors',
    'orders',
    'list',
    'selection'
  ],

  components: {
    Inventory,
    Order,
    Item,
    Assay,
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

    list () {
      this.active = 'tab-1'
      this.tabs = ['Main']
      this.type = null
    }
  },

  methods: {
    getInfo (data) {
      this.type = this.selection

      if (this.type === 'item') {
        if (this.tabs.length < 2) {
          this.tabs.push('Item Info')
        }
        this.$store.dispatch('setItemInfo', data)
      } else if (this.type === 'assay') {
        if (this.tabs.length < 2) {
          this.tabs.push('Assay Info')
        }
        this.$store.dispatch('setAssayInfo', data)
      } else {
        this.tabs.push('No Data')
        this.$store.dispatch('setItemInfo', {})
      }

      this.active = 'tab-2'
    }
  }
}
</script>

<style scoped>

</style>
