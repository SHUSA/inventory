<template>
  <v-card v-if="loadComponent">
    <error :response="response"/>
    <v-card-title>
      <item-dialog
        :itemDialog.sync="itemDialog"
        :selectedItem.sync="currentItem"
        :catalogNumbers.sync="catalogNumbers"
        :assayNameList.sync="assayNames"
        :vendorNameList.sync="vendorNames"
        :itemList.sync="supplies"
        :assayList.sync="assayList"
        :vendorList.sync="vendorList"
        :editedIndex.sync="editedIndex"
      />

      <assay-dialog
        :assayDialog.sync="assayDialog"
        :selectedAssay.sync="currentAssay"
        :itemList.sync="supplies"
        :assayNameList.sync="assayNames"
        :assayList.sync="assayList"
        :assayIndex.sync="assayIndex"
        :editedItem="currentItem"
        :reassigned.sync="reassigned"
      />

      <vendor-dialog
        :vendorDialog.sync="vendorDialog"
        :selectedVendor.sync="currentVendor"
        :vendorNameList.sync="vendorNames"
        :vendorIndex.sync="vendorIndex"
        :vendorList.sync="vendorList"
        :editedItem="currentItem"
        :reassigned.sync="reassigned"
      />

      <v-container>
        <v-layout row wrap>
          <v-btn small dark color="primary" v-if="!sup" @click="editItem({})">
            Add Item
          </v-btn>
          <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
            <v-icon small class="pr-1">fa-file-download</v-icon>
            Inventory CSV
          </v-btn>
          <v-btn href="javascript:void(0)" id="backup" small dark @click="getBackup">
            <v-icon small class="pr-1">fa-file-download</v-icon>Backup Parameters
          </v-btn>

          <v-spacer/>

          <v-spacer/>

          <!-- all in one filter -->
          <v-text-field
            v-model="search"
            append-icon="fa-search"
            hint="Searches entire table"
            search="Search"
            persistent-hint
            clearable
            single-line
          />
        </v-layout>
        <v-layout row wrap>
          <!-- displays each assay with outstanding orders -->
          <v-expansion-panel class="mt-3" expand>
            <v-expansion-panel-content>
              <template slot="header">Outstanding Assays</template>
              <v-divider/>
              <v-card-text>
              <!-- to do: add a way to collapse chips -->
                Not updated since {{lastOrderPeriod}}, Ex:
                <v-chip small class="ml-0">
                  <v-badge color="red" right>
                    <span slot="badge">#</span>
                    <span>Name</span>
                  </v-badge>
                </v-chip>
              </v-card-text>
              <v-chip
                v-for="(value, index) in outstandingAssays"
                :key="index"
                @click="searchTerm(value.name)"
                :color="isSelected(value.name) ? 'info' : ''"
              >
                <v-badge color="red" right>
                  <span v-if="value.count > 0" slot="badge">{{value.count}}</span>
                  <span>{{value.name}}</span>
                </v-badge>
              </v-chip>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
              <template slot="header">Vendors</template>
              <v-divider/>
              <!-- display current vendors -->
              <v-chip
                v-for="(value, index) in listVendors"
                :key="index" @click="searchTerm(value)"
                :color="isSelected(value) ? 'info' : ''">
                {{value}}
              </v-chip>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-layout>
      </v-container>
    </v-card-title>

    <v-data-table
      ref="search"
      :headers="headers"
      :items="supplies"
      :search="search"
      must-sort
      hide-actions
    >
      <!-- item name -->
      <template slot="items" slot-scope="props">
        <td class="pointer" @click="editItem(props.item)">
          <v-tooltip top open-delay=50>
            <span slot="activator">{{props.item.name}}</span>
            <span>Edit {{props.item.name}} info</span>
          </v-tooltip>
        </td>
        <!-- vendor name -->
        <td class="pointer" @click="editVendor(props.item.VendorId)">
          <v-tooltip top open-delay=50>
            <span slot="activator">{{props.item.Vendor.name}}</span>
            <span>Edit Vendor</span>
          </v-tooltip>
        </td>
        <!-- assay name -->
        <td class="pointer" @click="editAssay(props.item.AssayId)">
          <v-tooltip top open-delay=50>
            <span slot="activator">{{props.item.Assay.name}}</span>
            <span>Edit Assay</span>
          </v-tooltip>
        </td>
        <!-- catalog number -->
        <td>{{props.item.catalogNumber}}</td>
        <!-- item description -->
        <td>{{props.item.itemDescription}}</td>
        <!-- current stock -->
        <td class="pointer" @click="editItem(props.item)">
          <v-badge color="red">
            <span slot="badge" v-if="checkQuantity(props.item)">!</span>
            {{props.item.currentStock}}
          </v-badge>
        </td>
        <!-- reorder quantity -->
        <td>{{toOrder(props.item)}}</td>
        <!-- comment -->
        <td class="pointer" @click="editItem(props.item)">{{props.item.comment}}</td>
        <!-- last update -->
        <td>{{time(props.item)}}</td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="fa-exclamation-triangle">Nothing here!</v-alert>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        No results for {{search}}.
      </v-alert>
    </v-data-table>
    <scroll/>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import orderService from '@/services/OrderService.js'
import entryService from '@/services/EntryService.js'
import ItemDialog from '../dialogs/ItemDialog'
import AssayDialog from '../dialogs/AssayDialog'
import VendorDialog from '../dialogs/VendorDialog'
import saveAs from 'file-saver'
import JSZip from 'jszip'
const Json2csvParser = require('json2csv').Parser

export default {
  components: {
    ItemDialog,
    AssayDialog,
    VendorDialog
  },

  data () {
    return {
      response: '',
      currentItem: {},
      currentAssay: {},
      currentVendor: {},
      reassigned: {},
      catalogNumbers: [],
      vendorNames: [],
      assayNames: [],
      showChip: false,
      itemDialog: false,
      assayDialog: false,
      vendorDialog: false,
      loadComponent: false,
      search: '',
      headers: [
        {text: 'Item', value: 'name', width: '15%'},
        {text: 'Vendor', value: 'Vendor.name'},
        {text: 'Assay', value: 'Assay.name'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'itemDescription', width: '10%'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'reorderQuantity'},
        {text: 'Comment', value: 'comment', width: '15%'},
        {text: 'Last Update', value: 'updatedAt'}
      ],
      supplies: [],
      assayList: [],
      vendorList: [],
      orderList: [],
      editedIndex: -1,
      assayIndex: -1,
      vendorIndex: -1
    }
  },

  watch: {
    itemDialog (val) {
      if (!val && !this.currentItem.active) {
        this.removeItems(this.currentItem)
      }
    },

    assayDialog (val) {
      if (!val && !this.currentAssay.active) {
        this.removeItems(this.currentAssay)
      }
    },

    vendorDialog (val) {
      if (!val && !this.currentVendor.active) {
        this.removeItems(this.currentVendor)
      }
    },

    reassigned (val) {
      if (val.hasOwnProperty('weeklyVolume')) {
        // change all items with associated assay
        this.assayList.find(assay => {
          if (assay.id === val.id) {
            assay.hasItem = val.hasItem
          }
        })
        this.supplies.forEach(item => {
          if (item.AssayId === this.currentAssay.id) {
            item.AssayId = val.id
            item.Assay = val
          }
        })
      } else {
        // change all items with associated vendor
        this.vendorList.find(vendor => {
          if (vendor.id === val.id) {
            vendor.hasItem = val.hasItem
          }
        })
        this.supplies.forEach(item => {
          if (item.VendorId === this.currentVendor.id) {
            item.VendorId = val.id
            item.Vendor = val
          }
        })
      }
    }
  },

  computed: {
    ...mapState([
      'pageTitle',
      'user',
      'route',
      'sup',
      'storedFilters'
    ]),

    lastOrderPeriod () {
      return this.$moment().startOf('week').subtract(7, 'day').format('MMM DD, YYYY')
    },

    listVendors () {
      let arr = []
      this.supplies.map(entry => {
        if (arr.indexOf(entry.Vendor.name) === -1) {
          arr.push(entry.Vendor.name)
        }
      })

      return arr.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
    },

    outstandingAssays () {
      return this.$util.outstandingAssays(this)
    }
  },

  async mounted () {
    // redirect if user
    if (!(this.user.isAdmin || this.user.isSubAdmin)) {
      this.$router.push({
        name: 'index'
      })
    }
    // initialize variables
    this.loadComponent = false
    if (this.storedFilters.length === 0) {
      let data = (await itemService.index(['id'])).data
      let ids = data.map(x => x.id)
      this.$store.dispatch('setFilters', ids)
    }
    this.response = (await itemService.show(this.storedFilters))

    if (this.response.status === 200) {
      this.$store.dispatch('setTitle', this.route.name)
      this.supplies = this.response.data
      this.catalogNumbers = (await itemService.index(['catalogNumber'], [true, false])).data.map(item => item.catalogNumber)
      this.vendorList = (await vendorService.index()).data
      this.vendorNames = (await vendorService.index(['name'], [true, false])).data.map(vendor => vendor.name.toUpperCase())
      this.assayList = (await assayService.index()).data
      this.assayNames = (await assayService.index(['name'], [true, false])).data.map(assay => assay.name.toUpperCase())

      this.hasItem()

      // go to top
      window.scroll({
        top: 0,
        left: 0
      })
    }
    this.loadComponent = true
  },

  methods: {
    hasItem () {
      let itemAssayIds = {}
      let itemVendorIds = {}

      // store assay and vendor ids from each item
      this.supplies.forEach(item => {
        itemAssayIds[item.AssayId] = true
        itemVendorIds[item.VendorId] = true
      })
      // loop through assays and vendors and check if id is in the object ids
      this.assayList.forEach(assay => {
        assay.hasItem = itemAssayIds.hasOwnProperty(assay.id)
      })
      this.vendorList.forEach(vendor => {
        vendor.hasItem = itemVendorIds.hasOwnProperty(vendor.id)
      })
    },

    removeItems (val) {
      let index = null
      // remove items if their assay or vendor is deactivated
      if (val.hasOwnProperty('catalogNumber')) {
        // remove inactive items from item list
        index = this.supplies.findIndex(item => item.id === val.id)
        this.supplies.splice(index, 1)
      } else if (val.hasOwnProperty('weeklyVolume')) {
        // is assay
        if (val.hasItem) {
          // remove items with same assay id
          for (let i = this.supplies.length - 1; i >= 0; i--) {
            if (this.supplies[i].AssayId === val.id) {
              this.supplies.splice(i, 1)
            }
          }
        }
        index = this.assayList.findIndex(assay => assay.id === val.id)
        this.assayList.splice(index, 1)
      } else if (val.hasOwnProperty('hasItem')) {
        // is vendor
        if (val.hasItem) {
          // remove items with same vendor id
          for (let i = this.supplies.length - 1; i >= 0; i--) {
            if (this.supplies[i].VendorId === val.id) {
              this.supplies.splice(i, 1)
            }
          }
        }
        index = this.vendorList.findIndex(vendor => vendor.id === val.id)
        this.vendorList.splice(index, 1)
      }
    },

    // filter (items, search, filter) {
    //   let tempKey = ''
    //   if (search === '' || search === null) {
    //     return items
    //   }
    //   return items.filter(item => {
    //     this.headers.forEach(header => {
    //       tempKey = header.value.split('.').map()
    //       filter(item[header.value], search.toLowerCase())
    //     })
    //   })
    // },

    isSelected (name) {
      if (this.$refs.search) {
        return this.$refs.search.filteredItems.find(item => {
          return item.Assay.name === name || item.Vendor.name === name
        })
      } else {
        return true
      }
    },

    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['Vendor.name', 'catalogNumber', 'Assay.name', 'name', 'currentStock', 'lastUpdate']
      const json2csv = new Json2csvParser({fields})
      const results = this.$refs.search.filteredItems
      const csv = json2csv.parse(results)
      const blob = new Blob([csv], {type: 'text/csv'})

      csvbtn.href = URL.createObjectURL(blob)
      csvbtn.download = `${this.$moment().format('YYYY-MM-DD')} Inventory.csv`
    },

    async getBackup () {
      const json2csv = new Json2csvParser()
      const json2csv2 = new Json2csvParser({flatten: true})
      const json2csv3 = new Json2csvParser()
      const json2csv4 = new Json2csvParser()
      const json2csv5 = new Json2csvParser()
      const zip = new JSZip()
      let items = []
      let orders = []
      let entries = []
      // to do: convert data to json for zip
      // const assay = (await assayService.index()).data
      // const csv = json2csv.parse(assay)
      items = (await itemService.index()).data
      orders = (await orderService.index()).data
      entries = (await entryService.index()).data

      const csv = json2csv.parse(this.assayList)
      const blob = new Blob([csv], {type: 'text/csv'})
      const csv2 = json2csv2.parse(items)
      const blob2 = new Blob([csv2], {type: 'text/csv'})
      const csv3 = json2csv3.parse(this.vendorList)
      const blob3 = new Blob([csv3], {type: 'text/csv'})
      const csv4 = json2csv4.parse(orders)
      const blob4 = new Blob([csv4], {type: 'text/csv'})
      const csv5 = json2csv5.parse(entries)
      const blob5 = new Blob([csv5], {type: 'text/csv'})

      // const blob0 = new Blob([JSON.stringify(this.assayList[0])], {type: 'text/json'})
      // console.log(assay)
      // console.log(blob0)

      zip.file(`${this.$moment().format('YYYY-MM-DD')} Assay Backup.csv`, blob)
      zip.file(`${this.$moment().format('YYYY-MM-DD')} Item Backup.csv`, blob2)
      zip.file(`${this.$moment().format('YYYY-MM-DD')} Vendor Backup.csv`, blob3)
      zip.file(`${this.$moment().format('YYYY-MM-DD')} Order Backup.csv`, blob4)
      zip.file(`${this.$moment().format('YYYY-MM-DD')} Entry Backup.csv`, blob5)
      // zip.file(`${this.$moment().format('YYYY-MM-DD')} Assay Backup.json`, blob0)

      zip.generateAsync({type: 'blob'})
        .then(content => {
          saveAs(content, `${this.$moment().format('YYYY-MM-DD')} Inventory Backup.zip`)
        })
    },

    time (item) {
      item.lastUpdate = this.$moment(item.updatedAt).format('MMM-DD-YYYY HH:mm:ss')
      return item.lastUpdate
    },

    recentlyUpdated (item) {
      let oneWeekAgo = this.$moment().startOf('week').subtract(7, 'day').toISOString()

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

    searchTerm (term) {
      this.search = term
    },

    checkQuantity (item) {
      return item.currentStock <= item.reorderPoint
    },

    toOrder (item) {
      return this.checkQuantity(item) ? item.reorderQuantity : 0
    },

    editAssay (id) {
      this.currentAssay = this.assayList.find((assay, index) => {
        if (assay.id === id) {
          this.assayIndex = index
          return assay
        }
      })
      this.assayDialog = true
    },

    editVendor (id) {
      this.currentVendor = this.vendorList.find((vendor, index) => {
        if (vendor.id === id) {
          this.vendorIndex = index
          return vendor
        }
      })
      this.vendorDialog = true
    },

    editItem (item) {
      this.currentItem = item
      this.editedIndex = this.supplies.indexOf(item)
      this.itemDialog = true
    }
  }
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
