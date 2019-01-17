<template>
  <v-card v-if="loadComponent" flat color="transparent">
    <item-info :item.sync="selectedChip" :dialog.sync="itemInfoDialog" :assays="assays" :vendors="vendors"/>
    <assay-info :assay.sync="selectedChip" :dialog.sync="assayInfoDialog" :reassigned.sync="reassigned" :assays="assays"/>
    <vendor-info :vendor.sync="selectedChip" :dialog.sync="vendorInfoDialog" :reassigned.sync="reassigned" :vendors="vendors"/>
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
            <!-- to do: add transtiions -->
            <v-chip class="truncate" v-for="item in getArray(list)" :key="item.id" :color="item.hasItem ? 'info' : ''" @click="select(item)">
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
import ItemInfo from '../information/ItemInfo'
import AssayInfo from '../information/AssayInfo'
import VendorInfo from '../information/VendorInfo'

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
      itemInfoDialog: false,
      assayInfoDialog: false,
      vendorInfoDialog: false,
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
    itemInfoDialog (val) {
      if (!val) {
        this.removeItems(this.selectedChip)
      }
    },

    reassigned (val) {
      if (val.hasOwnProperty('weeklyVolume')) {
        // change all items with associated assay
        this.assays.find(assay => {
          if (assay.id === val.id) {
            assay.hasItem = val.hasItem
          }
        })
        this.items.forEach(item => {
          if (item.AssayId === this.selectedChip.id) {
            item.AssayId = val.id
            item.AssayName = val.name
          }
        })
      } else {
        // change all items with associated vendor
        this.vendors.find(vendor => {
          if (vendor.id === val.id) {
            vendor.hasItem = val.hasItem
          }
        })
        this.items.forEach(item => {
          if (item.VendorId === this.selectedChip.id) {
            item.VendorId = val.id
            item.VendorName = val.name
          }
        })
      }
    }
  },

  components: {
    Deactivation,
    ItemInfo,
    AssayInfo,
    VendorInfo
  },

  mounted () {
    this.initialize()
    this.loadComponent = true
  },

  methods: {
    async initialize () {
      this.$store.dispatch('setTitle', 'Catalog')
      this.response = (await itemService.index())

      // check if server is connected before continuing
      if (this.response.status === 200) {
        this.items = this.response.data
        this.assays = (await assayService.index()).data
        this.vendors = (await vendorService.index()).data

        this.hasItem()
      }
      // go to top
      window.scroll({
        top: 0,
        left: 0
      })
    },

    removeItems (val) {
      let index = null
      // remove items if their assay or vendor is deactivated
      if (val.hasOwnProperty('catalogNumber') && !val.active) {
        // remove inactive items from item list
        index = this.items.findIndex(item => item.id === val.id)
        this.items.splice(index, 1)
      } else if (val.hasOwnProperty('weeklyVolume') && !val.active) {
        // is assay
        if (val.hasItem) {
          // remove items with same assay id
          for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].AssayId === val.id) {
              this.items.splice(i, 1)
            }
          }
        }
        index = this.assays.findIndex(assay => assay.id === val.id)
        this.assays.splice(index, 1)
      } else if (!val.active) {
        // is vendor
        if (val.hasItem) {
          // remove items with same vendor id
          for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].VendorId === val.id) {
              this.items.splice(i, 1)
            }
          }
        }
        index = this.vendors.findIndex(vendor => vendor.id === val.id)
        this.vendors.splice(index, 1)
      }
    },

    hasItem () {
      let itemAssayIds = {}
      let itemVendorIds = {}

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

      if (obj.hasOwnProperty('catalogNumber')) {
        this.itemInfoDialog = true
      } else if (obj.hasOwnProperty('weeklyVolume')) {
        this.assayInfoDialog = true
      } else {
        this.vendorInfoDialog = true
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
