<template>
  <v-container fluid grid-list-md v-if="loadComponent">
    <v-container>
      <v-layout row wrap>
        <v-btn small dark color="primary" @click="dialog = !dialog" v-if="admin">
          Add Item
        </v-btn>
        <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
          <v-icon small class="pr-1">fa-file-download</v-icon>CSV
        </v-btn>

        <v-spacer/>

        <v-spacer/>

        <!-- all in one filter -->
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Search for item, assay, vendor, etc"
          hint="test"
          persistent-hint
          clearable
          single-line
          hide-details
        />
      </v-layout>
      <v-layout row wrap>
        <!-- displays each assay with outstanding orders -->
        <v-card-text>
          Assays not updated since {{lastOrderPeriod}} will look like so
          <v-chip small>
            <v-badge color="red" right>
              <span slot="badge">EX</span>
              <span>Example</span>
            </v-badge>
          </v-chip>
        </v-card-text>
        <v-chip v-for="(value, index) in outstandingAssays" :key="index" @click="searchTerm(value[0])">
          <v-badge color="red" right>
            <span v-if="!value[2]" slot="badge">{{value[1]}}</span>
            <span>{{value[0]}}</span>
          </v-badge>
        </v-chip>
      </v-layout>
    </v-container>

    <v-snackbar
      v-model="snackbar"
      color="primary"
      bottom
    >
      <v-flex class="text-xs-center">
        {{snackText}}
      </v-flex>
    </v-snackbar>

    <v-data-iterator
      :items="supplies"
      ref="search"
      content-tag="v-layout"
      row
      wrap
      hide-actions
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs2
      >
        <!-- big card -->
        <v-card>
          <v-card-title class="title py-1">{{props.item.name}}</v-card-title>
          <v-card-text class="caption py-0">{{props.item.catalogNumber}} - {{getVendor(props.item)}} - {{getAssay(props.item)}}</v-card-text>
          <v-divider/>
          <v-card-text v-if="props.item.itemDescription" class="py-1">
            <v-icon small>fa-info-circle</v-icon>
            {{props.item.itemDescription}}
          </v-card-text>
          <v-card-text class="py-1" v-else>
            <v-icon small>fa-times</v-icon>
            No description
          </v-card-text>
          <v-divider/>
          <v-container class="py-0">
            <v-form>
              <v-text-field label="Stock" type="number"
                persistent-hint :hint="`Reorder amount: ${props.item.reorderQuantity} Reorder point: ${props.item.reorderPoint}`"
                :value="props.item.currentStock"
              >
              </v-text-field>
              <v-checkbox v-model="manualOrder" class="py-0" label="Manual Order" :value="props.item.id"/>
              <v-textarea clearable no-resize rows="4" class="py-0" label="Comment" :value="props.item.comment"></v-textarea>
            </v-form>
          </v-container>
          <v-divider/>
          <v-footer class="caption" color="white">
            <v-flex text-xs-center>
              Last Updated: {{time(props.item)}}
            </v-flex>
          </v-footer>
        </v-card>
      </v-flex>
    </v-data-iterator>
    <scroll/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
// import entryService from '@/services/EntryService.js'
import orderService from '@/services/OrderService.js'
const Json2csvParser = require('json2csv').Parser

export default {
  data () {
    return {
      show: false,
      currentItem: {},
      vendorNames: [],
      assayNames: [],
      supplies: [],
      vendorList: [],
      assayList: [],
      orderList: [],
      loading: false,
      loadComponent: false,
      snackbar: false,
      snackText: '',
      search: '',
      alertMessage: '',
      manualOrder: [],
      editedItem: {
        name: '',
        AssayId: '',
        VendorId: '',
        catalogNumber: '',
        itemDescription: '',
        reactionsPerItem: 0,
        currentStock: 0,
        weeksOfSafetyStock: 2,
        leadTimeDays: 7,
        weeksOfReorder: 8,
        reorderPoint: 0,
        reorderQuantity: 0,
        comment: ''
      },
      defaultItem: {
        name: '',
        AssayId: '',
        VendorId: '',
        catalogNumber: '',
        itemDescription: '',
        reactionsPerItem: 0,
        currentStock: 0,
        weeksOfSafetyStock: 2,
        leadTimeDays: 7,
        weeksOfReorder: 8,
        reorderPoint: 0,
        reorderQuantity: 0,
        comment: ''
      }
    }
  },

  computed: {
    ...mapState([
      'pageTitle',
      'admin',
      'user',
      'storedFilters'
    ]),

    lastOrderPeriod () {
      return this.$moment().startOf('week').subtract(7, 'day').format('MMM DD, YYYY')
    },

    outstandingAssays () {
      let obj = {}
      // fix coding; clunky
      this.supplies.map(item => {
        this.recentlyUpdated(item)
        this.getAssay(item)
        // check if assay object is attached and make sure it's not a duplicate
        if (item.assay) {
          let assay = item.assay
          if (obj.hasOwnProperty(assay.name)) {
            obj[assay.name].count += 1
          } else {
            obj[assay.name] = {}
            obj[assay.name].count = 0
            obj[assay.name].recentlyUpdated = item.recentlyUpdated
            if (!item.recentlyUpdated) obj[assay.name].count += 1
          }
        }
      })

      let arr = []

      Object.keys(obj).forEach((key, i) => {
        arr.push([key, obj[key].count, obj[key].recentlyUpdated])
      })

      return arr.sort((a, b) => a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'}))
    }
  },

  watch: {
    // dialogs go here
  },

  async mounted () {
    // initialize variables
    this.loadComponent = false
    this.supplies = (await itemService.show(this.storedFilters)).data
    this.catalogNumbers = (await itemService.index(['catalogNumber'])).data.map(item => item.catalogNumber)
    this.vendorList = (await vendorService.index()).data
    this.vendorNames = this.vendorList.map(vendor => vendor.name.toUpperCase())
    this.assayList = (await assayService.index()).data
    this.assayNames = this.assayList.map(assay => assay.name.toUpperCase())
    this.orderList = (await orderService.index()).data

    // go to top
    window.scroll({
      top: 0,
      left: 0
    })
    this.loadComponent = true
  },

  methods: {
    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['vendor', 'catalogNumber', 'assay.name', 'name', 'currentStock', 'lastUpdate']
      const json2csv = new Json2csvParser({fields})
      const results = this.$refs.search.filteredItems
      const csv = json2csv.parse(results)
      const blob = new Blob([csv], {type: 'text/csv'})

      csvbtn.href = URL.createObjectURL(blob)
      csvbtn.download = `${this.$moment().format('YYYY-MM-DD')} Inventory.csv`
    },

    time (item) {
      item.lastUpdate = this.$moment(item.updatedAt).format('MMM-DD-YYYY')
      return item.lastUpdate
    },

    recentlyUpdated (item) {
      let oneWeekAgo = this.$moment().startOf('week').subtract(7, 'day').format()

      // checks to see if item was updated in the past 2 weeks, starting from Sunday
      // does not account if user or admin did the update
      // does not account if order was triggered
      if (item.updatedAt < oneWeekAgo) {
        item.recentlyUpdated = false
      } else {
        item.recentlyUpdated = true
      }

      return item.recentlyUpdated
    },

    checkQuantity (item) {
      return item.currentStock <= item.reorderPoint
    },

    checkPreviousOrder (recentOrder) {
      const lastSunday = this.$moment().startOf('week').format()

      return recentOrder.createdAt < lastSunday || recentOrder.completed
    },

    createEntry (editedItem) {
      return {
        ItemId: editedItem.id,
        updatedAt: editedItem.updatedAt,
        currentStock: editedItem.currentStock,
        orderQuantity: editedItem.currentStock + editedItem.reorderQuantity,
        comment: editedItem.comment
      }
    },

    toOrder (item) {
      return this.checkQuantity(item) ? item.reorderQuantity : 0
    },

    checkErrorMessage (resp) {
      if (resp.status !== 200) {
        // stop process and display error message
        this.loading = false
        this.alert = true
        this.alertMessage = Array.isArray(resp.data) ? resp.data[0].message : resp.statusText
        return true
      } else {
        // no errors received
        return false
      }
    },

    openSnack (text) {
      this.snackText = text
      this.snackbar = true
    },

    customFilter (item, queryText, itemText) {
      console.log('customFilter')
      console.log(`item ${item}`)
      console.log(`queryText ${queryText}`)
      console.log(`itemText ${itemText}`)

      return null
    },

    getAssay (item) {
      if (this.assayList.length === 0) {
        return null
      }
      item.assay = this.assayList.find(assay => assay.id === item.AssayId)
      return item.assay.name
    },

    getVendor (item) {
      if (this.vendorList.length === 0) {
        return null
      }
      item.vendor = this.vendorList.find(vendor => vendor.id === item.VendorId).name
      return item.vendor
    }
  }
}
</script>

<style scoped>

</style>
