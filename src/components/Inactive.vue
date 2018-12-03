<template>
  <v-card>
    <v-container>
      <v-layout row wrap v-for="(category, index) in categories" :key="index">
        <!-- loop through categories and get info from arrays -->
        <v-card-title class="title font-weight-bold font-italic">
          <u>{{category}}</u>
        </v-card-title>
        <v-card-text v-if="hasData(category)">
          <v-menu
            v-model="menu[data.id]"
            v-for="data in getArray(category)" :key="data.id"
            offset-x
          >
            <v-chip slot="activator" label>
              {{data.name}}
            </v-chip>
            <v-card v-if="category !== 'Vendors'">
              <!-- info for item -->
              <v-container v-if="category === 'Items'">
                <v-list>
                  <v-list-tile-title>Name: {{data.name}}</v-list-tile-title>
                  <v-list-tile-title>Catalog: {{data.catalogNumber}}</v-list-tile-title>
                  <v-list-tile-title>Assay: {{getAssay(data)}}</v-list-tile-title>
                  <v-list-tile-title>Vendor: {{getVendor(data)}}</v-list-tile-title>
                </v-list>
              </v-container>
              <!-- info for assay -->
              <v-container v-if="category === 'Assays'">
                {{data}}
              </v-container>
            </v-card>
          </v-menu>
        </v-card-text>
        <v-card-text v-else>None available.</v-card-text>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import itemService from '@/services/ItemService.js'

export default {
  data () {
    return {
      items: [],
      vendors: [],
      assays: [],
      vendorList: [],
      assayList: [],
      categories: ['Items', 'Assays', 'Vendors'],
      menu: {}
    }
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'route'
    ])
  },

  mounted () {
    this.initialize()
    // go to top
    window.scroll({
      top: 0,
      left: 0
    })
  },

  methods: {
    async initialize () {
      this.$store.dispatch('setTitle', this.route.name)

      this.items = (await itemService.index([], false)).data
      this.assays = (await assayService.index([], false)).data
      this.vendors = (await vendorService.index([], false)).data

      this.assayList = (await assayService.index(['name', 'id'])).data
      this.vendorList = (await vendorService.index(['name', 'id'])).data
    },

    hasData (key) {
      return this[key.toLowerCase()].length > 0
    },

    getArray (key) {
      return this[key.toLowerCase()]
    },

    getAssay (data) {
      if (this.assayList.length === 0) return null
      return this.assayList.find(assay => assay.id === data.AssayId).name
    },

    getVendor (data) {
      if (this.vendorList.length === 0) return null
      return this.vendorList.find(vendor => vendor.id === data.VendorId).name
    }
  }
}
</script>

<style scoped>

</style>
