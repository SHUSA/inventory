<template>
  <v-card flat color="transparent">
    <error :response="response"/>
    <v-container fluid grid-list-md v-if="loadComponent">
      <v-container>
        <v-layout row wrap>
          <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
            <!-- to do: add transition (bouncing) showing download initiating -->
            <v-icon small class="pr-1">fa-file-download</v-icon>
            Inventory CSV
          </v-btn>
          <v-spacer/>
          <v-progress-circular v-if="loading" indeterminate color="primary"/>
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
          <v-menu>
            <v-btn slot="activator" small dark left>
              Items/page: {{itemsPerPage}}
            </v-btn>
            <v-list>
              <v-list-tile
                v-for="(n, index) in [24, 12, 6]"
                :key="index"
                @click="itemsPerPage = n"
              >
                <v-list-tile-title>{{n}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-layout>

        <v-layout row wrap>
          <!-- displays each assay with outstanding orders -->
          <v-card-text>
            Assays not updated since {{lastOrderPeriod}}
            <v-chip disabled small>
              <v-badge color="red" right>
                <span slot="badge">EX</span>
                <span>Example</span>
              </v-badge>
            </v-chip>
          </v-card-text>
          <v-chip
            v-for="(value, index) in outstandingAssays"
            :key="index"
            :color="isSelected(value.name) ? 'blue lighten-2' : ''"
            @click="filter(value.name)"
          >
            <v-badge color="red" right>
              <span v-if="value.count > 0" slot="badge">{{value.count}}</span>
              <span>{{value.name}}</span>
            </v-badge>
          </v-chip>
        </v-layout>

        <v-layout row wrap>
          <v-text-field
            v-model="searchTerm"
            append-icon="fa-search"
            label="Type 2 characters to start searching"
            hint="Search for item, assay, vendor, cat#, or description"
            persistent-hint
            clearable
            single-line
          />
          <v-spacer/>
          <!-- update button -->
          <v-btn :color="dataHasChanged ? 'primary' : ''" small dark @click="checkDataEntry()">Submit All</v-btn>
        </v-layout>
      </v-container>

      <v-dialog
        v-model="warningDialog"
        max-width="800"
        @keydown.esc="warningDialog = false"
        @keydown.delete="warningDialog = false"
        @keydown.enter="save(reviewedItems)"
      >
        <v-card>
          <v-card-title class="title warning font-weight-bold">Overstocked</v-card-title>
          <v-divider/>
          <v-card-text>
            The following items are overstocked. Please confirm the following.
          </v-card-text>
          <!-- data table -->
          <v-data-table
            :headers="headers"
            :items="overstocked"
            hide-actions
            class="elevation-3"
          >
            <template slot="items" slot-scope="props">
              <td>{{props.item.name}}</td>
              <td>{{props.item.currentStock}}</td>
              <td>{{props.item.maxStock}}</td>
            </template>
          </v-data-table>
          <v-divider/>
          <v-card-actions>
            <v-btn slot="activator" color="error" flat @click="warningDialog = false">
              Back
            </v-btn>
            <v-spacer/>
            <v-btn slot="activator" color="primary" flat @click="save(reviewedItems)">
              Accept & Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="resultsDialog"
        max-width="800"
        @keydown.esc="resultsDialog = false"
      >
        <popup title="Save Results">
          <v-container align-justify-center slot="content">
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
        </popup>
      </v-dialog>

      <item-info :item="selectedItem" :dialog.sync="itemInfoDialog"/>
      <assay-info :assay="selectedItem.Assay" :dialog.sync="assayInfoDialog"/>

      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pageLength"/>
      </div>

      <transition-group
        :name="filteredList.length === supplies.length ? 'all-cards' : 'searched-cards'"
        tag="v-layout"
        class="manual-v-layout"
      >
        <v-flex
          xs6 sm4 md3 lg2
          v-for="item in paginatedItems[page - 1]"
          :key="item.id"
        >
          <!-- big card -->
            <v-card :color="item.error ? 'error' : ''">
              <v-card-title class="title py-1">
                <span @click="displayItem(item)" class="pointer">
                  {{item.name}}
                  <!-- to do: add transition (bouncing) -->
                  <v-tooltip top v-if="checkQuantity(item)">
                    <v-icon slot="activator" small color="red" class="pb-1">fa-exclamation-circle</v-icon>
                    <span>Reorder point triggered</span>
                  </v-tooltip>
                </span>
              </v-card-title>
              <v-card-text class="caption pointer py-0" @click="displayAssay(item)">#{{item.catalogNumber}} - {{item.Vendor.name}} - {{item.Assay.name}}</v-card-text>
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
                  <!-- current stock -->
                  <v-text-field
                    @keydown.enter="checkDataEntry(item)"
                    clearable
                    label="Stock"
                    persistent-hint :hint="`Reorder amount: ${item.reorderQuantity} Reorder point: ${item.reorderPoint}`"
                    :value="item.currentStock"
                    v-model="item.currentStock"
                  >
                  </v-text-field>
                  <!-- manual order -->
                  <v-checkbox v-model="item.order" class="py-0" label="Manual Order"/>
                  <!-- comment -->
                  <v-textarea
                    @keydown.enter="checkDataEntry(item)"
                    clearable no-resize
                    rows="4" class="py-0"
                    label="Comment"
                    :value="item.comment"
                    v-model="item.comment"
                  ></v-textarea>
                  <div class="text-xs-center">
                    <v-btn @click="checkDataEntry(item)" color="primary" small>Save Item</v-btn>
                  </div>
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

      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pageLength"/>
      </div>
      <scroll/>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import entryService from '@/services/EntryService.js'
import orderService from '@/services/OrderService.js'
import ItemInfo from '../information/ItemInfo'
import AssayInfo from '../information/AssayInfo'
const Json2csvParser = require('json2csv').Parser
let unsavedData = false

// ask user to save before closing or reloading IF data changed
window.onbeforeunload = () => {
  if (unsavedData) {
    return 'You have unsaved data. Do you want to save?'
  } else {
    return null
  }
}

export default {
  components: {
    ItemInfo,
    AssayInfo
  },

  data () {
    return {
      response: '',
      searchTerm: '',
      page: 1,
      itemsPerPage: 24,
      pageLength: 1,
      suppliesCopy: {},
      supplies: [],
      filteredList: [],
      overstocked: [],
      reviewedItems: [],
      paginatedItems: [],
      selectedItem: {},
      loading: false,
      itemInfoDialog: false,
      assayInfoDialog: false,
      resultsDialog: false,
      warningDialog: false,
      resultsList: {ordered: [], updated: [], retracted: []},
      loadComponent: false,
      headers: [
        {
          text: 'Name',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Current Stock',
          sortable: false,
          value: 'currentStock'
        },
        {
          text: 'Threshold',
          sortable: false,
          value: 'maxStock'
        }
      ],
      alertMessage: '',
      sortType: 'DESC',
      category: {name: 'Name', key: 'name'},
      categories: [
        {name: 'Name', key: 'name'},
        {name: 'Assay', key: 'Assay'},
        {name: 'Vendor', key: 'Vendor'},
        {name: 'Catalog#', key: 'catalogNumber'},
        {name: 'Stock', key: 'currentStock'},
        {name: 'Last Update', key: 'updatedAt'}
      ]
    }
  },

  computed: {
    ...mapState([
      'pageTitle',
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

    dataHasChanged () {
      for (let i = 0; i < this.filteredList.length; i++) {
        let item = this.filteredList[i]
        let initialState = this.suppliesCopy[item.name]
        // to do: fix data change detection
        for (let key in initialState) {
          // ignore id
          if (key === 'id') continue
          // standardize comment comparison
          if (key === 'comment') {
            item[key] = item[key] || ''
          }
          // compare original and current values
          if (initialState[key] === item[key]) {
            unsavedData = false
          } else {
            unsavedData = true
            break
          }
          // checks for item order
          unsavedData = item.order
        }
        // break loop if there is unsaved data
        if (unsavedData) {
          return true
        }
      }
      // all data is same
      return false
    },

    outstandingAssays () {
      return this.$util.outstandingAssays(this)
    }
  },

  watch: {
    // dialogs go here
    category () {
      this.sortItems()
    },

    sortType () {
      this.sortItems()
    },

    itemsPerPage () {
      this.paginate()
    },

    searchTerm (val) {
      if (val !== null) {
        if (val.length > 1) {
          this.termSearch(val.trim())
        } else {
          this.filteredList = this.supplies
        }
      } else {
        this.filteredList = this.supplies
      }
      this.paginate()
    }
  },

  async mounted () {
    // initialize variables
    this.loadComponent = false
    console.log('load items')
    this.response = (await itemService.show(this.storedFilters))

    if (this.response.status === 200) {
      this.supplies = this.response.data
      console.log('success')
      this.filteredList = this.supplies
      this.paginate()

      // go to top
      window.scroll({
        top: 0,
        left: 0
      })
      this.sortItems()
      // create copy of supplies to check if values have been changed
      this.createCopy()
    }
    console.log('items loaded')
    this.loadComponent = true
  },

  beforeDestroy () {
    unsavedData = false
  },

  methods: {
    paginate () {
      const length = this.filteredList.length
      this.paginatedItems = [] // reset
      this.pageLength = Math.ceil(length / this.itemsPerPage)
      if (this.pageLength === 1) {
        this.paginatedItems.push(this.filteredList)
      } else {
        // store items in paginatedItems based on itemsPerPage
        for (let i = 0; i < this.pageLength; i++) {
          // page number
          this.paginatedItems.push([])
          for (let k = i * this.itemsPerPage; k < Math.min((i + 1) * this.itemsPerPage, length); k++) {
            // index in filteredList
            this.paginatedItems[i].push(this.filteredList[k])
          }
        }
      }
      // reset page number to last page if outside pagination bounds
      if (this.page > this.pageLength) {
        this.page = this.pageLength
      }
    },

    createCopy () {
      this.supplies.forEach(item => {
        this.suppliesCopy[item.name] = {}
        this.suppliesCopy[item.name].currentStock = item.currentStock
        this.suppliesCopy[item.name].comment = item.comment || ''
        this.suppliesCopy[item.name].id = item.id
      })
    },

    termSearch (val) {
      // search bar query
      let found = []
      let query = val.toLowerCase()
      found = this.supplies.filter(item => {
        if (item.name.toLowerCase().includes(query) ||
          item.Assay.name.toLowerCase().includes(query) ||
          item.catalogNumber.toLowerCase().includes(query) ||
          item.Vendor.name.toLowerCase().includes(query) ||
          item.itemDescription.toLowerCase().includes(query)
        ) {
          return item
        }
      })

      this.filteredList = found
    },

    filter (name) {
      // button filter
      if (this.isSelected(name)) {
        let keep = []
        // reomve clicked filter
        keep = this.filteredList.filter(item => item.Assay.name !== name)
        if (keep.length === 0) {
          // if keeping nothing, display all items
          this.filteredList = this.supplies
        } else {
          // otherwise display remaining items
          this.filteredList = keep
        }
      } else {
        // find items with matching assay name
        if (this.filteredList.length === this.supplies.length) {
          // if all items are displayed, reset filteredList and assign clicked filter
          this.filteredList = []
          this.filteredList = this.supplies.filter(item => item.Assay.name === name)
        } else {
          // if some items are displayed and filter is not selected, add to filteredList
          this.filteredList = this.filteredList.concat(this.supplies.filter(item => item.Assay.name === name))
        }
      }
      this.paginate()
    },

    isSelected (name) {
      return this.filteredList.find(item => {
        return item.Assay.name === name && this.filteredList.length !== this.supplies.length
      })
    },

    sortItems () {
      let key = this.category.key
      this.loading = true
      if (key === 'currentStock') {
        this.filteredList.sort((a, b) => {
          return this.sortType === 'DESC' ? b[key] - a[key] : a[key] - b[key]
        })
      } else if (key === 'Assay' || key === 'Vendor') {
        this.filteredList.sort((a, b) => a[key].name.localeCompare(b[key].name, 'en', {'sensitivity': 'base'}))
        if (this.sortType === 'ASC') this.filteredList.reverse()
      } else {
        this.filteredList.sort((a, b) => a[key].localeCompare(b[key], 'en', {'sensitivity': 'base'}))
        if (this.sortType === 'ASC') this.filteredList.reverse()
      }
      this.paginate()
      this.loading = false
    },

    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['Vendor.name', 'catalogNumber', 'Assay.name', 'name', 'currentStock', 'lastUpdate']
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

    checkQuantity (item) {
      return item.currentStock <= item.reorderPoint
    },

    orderIsRecent (lastOrder) {
      const lastSunday = this.$moment().startOf('week').toISOString()

      return lastOrder.createdAt < lastSunday || lastOrder.completed
    },

    createEntry (item) {
      return {
        ItemId: item.id,
        updatedAt: item.updatedAt,
        currentStock: item.currentStock,
        orderAmount: item.reorderQuantity,
        comment: item.comment,
        itemName: item.name,
        catalogNumber: item.catalogNumber,
        vendorName: item.Vendor.name,
        assayName: item.Assay.name,
        manualOrder: item.order
      }
    },

    toOrder (item) {
      return this.checkQuantity(item) ? item.reorderQuantity : 0
    },

    getItemName (itemId) {
      let item = this.supplies.find(item => item.id === itemId)
      return item.name
    },

    displayItem (item) {
      this.selectedItem = item
      this.itemInfoDialog = true
    },

    displayAssay (item) {
      this.selectedItem = item
      this.assayInfoDialog = true
    },

    checkDataEntry (item = null) {
      let itemArr = item ? [item] : this.filteredList
      let maxStock = null
      let errorCount = 0
      this.overstocked = []
      itemArr.forEach(item => {
        let num = parseFloat(item.currentStock)
        if (isNaN(num)) {
          item.error = true
          errorCount++
        } else {
          item.currentStock = num
          item.error = false
        }

        maxStock = Math.round((item.reorderPoint + item.reorderQuantity) * 100) / 100

        if (maxStock <= item.currentStock) {
          item.maxStock = maxStock
          this.overstocked.push(item)
        }
      })

      if (errorCount > 0) {
        this.$store.dispatch('setSnack', {
          text: 'Please fix data entry errors',
          color: 'error'
        })
      } else if (this.overstocked.length > 0) {
        this.reviewedItems = itemArr
        this.warningDialog = true
      } else {
        this.save(itemArr)
      }
    },

    async save (items) {
      let result = []
      this.warningDialog = false
      result = (await itemService.put(null, null, null, items)).data
      items.forEach(item => {
        item = Object.assign(item, result.find(res => item.id === res.id))
      })
      this.$store.dispatch('setSnack', {
        text: 'Items saved',
        color: 'success',
        icon: 'fa-boxes'
      })
      this.order(items)
    },

    async order (itemArr) {
      // check through filteredList and see if order exists or if currentStock <= reorderPoint
      // and add to itemsToOrder
      let itemsToOrder = []
      let doNotOrder = []
      let entry = {}
      let matchedEntry = null
      let orderList = (await orderService.index()).data
      // most recent Order or create new Order if none exist
      let lastOrder = orderList.length === 0 ? (await orderService.post()).data : orderList[0]
      this.resultsList = {ordered: [], updated: [], retracted: []}

      // check through filteredList and see if order exists or if currentStock <= reorderPoint
      itemArr.map(item => {
        entry = this.createEntry(item)
        // add to itemsToOrder if reorderPoint triggered or has a manual order and is a user
        if ((item.order || this.checkQuantity(item))) {
          itemsToOrder.push(entry)
        // add to doNotOrder if reorderPoint not triggered and is user
        } else if (!this.checkQuantity(item)) {
          doNotOrder.push(entry)
        }
      })
      // ordering
      if (itemsToOrder.length > 0) {
        if (this.orderIsRecent(lastOrder)) {
          // recent order too old or completed, create new order and associate OrderId
          lastOrder = (await orderService.post()).data
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
        let results = []
        doNotOrder.map(entry => {
          matchedEntry = orderEntries.Entries.find(orderEntry => orderEntry.ItemId === entry.ItemId)
          // add to delete list if entry exists in lastOrder
          if (matchedEntry) {
            toDelete.push(matchedEntry.id)
            this.resultsList.retracted.push(this.getItemName(entry.ItemId))
          }
        })
        if (toDelete.length > 0) {
          results = await entryService.delete(toDelete)
        }
        // if all entries deleted
        if (orderEntries.Entries.length === toDelete.length && results.status === 200) {
          await orderService.delete(orderEntries.id)
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

  /* .submit-btn-enter-active {
    animation: bounce-in .5s;
  }
  .submit-btn-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  } */

  /* doesn't work on data-iterator + cards */
  .all-cards-move, .searched-cards-move {
    transition: transform 1s;
  }
  .all-cards-enter, .all-cards-leave-to, .searched-cards-enter, .searched-cards-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
  .all-cards-leave-active, .searched-cards-leave-active {
    position: absolute;
    transition: all 1s ease;
  }
  .all-cards-enter-active {
    /* position: absolute; */
    transition: all 1s ease;
  }
  .searched-cards-enter-active {
    position: relative;
    transition: all 1s ease;
  }

  .pointer {
    cursor: pointer;
  }
</style>
