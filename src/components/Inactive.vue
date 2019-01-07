<template>
  <v-card>
    <error :response="response"/>
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
            <v-card max-width="250px">
              <v-container>
                <!-- info for item -->
                <v-list>
                  <template v-if="category === 'Items'">
                    <v-list-tile-title class="subheading">Name: {{data.name}}</v-list-tile-title>
                    <v-list-tile-title class="subheading">Catalog: {{data.catalogNumber}}</v-list-tile-title>
                    <v-list-tile-title class="subheading">Assay: {{getAssay(data)}}</v-list-tile-title>
                    <v-list-tile-title class="subheading">Vendor: {{getVendor(data)}}</v-list-tile-title>
                    <v-card-text v-if="!data.active">
                      Note: Associated assays and vendors will also be reactivated.
                    </v-card-text>
                  </template>
                  <!-- info for assay/vendor -->
                  <template v-else>
                    <v-list-tile-title class="subheading">Name: {{data.name}}</v-list-tile-title>
                    <v-card-text v-if="!data.active">
                      Note: Any previously associated items must be reactivated individually.
                    </v-card-text>
                  </template>
                </v-list>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn :color="activationText === 'Reactivate' ? 'success' : 'warning'" flat @click="reactivate(data, category)">
                    {{activationText}}
                  </v-btn>
                  <v-spacer/>
                </v-card-actions>
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
      response: '',
      categories: ['Items', 'Assays', 'Vendors'],
      menu: {},
      activationText: 'reactivate',
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
    // redirect if user
    if (this.user) {
      this.$router.push({
        name: 'index'
      })
    }
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
      this.response = (await itemService.index([], false))

      if (this.response.status === 200) {
        this.items = this.response.data
        this.assays = (await assayService.index([], false)).data
        this.vendors = (await vendorService.index([], false)).data

        this.assayList = (await assayService.index(['name', 'id', 'active'])).data
        this.assayList = this.assayList.concat(this.assays)
        this.vendorList = (await vendorService.index(['name', 'id', 'active'])).data
        this.vendorList = this.vendorList.concat(this.vendors)
      }
    },

    hasData (key) {
      return this[key.toLowerCase()].length > 0
    },

    getArray (key) {
      return this[key.toLowerCase()]
    },

    getAssay (data) {
      if (this.assayList.length === 0) return null
      data.assay = this.assayList.find(assay => assay.id === data.AssayId)
      return data.assay.name
    },

    getVendor (data) {
      if (this.vendorList.length === 0) return null
      data.vendor = this.vendorList.find(vendor => vendor.id === data.VendorId)
      return data.vendor.name
    },

    checkStatus (results, data) {
      if (!results.status === 200) {
        data.active = false
        this.snackbar = false // close previous snack if called consecutively
        this.activationText = 'Reactivate'
        this.snackText = `${Array.isArray(results.data) ? results.data[0].message : results.statusText}`
        this.snackColor = 'error'
        this.snackIcon = 'fa-skull-crossbones'
        this.snackbar = true
      } else {
        this.activationText = data.active ? 'deactivate' : 'reactivate'
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
        // item reactivation
        results = await itemService.put(data.id, data)
        this.checkStatus(results, data)
        // assay reactivation
        if (!data.assay.active) {
          // do not process if assay is active
          data.assay.active = !data.assay.active
          results = await assayService.put(data.assay)
          this.checkStatus(results, data)
        }
        // vendor reactivation
        if (!data.vendor.active) {
          // do not process if vendor is active
          data.vendor.active = !data.vendor.active
          results = await vendorService.put(data.vendor)
          this.checkStatus(results, data)
        }
      } else if (category === 'Assays') {
        results = await assayService.put(data)
        this.checkStatus(results, data)
        if (data.active) {
          // do not process if assay is inactive
          results = await itemService.deactivate(data.id)
          this.items.forEach(item => {
            if (item.AssayId === data.id) {
              item.active = false
            }
          })
        }
      } else if (category === 'Vendors') {
        results = await vendorService.put(data)
        this.checkStatus(results, data)
        if (data.active) {
          // do not process if vendor is inactive
          results = await itemService.deactivate(data.id)
          this.items.forEach(item => {
            if (item.VendorId === data.id) {
              item.active = false
            }
          })
        }
      } else {
        this.snackText = 'I dunno man. Something is wrong.'
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
