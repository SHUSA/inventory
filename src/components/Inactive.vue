<template>
  <v-card>
    <error :response="response"/>
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
            <v-card max-width="100%">
              <v-container>
                <!-- info for item -->
                <v-list>
                  <template v-if="category === 'Items'">
                    <v-list-tile-title class="subheading">Name: {{data.name}}</v-list-tile-title>
                    <v-list-tile-title class="subheading">Catalog: {{data.catalogNumber}}</v-list-tile-title>
                    <v-list-tile-title class="subheading">Assay: {{data.Assay.name}}</v-list-tile-title>
                    <v-list-tile-title class="subheading">Vendor: {{data.Vendor.name}}</v-list-tile-title>
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
                  <v-btn :color="data.active ? 'warning' : 'success'" flat @click="reactivate(data, category)">
                    {{data.active ? 'Deactivate' : 'Reactivate'}}
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
      response: '',
      categories: ['Items', 'Assays', 'Vendors'],
      menu: {}
    }
  },

  computed: {
    ...mapState([
      'user',
      'route'
    ])
  },

  mounted () {
    // redirect if user
    if (!this.user.isAdmin) {
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
      }
    },

    hasData (key) {
      return this[key.toLowerCase()].length > 0
    },

    getArray (key) {
      return this[key.toLowerCase()]
    },

    checkStatus (results, data) {
      if (!results.status === 200) {
        data.active = false
        this.$store.dispatch('setSnack', {
          text: `${Array.isArray(results.data) ? results.data[0].message : results.statusText}`,
          color: 'error',
          icon: 'fa-skull-crossbones'
        })
      } else {
        this.$store.dispatch('setSnack', {
          text: `${data.name} has been ${data.active ? 'reactivated' : 'deactivated'}`,
          color: data.active ? 'success' : 'warning',
          icon: data.active ? 'fa-check-circle' : 'fa-exclamation-triangle'
        })
      }
    },

    async reactivate (data, category) {
      let results = null
      data.active = !data.active

      if (category === 'Items') {
        // item reactivation
        results = await itemService.put(data.id, data)
        this.checkStatus(results, data)
        // assay reactivation
        if (!data.Assay.active) {
          // do not process if assay is active
          data.Assay.active = !data.Assay.active
          results = await assayService.put(data.Assay)
          this.checkStatus(results, data)
        }
        // vendor reactivation
        if (!data.Vendor.active) {
          // do not process if vendor is active
          data.Vendor.active = !data.Vendor.active
          results = await vendorService.put(data.Vendor)
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
        this.$store.dispatch('setSnack', {
          text: 'I dunno man. Something is wrong.',
          color: 'warning',
          icon: 'fa-cat'
        })
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>
