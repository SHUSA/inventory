<template>
  <v-card>
    <v-card-title>
      <v-dialog
        v-model="completedDialog"
        max-width="500px"
        @keydown.enter="changeStatus"
      >
        <v-btn v-if="!thisOrder.completed && admin" slot="activator" color="primary" class="mb-0" dark>Complete Order</v-btn>
        <v-btn v-if="thisOrder.completed && admin" slot="activator" color="error" class="mb-0" dark>Undo Complete</v-btn>
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
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td>{{getVendor(props.item)}}</td>
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

export default {
  props: [
    'order',
    'vendors'
  ],
  data () {
    return {
      completedDialog: false,
      loading: false,
      completed: false,
      search: '',
      headers: [
        {text: 'Item', value: 'name', width: '15%'},
        {text: 'Vendor', value: 'vendor'},
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
