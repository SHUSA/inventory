<template>
  <v-card>
    <v-card-title>
      <v-dialog
        v-model="completedDialog"
        max-width="500px"
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
        <td>{{props.item.currentStock}}</td>
        <td>{{props.item.reorderQuantity}}</td>
        <td class="comment" :id=props.item.catalogNumber @click="expand(props.item.catalogNumber)">{{props.item.comment}}</td>
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

  async mounted () {
    // initial mount
    this.thisOrder = this.order
    let itemIds = null
    // get entries
    this.entries = (await orderService.show(this.order.id)).data.Entries
    itemIds = this.entries.map(x => x.ItemId)
    this.items = (await itemService.show(itemIds)).data
  },

  watch: {
    async order () {
      this.thisOrder = this.order
      let itemIds = null
      // get entries
      this.entries = (await orderService.show(this.order.id)).data.Entries
      itemIds = this.entries.map(x => x.ItemId)
      this.items = (await itemService.show(itemIds)).data
    }
  },

  methods: {
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

    expand (id) {
      let ele = document.getElementById(id)
      let classes = []
      classes = ele.className.split(' ')

      if (classes.includes('expanded')) {
        ele.classList.remove('expanded')
      } else {
        ele.classList.add('expanded')
      }
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
