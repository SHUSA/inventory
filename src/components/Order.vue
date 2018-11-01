<template>
  <v-card>
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

      <v-container>
        <v-layout row wrap>
          <v-btn v-if="!thisOrder.completed && admin" slot="activator" color="primary" class="mb-0" dark small @click="completedDialog = !completedDialog">Complete Order</v-btn>
          <v-btn v-if="thisOrder.completed && admin" slot="activator" color="error" class="mb-0" dark small @click="completedDialog = !completedDialog">Undo Complete</v-btn>

          <v-btn href="javascript:void(0)" id="csvbtn" small dark @click="getCSV">
            <v-icon small>arrow_downward</v-icon>CSV
          </v-btn>
        </v-layout>
      </v-container>

      <v-spacer/>

      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>
    <v-card v-if="thisOrder.completed" class="ma-2">
      <v-card-text>Completed on {{time(thisOrder.completeDate)}}</v-card-text>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="[-1]"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td>{{props.item.vendor}}</td>
        <td>{{props.item.assay}}</td>
        <td>{{props.item.catalogNumber}}</td>
        <td>{{props.item.itemDescription}}</td>
        <td>
          <v-tooltip top open-delay=50>
            <v-badge slot="activator" color="orange">
              <span slot="badge" v-if="checkQuantity(props.item)">?</span>
              {{props.item.currentStock}}
            </v-badge>
            <span>Manually ordered</span>
          </v-tooltip>
        </td>
        <td>{{props.item.reorderQuantity}}</td>
        <td>{{props.item.comment}}</td>
        <td>{{time(props.item.updatedAt)}}</td>
      </template>
      <template slot="no-data">
        <v-alert color="error" icon="warning">Nothing here!</v-alert>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        No results for {{search}}.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import orderService from '@/services/OrderService.js'
import itemService from '@/services/ItemService.js'
const moment = require('moment')
const Json2csvParser = require('json2csv').Parser

export default {
  props: [
    'order',
    'vendors',
    'assays'
  ],
  data () {
    return {
      pagination: {
        sortBy: 'vendor',
        descending: false
      },
      completedDialog: false,
      loading: false,
      completed: false,
      search: '',
      headers: [
        {text: 'Item', value: 'name', width: '15%'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Assay', value: 'assay'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'itemDescription'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'reorderQuantity'},
        {text: 'Comment', value: 'comment', width: '15%'},
        {text: 'Last Update', value: 'updatedAt'}
      ],
      thisOrder: {},
      items: [],
      entries: []
    }
  },

  computed: {
    ...mapState([
      'admin'
    ])
  },

  mounted () {
    this.initialize()
  },

  watch: {
    order () {
      this.initialize()
    }
  },

  methods: {
    async initialize () {
      if (this.order.id) {
        this.thisOrder = this.order
        let itemIds = null
        // get entries
        this.entries = (await orderService.show(this.order.id)).data.Entries
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
            }
          }
        })
      }
    },

    getCSV () {
      const csvbtn = document.getElementById('csvbtn')
      const fields = ['vendor', 'catalogNumber', 'assay', 'name', 'currentStock', 'reorderQuantity', 'comment', 'updatedAt']
      const json2csv = new Json2csvParser({fields})
      // get csv for order; use filtered list if possible
      const csv = json2csv.parse(this.items)
      const blob = new Blob([csv], {type: 'text/csv'})
      console.log(this.items)

      csvbtn.href = URL.createObjectURL(blob)
      csvbtn.download = `${moment().format('YYYY-MM-DD')} Inventory.csv`
    },

    time (time) {
      return moment(time).format('MMM-DD-YYYY HH:mm:ss')
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

    close () {
      this.completedDialog = false
    },

    async changeStatus () {
      this.loading = true
      if (this.thisOrder.completed) {
        this.thisOrder.completeDate = null
      } else {
        this.thisOrder.completeDate = Date.now()
      }
      this.thisOrder.completed = !this.thisOrder.completed
      await orderService.put(this.thisOrder)
      this.loading = false
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
