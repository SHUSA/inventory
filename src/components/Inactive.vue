<template>
  <v-card>
    <v-snackbar
      v-model="snackbar"
      :color="snackColor"
      bottom
    >
      <v-icon class="pr-0">{{snackIcon}}</v-icon>
      {{snackText}}
    </v-snackbar>
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
            <v-chip slot="activator" :color="data.active ? null : 'info'" :disabled="data.active">
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
                <v-card-actions>
                  <v-spacer/>
                  <v-btn :color="activationText === 'Reactivate' ? 'success' : 'warning'" flat @click="reactivate(data, category)">
                    {{activationText}}
                  </v-btn>
                </v-card-actions>
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
      menu: {},
      activationText: 'Reactivate',
      snackbar: false,
      snackText: '',
      snackColor: 'info',
      snackIcon: ''
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
      this.assayList = this.assayList.concat(this.assays)
      this.vendorList = (await vendorService.index(['name', 'id'])).data
      this.vendorList = this.vendorList.concat(this.vendors)
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
    },

    checkStatus (results, data) {
      if (!results.status === 200) {
        data.active = false
        this.activationText = 'Reactivate'
        this.snackText = `${Array.isArray(results.data) ? results.data[0].message : results.statusText}`
        this.snackColor = 'error'
        this.snackIcon = 'fa-skull-crossbones'
        this.snackbar = true
      } else {
        this.activationText = data.active ? 'Deactivate' : 'Reactivate'
        this.snackText = `${data.name} has been ${data.active ? 'reactivated' : 'deactivated'}`
        this.snackColor = data.active ? 'success' : 'warning'
        this.snackIcon = data.active ? 'fa-check-circle' : 'fa-exclamation-triangle'
        this.snackbar = true
      }
    },

    async reactivate (data, category) {
      let results = null
      data.active = !data.active
      this.snackbar = false

      if (category === 'Items') {
        results = await itemService.put(data.id, data)
        this.checkStatus(results, data)
      } else if (category === 'Assays') {
        results = await assayService.put(data.id, data)
        this.checkStatus(results, data)
      } else if (category === 'Vendors') {
        results = await vendorService.put(data.id, data)
        this.checkStatus(results, data)
      } else {
        this.snackText = 'I dunno man. No CATs match.'
        this.snackColor = 'warning'
        this.snackIcon = 'fa-cat'
        this.snackbar = true
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>
