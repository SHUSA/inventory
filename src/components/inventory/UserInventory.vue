<template>
  <v-card>
    <v-container fluid grid-list-xs v-if="loadComponent">
      <v-container>
        <v-layout row wrap>
          <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
            <!-- to do: add transition (bouncing) showing download initiating -->
            <v-icon small class="pr-1">fa-file-download</v-icon>CSV
          </v-btn>
          <v-spacer/>
          <!-- category sort -->
          <v-menu>
            <v-btn slot="activator" small dark left>
              <v-icon class="pr-1">far fa-folder</v-icon>
              Sort By {{category.name}}
            </v-btn>
            <v-list>
              <v-list-tile
                v-for="(item, index) in categories"
                :key="index"
                @click="category = item"
              >
                <v-list-tile-title>{{item.name}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <!-- ASC - DESC sort -->
          <v-menu>
            <v-btn slot="activator" small dark left @click="sortType = sortType === 'DESC' ? 'ASC' : 'DESC'">
              <v-icon>{{sortIcon}}</v-icon>
              <v-icon class="pl-1">fa-sort</v-icon>
            </v-btn>
          </v-menu>
        </v-layout>

        <v-layout row wrap>
          <!-- displays each assay with outstanding orders -->
          <!-- to do: decide how to display; from button? on screen? search on button press? -->
          <v-card-text>
            Assays not updated since {{lastOrderPeriod}} will look like so
            <v-chip small>
              <v-badge color="red" right>
                <span slot="badge">EX</span>
                <span>Example</span>
              </v-badge>
            </v-chip>
          </v-card-text>
          <v-chip v-for="(value, index) in outstandingAssays" :key="index">
            <v-badge color="red" right>
              <span v-if="value.count > 0" slot="badge">{{value.count}}</span>
              <span>{{value.name}}</span>
            </v-badge>
          </v-chip>
        </v-layout>

        <v-layout row wrap>
          <v-spacer/>
          <!-- update button -->
          <!-- to do: decide button placement -->
          <v-btn small dark @click="saveAll()">Submit Changes</v-btn>
        </v-layout>
      </v-container>

      <v-snackbar
        v-model="snackbar"
        color="primary"
        bottom
      >
      <!-- to do: add snack color, icon, etc; see Inactive for hints -->
        <v-flex class="text-xs-center">
          {{snackText}}
        </v-flex>
      </v-snackbar>

      <v-dialog
        v-model="resultsDialog"
        max-width="800"
      >
        <v-card>
          <v-card-title class="title blue lighten-2 font-weight-bold">Save Results</v-card-title>
          <v-divider/>
          <v-container align-justify-center>
            <v-layout row wrap>
              <v-flex xs4>
                <v-list dense>
                  <v-list-tile-title class="subheading"><u>Ordered Items</u></v-list-tile-title>
                  <template v-if="resultsList.ordered.length > 0">
                    <v-list-tile v-for="item in resultsList.ordered" :key="item">
                      <v-icon small color="success" class="pr-1">fa-check</v-icon>
                      {{item}}
                    </v-list-tile>
                  </template>
                  <v-list-tile v-else>None</v-list-tile>
                </v-list>
              </v-flex>
              <v-flex xs4>
                <v-list dense>
                  <v-list-tile-title class="subheading"><u>Updated Orders</u></v-list-tile-title>
                  <template v-if="resultsList.updated.length > 0">
                    <v-list-tile v-for="item in resultsList.updated" :key="item">
                      <v-icon small color="info" class="pr-1">fa-check</v-icon>
                      {{item}}
                    </v-list-tile>
                  </template>
                  <v-list-tile v-else>None</v-list-tile>
                </v-list>
              </v-flex>
              <v-flex xs4>
                <v-list dense>
                  <v-list-tile-title class="subheading"><u>Retracted Orders</u></v-list-tile-title>
                  <template v-if="resultsList.retracted.length > 0">
                    <v-list-tile v-for="item in resultsList.retracted" :key="item">
                      <v-icon small color="error" class="pr-1">fa-check</v-icon>
                      {{item}}
                    </v-list-tile>
                  </template>
                  <v-list-tile v-else>None</v-list-tile>
                </v-list>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>

      <transition-group name="sort-card" tag="v-layout" class="manual-v-layout">
        <v-flex
          xs6 sm4 md3 lg2
          v-for="item in filteredList"
          :key="item.id"
        >
          <!-- big card -->
            <v-card>
              <v-card-title class="title py-1">
                  {{item.name}}
                  <!-- to do: add transition (bouncing) -->
                  <v-icon small color="red" v-if="checkQuantity(item)">fa-exclamation-circle</v-icon>
              </v-card-title>
              <v-card-text class="caption py-0">{{item.catalogNumber}} - {{getVendor(item)}} - {{getAssay(item)}}</v-card-text>
              <v-divider/>
              <v-card-text v-if="item.itemDescription" class="py-1">
                <v-icon small>fa-info-circle</v-icon>
                {{item.itemDescription}}
              </v-card-text>
              <v-card-text class="py-1" v-else>
                <v-icon small>fa-times</v-icon>
                No description
              </v-card-text>
              <v-divider/>
              <v-container class="py-0">
                <v-form>
                  <v-text-field label="Stock" type="number"
                    persistent-hint :hint="`Reorder amount: ${item.reorderQuantity} Reorder point: ${item.reorderPoint}`"
                    :value="item.currentStock"
                    v-model="item.currentStock"
                  >
                  </v-text-field>
                  <v-checkbox v-model="item.order" class="py-0" label="Manual Order"/>
                  <v-textarea
                    clearable no-resize
                    rows="4" class="py-0"
                    label="Comment"
                    :value="item.comment"
                    v-model="item.comment"
                  ></v-textarea>
                </v-form>
              </v-container>
              <v-divider/>
              <v-footer class="caption" color="white">
                <v-flex text-xs-center>
                  Last Updated: {{time(item)}}
                </v-flex>
              </v-footer>
            </v-card>
        </v-flex>
      </transition-group>
      <scroll/>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import entryService from '@/services/EntryService.js'
import orderService from '@/services/OrderService.js'
const Json2csvParser = require('json2csv').Parser

// to do: ask user to save before closing or reloading IF data changed
// window.onbeforeunload = () => {
//   return 'Do you really want to leave our brilliant application?'
// }

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
      filteredList: [],
      loading: false,
      resultsDialog: false,
      resultsList: {ordered: [], updated: [], retracted: []},
      loadComponent: false,
      snackbar: false,
      snackText: '',
      search: '',
      alertMessage: '',
      sortType: 'DESC',
      category: {name: 'Name', key: 'name'},
      categories: [
        {name: 'Name', key: 'name'},
        {name: 'Assay', key: 'assay'},
        {name: 'Vendor', key: 'vendor'},
        {name: 'Catalog#', key: 'catalogNumber'},
        {name: 'Stock', key: 'currentStock'},
        {name: 'Last Update', key: 'updatedAt'}
      ],
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

    sortIcon () {
      if (this.category.key === 'currentStock' || this.category.key === 'lastUpdate') {
        return this.sortType === 'DESC' ? 'fa-sort-numeric-up' : 'fa-sort-numeric-down'
      } else {
        return this.sortType === 'DESC' ? 'fa-sort-alpha-down' : 'fa-sort-alpha-up'
      }
    },

    outstandingAssays () {
      let obj = {}
      // fix coding; clunky
      // to do: refactor to object
      this.supplies.map(item => {
        this.recentlyUpdated(item)
        this.getAssay(item)
        // check if assay object is attached and make sure it's not a duplicate
        if (item.assay) {
          let assay = item.assay
          // count number of outstanding assays with same assay name
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
        arr.push({
          name: key,
          count: obj[key].count,
          recentlyUpdated: obj[key].recentlyUpdated
        })
      })

      return arr.sort((a, b) => a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'}))
    }
  },

  watch: {
    // dialogs go here
    category () {
      this.sortItems()
    },

    sortType () {
      this.sortItems()
    }
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
    this.sortItems()
    this.loadComponent = true
  },

  methods: {
    sortItems () {
      let key = this.category.key
      if (key === 'currentStock') {
        this.supplies.sort((a, b) => {
          return this.sortType === 'DESC' ? b[key] - a[key] : a[key] - b[key]
        })
      } else if (key === 'assay') {
        this.supplies.sort((a, b) => a[key].name.localeCompare(b[key].name, 'en', {'sensitivity': 'base'}))
        if (this.sortType === 'ASC') this.supplies.reverse()
      } else {
        this.supplies.sort((a, b) => a[key].localeCompare(b[key], 'en', {'sensitivity': 'base'}))
        if (this.sortType === 'ASC') this.supplies.reverse()
      }

      this.filteredList = this.supplies
    },

    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['vendor', 'catalogNumber', 'assay.name', 'name', 'currentStock', 'lastUpdate']
      const json2csv = new Json2csvParser({fields})
      const csv = json2csv.parse(this.filteredList)
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

    orderIsRecent (lastOrder) {
      const lastSunday = this.$moment().startOf('week').format()

      return lastOrder.createdAt < lastSunday || lastOrder.completed
    },

    createEntry (item) {
      return {
        ItemId: item.id,
        updatedAt: item.updatedAt,
        currentStock: item.currentStock,
        orderQuantity: item.currentStock + item.reorderQuantity,
        comment: item.comment
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

    closeSnack () {
      // to do: functions when snack is closed
    },

    getItemName (itemId) {
      let item = this.supplies.find(item => item.id === itemId)
      return item.name
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
    },

    async saveAll () {
      await itemService.put(null, null, null, this.filteredList)
      this.openSnack('Items Saved')
      // to do: pop up dialog of items ordered
      this.order()
    },

    async order () {
      // check through filteredList and see if order exists or if currentStock <= reorderPoint
      // and add to itemsToOrder
      let itemsToOrder = []
      let doNotOrder = []
      let entry = {}
      let matchedEntry = null
      // most recent Order or create new Order if none exist
      let lastOrder = this.orderList.length === 0 ? (await orderService.post()).data : this.orderList[0]
      this.resultsList = {ordered: [], updated: [], retracted: []}

      // check through filteredList and see if order exists or if currentStock <= reorderPoint
      this.filteredList.map(item => {
        entry = this.createEntry(item)
        // add to itemsToOrder if reorderPoint triggered or has a manual order and is a user
        if ((item.order || this.checkQuantity(item)) && this.user) {
          itemsToOrder.push(entry)
        // add to doNotOrder if reorderPoint not triggered and is user
        } else if (!this.checkQuantity(item) && this.user) {
          doNotOrder.push(entry)
        }
      })

      // ordering
      if (itemsToOrder.length > 0) {
        if (this.orderIsRecent(lastOrder)) {
          // recent order too old or completed, create new order and associate OrderId
          lastOrder = (await orderService.post()).data
          this.orderList.splice(0, 0, lastOrder)
          itemsToOrder.map(entry => {
            entry.OrderId = lastOrder.id
          })
          await entryService.post(itemsToOrder)
          this.resultsList.ordered = itemsToOrder.map(entry => this.getItemName(entry.ItemId))
        } else {
          // add current OrderId to entry
          const orderEntries = (await orderService.show(lastOrder.id)).data
          let orderedItems = itemsToOrder.map(entry => {
            matchedEntry = orderEntries.Entries.find(orderEntry => orderEntry.ItemId === entry.ItemId)
            if (matchedEntry === undefined) {
              // ItemId not in Order Entries
              entry.OrderId = lastOrder.id
              this.resultsList.ordered.push(this.getItemName(entry.ItemId))
            } else {
              // ItemId in Order Entries
              entry = Object.assign(matchedEntry, entry)
              this.resultsList.updated.push(this.getItemName(entry.ItemId))
            }
            return entry
          })
          await entryService.put(orderedItems)
        }
      }

      // retracting
      // do not run if order is NOT recent
      if (doNotOrder.length > 0 && !this.orderIsRecent(lastOrder)) {
        const orderEntries = (await orderService.show(lastOrder.id)).data
        let toDelete = []
        doNotOrder.map(entry => {
          matchedEntry = orderEntries.Entries.find(orderEntry => orderEntry.ItemId === entry.ItemId)
          // add to delete list if entry exists in lastOrder
          if (matchedEntry) {
            toDelete.push(matchedEntry.id)
            this.resultsList.retracted.push(this.getItemName(entry.ItemId))
          }
        })
        let results = await entryService.delete(toDelete)
        // if all entries deleted
        if (orderEntries.Entries.length === toDelete.length && results.status === 200) {
          await orderService.delete(orderEntries.id)
          this.orderList.splice(0, 1)
        }
      }
      // display results if order is recent
      if (!this.orderIsRecent(lastOrder)) {
        this.resultsDialog = true
      }
    }
  }
}
</script>

<style scoped>
  /* doesn't work on data-iterator + cards */
  .sort-card-move {
    transition: transform 1s;
  }

  .manual-v-layout {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    padding-bottom: 8px !important;
    padding-top: 8px !important;
  }

  /* .sort-card-item {
    transition: all 3s;
    display: inline-block;
    margin-right: 10px;
  }
  .sort-card-enter, .sort-card-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
  .sort-card-leave-active {
    position: absolute;
  } */
</style>
