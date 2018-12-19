<template>
  <v-card v-if="loadComponent">
    <v-card-title>
      <v-dialog
        max-width="500px"
        v-model="completedDialog"
        @keydown.enter="changeStatus"
      >
        <v-card>
          <v-card-title>
            <span v-if="!thisOrder.completed" class="headline">Is the order complete?</span>
            <span v-else class="headline">Undo completed status?</span>
            <v-card-actions>
              <v-spacer/>
              <v-progress-circular indeterminate color="primary" v-if="loading"/>
              <v-btn color="error" @click.native="close">No</v-btn>
              <v-btn color="primary" @click.native="changeStatus">Yes</v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-dialog>

      <v-dialog
        max-width="500px"
        v-model="editEntryDialog"
        @keydown.enter="saveEntry()"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Editing {{editedEntry.name}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs5>
                  <v-text-field
                    clearable
                    label="Stock" type="number"
                    v-model="editedEntry.currentStock"
                  />
                </v-flex>
                <v-flex xs2></v-flex> <!-- spacer -->
                <v-flex xs5>
                  <v-text-field
                    :clearable="admin"
                    label="Order Amount" type="number"
                    v-model="editedEntry.orderAmount"
                    :disabled="!admin"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    label="Comment"
                    clearable no-resize
                    v-model="editedEntry.comment"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="error" @click="closeEditEntry()">Cancel</v-btn>
            <v-btn color="primary" @click="saveEntry()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container>
        <v-layout row wrap>
          <v-btn v-if="!thisOrder.completed && admin" slot="activator" color="primary" class="mb-0" dark small @click="completedDialog = !completedDialog">Complete Order</v-btn>
          <v-btn v-if="thisOrder.completed && admin" slot="activator" color="error" class="mb-0" dark small @click="completedDialog = !completedDialog">Undo Complete</v-btn>

          <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
            <v-icon small class="pr-1">fa-file-download</v-icon>CSV
          </v-btn>

          <v-spacer/>

          <v-text-field
            v-model="search"
            append-icon="fa-search"
            label="Search"
            clearable
            single-line
            hide-details
          />
        </v-layout>
        <!-- completed message -->
        <v-card v-if="thisOrder.completed" class="ma-2">
          <v-card-text>Completed on {{time(thisOrder.completeDate)}}</v-card-text>
        </v-card>
        <!-- render assays and vendors in list -->
        <v-layout row wrap>
          <v-card-text>Vendors in this order:</v-card-text>
          <v-chip v-for="(value, index) in listVendors" :key="index" @click="search = value">
            {{value}}
          </v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-card-text>Assays in this order:</v-card-text>
          <v-chip v-for="(value, index) in listAssays" :key="index" @click="search = value">
            {{value}}
          </v-chip>
        </v-layout>
      </v-container>
    </v-card-title>

    <v-snackbar
        v-model="snackbar"
        :color="snackColor"
        bottom
      >
    <!-- to do: add snack color, icon, etc; see Inactive for hints -->
      <v-flex class="text-xs-center">
        {{snackText}}
      </v-flex>
    </v-snackbar>

    <!-- data table -->
    <v-data-table
      ref="search"
      :headers="headers"
      :items="items"
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="[-1]"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <!-- item name -->
        <td>{{props.item.name}}</td>
        <!-- vendor name -->
        <td>{{props.item.vendor}}</td>
        <!-- assay name -->
        <td>{{props.item.assay}}</td>
        <!-- item catalog -->
        <td>{{props.item.catalogNumber}}</td>
        <!-- item description -->
        <td>{{props.item.itemDescription}}</td>
        <!-- entry current stock -->
        <td class="pointer" @click="editEntry(props.item)">
          <v-tooltip top open-delay=50 :disabled="!checkQuantity(props.item)">
            <v-badge slot="activator" color="orange">
              <span slot="badge" v-if="checkQuantity(props.item)">?</span>
              {{props.item.currentStock}}
            </v-badge>
            <span>Manually ordered</span>
          </v-tooltip>
        </td>
        <!-- entry order amount -->
        <td class="pointer" @click="editEntry(props.item)">{{props.item.orderAmount}}</td>
        <!-- entry comment -->
        <td class="pointer" @click="editEntry(props.item)">{{props.item.comment}}</td>
        <td>{{time(props.item.updatedAt)}}</td>
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
import orderService from '@/services/OrderService.js'
import itemService from '@/services/ItemService.js'
import vendorService from '@/services/VendorService.js'
import assayService from '@/services/AssayService.js'
import entryService from '@/services/EntryService.js'
const Json2csvParser = require('json2csv').Parser

export default {
  data () {
    return {
      pagination: {
        sortBy: 'vendor',
        descending: false
      },
      completedDialog: false,
      editEntryDialog: false,
      loading: false,
      loadComponent: false,
      search: '',
      snackbar: false,
      snackText: '',
      snackColor: 'primary',
      headers: [
        {text: 'Item', value: 'name', width: '15%'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Assay', value: 'assay'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'itemDescription'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'Order Amount', value: 'orderAmount'},
        {text: 'Comment', value: 'comment', width: '15%'},
        {text: 'Last Update', value: 'updatedAt'}
      ],
      thisOrder: {},
      items: [],
      vendors: [],
      assays: [],
      entries: [],
      editedIndex: -1,
      editedEntry: {
        name: '',
        orderedAmount: '',
        currentStock: '',
        comment: ''
      },
      defaultEntry: {
        name: '',
        orderedAmount: '',
        currentStock: '',
        comment: ''
      }
    }
  },

  computed: {
    ...mapState([
      'admin',
      'storedOrder'
    ]),

    listVendors () {
      let arr = []
      this.items.map(item => {
        if (arr.indexOf(item.vendor) === -1) {
          arr.push(item.vendor)
        }
      })

      return arr.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
    },

    listAssays () {
      let arr = []
      this.items.map(item => {
        if (arr.indexOf(item.assay) === -1) {
          arr.push(item.assay)
        }
      })

      return arr.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
    }
  },

  watch: {
    editEntryDialog (val) {
      val || this.closeEditEntry()
    }
  },

  mounted () {
    this.loadComponent = false
    if (this.storedOrder) {
      this.$store.dispatch('setTitle', `Week of ${this.weekOf(this.storedOrder.createdAt)}`)
      this.initialize()
    }

    // go to top
    window.scroll({
      top: 0,
      left: 0
    })
  },

  methods: {
    async initialize () {
      // create independent copy of storedOrder
      let itemIds = null
      // get information
      this.vendors = (await vendorService.index()).data
      this.assays = (await assayService.index()).data
      this.thisOrder = (await orderService.show(this.storedOrder)).data
      this.entries = this.thisOrder.Entries
      itemIds = this.entries.map(x => x.ItemId)
      this.items = (await itemService.show(itemIds)).data
      // merge currentStock and comment from entries to items
      this.items.map(index => {
        this.getVendor(index)
        this.getAssay(index)
        for (let i = 0; i < this.entries.length; i++) {
          let entry = this.entries[i]
          if (index.id === entry.ItemId) {
            index.currentStock = entry.currentStock
            index.comment = entry.comment
            index.orderAmount = entry.orderAmount
            index.updatedAt = entry.updatedAt
          }
        }
      })
      this.loadComponent = true
    },

    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['vendor', 'catalogNumber', 'assay', 'name', 'currentStock', 'reorderQuantity', 'comment', 'updatedAt']
      const json2csv = new Json2csvParser({fields})
      const results = this.$refs.search.filteredItems
      const csv = json2csv.parse(results)
      const blob = new Blob([csv], {type: 'text/csv'})

      csvbtn.href = URL.createObjectURL(blob)
      csvbtn.download = `${this.$moment().format('YYYY-MM-DD')} Inventory.csv`
    },

    time (time) {
      return this.$moment(time).format('MMM-DD-YYYY HH:mm:ss')
    },

    weekOf (time) {
      return this.$moment(time).startOf('week').format('MMM-DD-YYYY')
    },

    getVendor (item) {
      if (this.vendors.length === 0) {
        return null
      }
      item.vendor = this.vendors.find(vendor => vendor.id === item.VendorId).name
      return item.vendor
    },

    getAssay (item) {
      if (this.assays.length === 0) {
        return null
      }
      item.assay = this.assays.find(assay => assay.id === item.AssayId).name
      return item.assay
    },

    checkQuantity (item) {
      return item.currentStock > item.reorderPoint
    },

    openSnack (text) {
      this.snackText = text
      this.snackbar = true
    },

    closeSnack () {
      // to do: functions when snack is closed
      this.snackbar = false
      this.snackColor = 'primary'
    },

    editEntry (entry) {
      if (this.thisOrder.completed) {
        this.closeSnack()
        this.snackColor = 'error'
        this.openSnack('Order closed. Unable to edit.')
      } else {
        this.editedIndex = this.items.indexOf(entry)
        this.editedEntry = Object.assign({}, entry)
        this.editEntryDialog = true
      }
    },

    close () {
      this.completedDialog = false
    },

    closeEditEntry () {
      this.editEntryDialog = false
      setTimeout(() => {
        this.editedEntry = Object.assign({}, this.defaultEntry)
        this.editedIndex = -1
      }, 300)
    },

    async changeStatus () {
      this.loading = true
      if (this.thisOrder.completed) {
        this.thisOrder.completeDate = null
        this.thisOrder.completed = false
      } else {
        this.thisOrder.completeDate = Date.now()
        this.thisOrder.completed = true
      }
      await orderService.put(this.thisOrder)
      this.loading = false
      this.close()
    },

    saveEntry () {

    }
  }
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
