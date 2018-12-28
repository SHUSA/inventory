<template>
  <v-card v-if="loadComponent" flat color="transparent">
    <deactivation :selection="selectedChip" :dialog.sync="dialog"/>
    <v-container fill-height grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 class="caption">
          Note: Highlighted Assays and Vendors have items assigned to them.
          <v-chip color="info">Example</v-chip>
        </v-flex>
        <v-flex xs4 v-for="(list, index) in lists" :key="index">
          <v-list dense class="transparent">
            <v-list-tile-title class="title">{{list}}</v-list-tile-title>
            <v-chip v-for="item in getArray(list)" :key="item.id" :color="item.hasItem ? 'info' : ''" @click="select(item)">
              {{item.name}}
            </v-chip>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import Deactivation from '../dialogs/Deactivation'

export default {
  data () {
    return {
      items: [],
      assays: [],
      vendors: [],
      loadComponent: false,
      selectedChip: {},
      dialog: false,
      lists: ['Items', 'Assays', 'Vendors']
    }
  },

  computed: {
    ...mapState([
      'pageTitle',
      'admin',
      'user'
    ])
  },

  components: {
    Deactivation
  },

  mounted () {
    this.initialize()
    this.loadComponent = true
  },

  methods: {
    async initialize () {
      let itemAssayIds = {}
      let itemVendorIds = {}
      this.$store.dispatch('setTitle', 'Catalog')
      this.items = (await itemService.index()).data
      this.assays = (await assayService.index()).data
      this.vendors = (await vendorService.index()).data
      // to do: find if assay has an assigned item
      // store assay and vendor ids from each item
      this.items.forEach(item => {
        itemAssayIds[item.AssayId] = true
        itemVendorIds[item.VendorId] = true
      })
      // loop through assays and vendors and check if id is in the object ids
      this.assays.forEach(assay => {
        assay.hasItem = itemAssayIds.hasOwnProperty(assay.id)
      })
      this.vendors.forEach(vendor => {
        vendor.hasItem = itemVendorIds.hasOwnProperty(vendor.id)
      })
    },

    getArray (list) {
      return this.$data[list.toLowerCase()]
    },

    select (obj) {
      this.selectedChip = obj
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
