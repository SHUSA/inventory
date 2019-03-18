<template>
  <v-card v-if="loadComponent">
    <v-card-title>
      <!-- complete order -->
      <v-dialog
        max-width="500px"
        v-model="completedDialog"
        @keydown.enter="changeStatus"
        @keydown.esc="completedDialog = false"
      >
        <popup :title="completedTitle" titleStyle="info">
          <span slot="content">
            <v-card-text>
              <p>Completing the order will close out any edits to the order including adding new items, removing items, and editing existing items.</p>
              <p>An order can be unlocked at a later date if any edits need to be made.
                Items however cannot be removed or added if the order form is older than the current Sunday week.</p>
              <p v-if="!thisOrder.completed">Deleting an order will remove the entire order form from view.
                Please only do this if an order form has been accidentally made.
                Alternatively, delete all items from the order form if you wish for this action to be permanent.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="!thisOrder.completed" color="error" small @click="deleteOrderDialog = true">Delete Order</v-btn>
              <v-spacer/>
              <v-progress-circular indeterminate color="primary" v-if="loading"/>
              <v-btn color="error" flat @click.native="close">No</v-btn>
              <v-btn color="primary" flat @click.native="changeStatus">Yes</v-btn>
            </v-card-actions>
          </span>
        </popup>
      </v-dialog>

      <!-- to do: add checklist, open inventory in another tab -->

      <!-- edit entry -->
      <v-dialog
        max-width="500px"
        v-model="editEntryDialog"
        @keydown.esc="editEntryDialog = false"
        @keydown.enter="saveEntry(editedEntry)"
      >
        <popup :title="`Editing ${currentItem.itemName}`">
          <span slot="content">
            <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs5>
                    <v-text-field
                      ref="currentStock"
                      clearable
                      label="Stock" type="number"
                      v-model="editedEntry.currentStock"
                      validate-on-blur
                      :rules="[rules.number]"
                    />
                  </v-flex>
                  <v-flex xs2></v-flex> <!-- spacer -->
                  <v-flex xs5>
                    <v-text-field
                      ref="orderAmount"
                      :clearable="user.isAdmin || user.isSubAdmin"
                      label="Order Amount" type="number"
                      v-model="editedEntry.orderAmount"
                      :disabled="!user.isAdmin || !user.isSubAdmin"
                      validate-on-blur
                      :rules="[rules.number]"
                    />
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea
                      label="Comment"
                      clearable no-resize
                      v-model="editedEntry.comment"
                    />
                  </v-flex>
                  <v-flex xs12>
                  <v-alert
                    :value="alert"
                    :type="alertType"
                  >
                    {{alertMessage}}
                  </v-alert>
                </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="user.isAdmin || user.isSubAdmin" color="error" @click="deactivationDialog = true" small>Delete</v-btn>
              <v-spacer/>
              <v-progress-circular indeterminate color="primary" v-if="loading"/>
              <v-btn color="error" flat @click="closeEditEntry()">Cancel</v-btn>
              <v-btn color="primary" flat @click="saveEntry(editedEntry)">Save</v-btn>
            </v-card-actions>
          </span>
        </popup>
      </v-dialog>

      <!-- entry deactivation -->
      <v-dialog
        v-model="deactivationDialog"
        max-width="500px"
        @keydown.esc="deactivationDialog = false"
      >
        <popup :title="`Delete ${currentItem.itemName} from the order?`">
          <v-card-actions slot="content">
            <v-spacer/>
            <v-btn color="blue darken-1" flat @click="deactivationDialog = false">No</v-btn>
            <v-btn color="red darken-1" flat @click="deleteEntry(currentItem)">Yes</v-btn>
          </v-card-actions>
        </popup>
      </v-dialog>

      <!-- order deactivation -->
      <v-dialog
        v-model="deleteOrderDialog"
        max-width="500px"
        @keydown.esc="deleteOrderDialog = false"
      >
        <popup title="Delete the current order form?">
          <span slot="content">
            <v-container>
              <v-layout>
                <v-flex xs12>
                  <v-alert
                    :value="alert"
                    :type="alertType"
                  >
                    {{alertMessage}}
                  </v-alert>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="blue darken-1" flat @click="deleteOrderDialog = false">No</v-btn>
              <v-btn color="red darken-1" flat @click="deleteOrder()">Yes</v-btn>
            </v-card-actions>
          </span>
        </popup>
      </v-dialog>

      <v-container>
        <!-- control area -->
        <v-layout row wrap>
          <v-btn v-if="!thisOrder.completed && user.isAdmin || user.isSubAdmin" slot="activator" color="primary" class="mb-0" dark small @click="completedDialog = !completedDialog">Complete Order</v-btn>
          <v-btn v-if="thisOrder.completed && user.isAdmin || user.isSubAdmin" slot="activator" color="error" class="mb-0" dark small @click="completedDialog = !completedDialog">Undo Complete</v-btn>

          <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
            <v-icon small class="pr-1">fa-file-download</v-icon>
            Order CSV
          </v-btn>

          <v-btn v-if="user.isAdmin || user.isSubAdmin"
            dark small
            to="/inventory/admin"
            target="_blank"
          >
            Open Inventory
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

    <!-- data table -->
    <v-data-table
      ref="search"
      :headers="headers"
      :items="entries"
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="[-1]"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <!-- item name -->
        <td>{{props.item.itemName}}</td>
        <!-- vendor name -->
        <td>{{props.item.vendorName}}</td>
        <!-- assay name -->
        <td>{{props.item.assayName}}</td>
        <!-- item catalog -->
        <td>{{props.item.catalogNumber}}</td>
        <!-- entry current stock -->
        <td class="pointer" @click="editEntry(props.item)">
          <v-tooltip top open-delay=50 :disabled="!props.item.manualOrder">
            <v-badge slot="activator" color="orange">
              <span slot="badge" v-if="props.item.manualOrder">?</span>
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
import entryService from '@/services/EntryService.js'
const Json2csvParser = require('json2csv').Parser

export default {
  data () {
    return {
      pagination: {
        sortBy: 'vendor',
        descending: false
      },
      currentItem: {},
      errors: {},
      deactivationDialog: false,
      completedDialog: false,
      editEntryDialog: false,
      deleteOrderDialog: false,
      loading: false,
      loadComponent: false,
      search: '',
      alert: false,
      alertType: 'info',
      alertMessage: '',
      rules: {
        number: (val) => {
          let currentStock = this.$refs.currentStock
          let orderAmount = this.$refs.orderAmount
          const num = parseFloat(val)
          // check if input is valid
          if (currentStock && orderAmount) { // beforeMount check; console errors out otherwise
            if (!isNaN(num) && num >= 0) {
              // valid input
              this.errors.currentStock = currentStock.value === val ? false : this.errors.currentStock
              this.errors.orderAmount = orderAmount.value === val ? false : this.errors.orderAmount
              return true
            } else {
              // invalid input
              this.errors.currentStock = currentStock.value === val ? true : this.errors.currentStock
              this.errors.orderAmount = orderAmount.value === val ? true : this.errors.orderAmount
              return 'Please enter a valid number'
            }
          } else {
            return true
          }
        }
      },
      headers: [
        {text: 'Item', value: 'itemName', width: '15%'},
        {text: 'Vendor', value: 'vendorName'},
        {text: 'Assay', value: 'assayName'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'Order Amount', value: 'orderAmount'},
        {text: 'Comment', value: 'comment', width: '15%'},
        {text: 'Last Update', value: 'updatedAt'}
      ],
      thisOrder: {},
      vendors: [],
      assays: [],
      entries: [],
      editedIndex: -1,
      editedEntry: {
        name: '',
        orderAmount: 0,
        currentStock: 0,
        comment: ''
      },
      defaultEntry: {
        name: '',
        orderAmount: 0,
        currentStock: 0,
        comment: ''
      }
    }
  },

  computed: {
    ...mapState([
      'user',
      'storedOrder'
    ]),

    listVendors () {
      let arr = []
      this.entries.map(entry => {
        if (arr.indexOf(entry.vendorName) === -1) {
          arr.push(entry.vendorName)
        }
      })

      return arr.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
    },

    listAssays () {
      let arr = []
      this.entries.map(entry => {
        if (arr.indexOf(entry.assayName) === -1) {
          arr.push(entry.assayName)
        }
      })

      return arr.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
    },

    completedTitle () {
      return this.thisOrder.completed ? 'Undo closing the order?' : 'Close out the order?'
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
      // get information
      this.thisOrder = (await orderService.show(this.storedOrder)).data
      this.entries = this.thisOrder.Entries
      this.$store.dispatch('setTitle', `Week of ${this.weekOf(this.thisOrder.createdAt)}`)
      this.loadComponent = true
    },

    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['vendorName', 'catalogNumber', 'assayName', 'itemName', 'currentStock', 'reorderQuantity', 'comment', 'updatedAt']
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

    checkErrorMessage (resp) {
      if (resp.status !== 200) {
        // stop process and display error message
        this.loading = false
        this.alertType = 'error'
        this.alert = true
        this.alertMessage = Array.isArray(resp.data) ? resp.data[0].message : resp.statusText
        return true
      } else {
        // no errors received
        return false
      }
    },

    isOrderComplete (order) {
      if (order.completed) {
        this.$store.dispatch('setSnack', {
          text: 'Order closed. Unable to edit.',
          color: 'error'
        })
        return true
      } else {
        return false
      }
    },

    editEntry (entry) {
      // continue only if order is not complete
      if (!this.isOrderComplete(this.thisOrder)) {
        this.editedIndex = this.entries.indexOf(entry)
        this.editedEntry = Object.assign({}, entry)
        this.currentItem = entry
        this.editEntryDialog = true
      }
    },

    close () {
      this.completedDialog = false
    },

    closeEditEntry () {
      this.editEntryDialog = false
      this.alert = false
      this.errors = {}
      setTimeout(() => {
        this.editedEntry = Object.assign({}, this.defaultEntry)
        this.currentItem = {}
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

    async saveEntry (entry) {
      let response = null
      if (this.errors.currentStock || this.errors.orderAmount) {
        this.alertMessage = 'Please fix the issues above'
        this.alert = true
      } else {
        this.alert = false
        // update entry
        response = await (entryService.put([entry]))
        if (!this.checkErrorMessage(response)) {
          // update item comment and table data
          Object.assign(this.entries[this.editedIndex], response.data[0])
          response = await (itemService.put(entry.ItemId, {currentStock: entry.currentStock, comment: entry.comment}))
          if (!this.checkErrorMessage(response)) {
            // close procedure
            this.loading = true
            this.$store.dispatch('setSnack', {
              text: `${this.currentItem.itemName} updated`,
              color: 'success',
              icon: 'fa-clipboard-list'
            })
            this.loading = false
            this.closeEditEntry()
          }
        }
      }
    },

    async deleteEntry (entry) {
      // continue only if order is not complete
      if (!this.isOrderComplete(this.thisOrder)) {
        let response = null
        this.loading = true
        response = await entryService.delete([entry.id])
        if (!this.checkErrorMessage(response)) {
          // close procedure if no error message
          this.entries.splice(this.editedIndex, 1)
          // check if items is empty and delete Order if it is and exit to Order Index
          if (this.entries.length === 0) {
            await orderService.delete(this.thisOrder.id)
            this.$router.push({name: 'orders'})
          }
          this.$store.dispatch('setSnack', {
            text: `${this.currentItem.itemName} deleted`,
            color: 'error',
            icon: 'fa-times'
          })
          this.loading = false
          this.deactivationDialog = false
          this.closeEditEntry()
        }
      }
    },

    async deleteOrder () {
      let response = null
      let entries = []
      this.loading = true
      // prepare order and existing entries to be set to inactive
      this.thisOrder.active = false
      this.entries.forEach(entry => {
        entry.active = false
        entries.push(entry)
      })
      response = await orderService.put(this.thisOrder)
      if (!this.checkErrorMessage(response)) {
        // continue if no errors
        response = await entryService.put(entries)
        if (!this.checkErrorMessage(response)) {
          // close out order form and redirect to index
          this.$store.dispatch('setSnack', {
            text: 'Order has been removed. Redirecting momentarily'
          })
          this.deleteOrderDialog = false
          this.close()
          setTimeout(() => {
            this.$router.push({name: 'orders'})
          }, 3000)
        }
      }
    }
  }
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
