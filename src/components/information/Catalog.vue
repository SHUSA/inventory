<template>
  <v-card v-if="loadComponent" flat color="transparent">
    <deactivation :selection.sync="selectedChip" :dialog.sync="dialog" :reassigned.sync="reassigned" :assays="assays" :vendors="vendors"/>
    <error :response="response"/>
    <v-container fill-height grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 class="caption">
          Note: Highlighted Assays and Vendors have items assigned to them.
          <v-chip color="info" small>Example</v-chip>
        </v-flex>
        <v-flex xs4 v-for="(list, index) in lists" :key="index">
          <v-list dense class="transparent">
            <v-list-tile-title class="title">{{list}}</v-list-tile-title>
            <v-chip v-if="item.active" class="truncate" v-for="item in getArray(list)" :key="item.id" :color="item.hasItem ? 'info' : ''" @click="select(item)">
              {{item.name}}
            </v-chip>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- snack to deny entry -->
    <v-snackbar
      v-model="snackbar"
      color="warning"
      bottom
    >
      <v-icon class="pr-0">fa-exclamation-triangle</v-icon>
      <v-flex class="text-xs-center">
        <!-- to do: display item info on a card overlay -->
        Information not yet available
      </v-flex>
    </v-snackbar>
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
      reassigned: {},
      response: '',
      loadComponent: false,
      selectedChip: {},
      dialog: false,
      snackbar: false,
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

  watch: {
    reassigned (val) {
      if (val.hasOwnProperty('weeklyVolume')) {
        this.assays.find(assay => {
          if (assay.id === val.id) {
            assay.hasItem = val.hasItem
          }
        })
      } else {
        this.vendors.find(vendor => {
          if (vendor.id === val.id) {
            vendor.hasItem = val.hasItem
          }
        })
      }
    }
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
      this.response = (await itemService.index())

      // check if server is connected before continuing
      if (this.response.status === 200) {
        this.items = this.response.data
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
      }
      // go to top
      window.scroll({
        top: 0,
        left: 0
      })
    },

    getArray (list) {
      return this.$data[list.toLowerCase()]
    },

    select (obj) {
      if (this.admin) {
        this.selectedChip = obj
        this.dialog = true
      } else {
        this.snackbar = true
      }
    }
  }
}
</script>

<style scoped>
  .truncate {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
