<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-btn slot="activator" color="primary" class="mb-0" dark>{{orderButton}}</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{buttonPrompt}}</span>
          <v-card-actions>
            <v-btn color="error" @click.native="close">No</v-btn>
            <v-btn color="primary" @click.native="changeOrder">Yes</v-btn>
          </v-card-actions>
        </v-card-title>
      </v-card>
    </v-dialog>

    <v-data-table
        :headers="headers"
        :items="items"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td>{{props.item.name}}</td>
          <td>{{props.item.vendor}}</td>
          <td>{{props.item.catalogNumber}}</td>
          <td>{{props.item.itemDescription}}</td>
          <td>{{props.item.currentStock}}</td>
          <td>{{props.item.reorderQuantity}}</td>
          <td class="comment" :id=props.item._id @click="expand(props.item._id)">{{props.item.comment}}</td>
          <td>{{time(props.item)}}</td>
        </template>
        <template slot="no-data">
          <v-alert color="error" icon="warning">Nothing here!</v-alert>
        </template>
      </v-data-table>
  </div>
</template>

<script>
import orderService from '@/services/OrderService.js'
const moment = require('moment')

export default {
  props: [
    'order',
    'items'
  ],
  data () {
    return {
      dialog: false,
      completed: false,
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
      supplies: [],
      thisOrder: {}
    }
  },

  watch: {
    items () {
      this.supplies = this.items
      this.thisOrder = this.order
    }
  },

  mounted () {
    // dev workaround
    this.supplies = this.items
    this.thisOrder = this.order
  },

  computed: {
    orderButton: {
      cache: false,
      get () {
        console.log(`order button ${this.thisOrder.completed}`)
        return this.thisOrder.completed ? 'Undo Order' : 'Complete Order'
      }
    },

    buttonPrompt: {
      cache: false,
      get () {
        return this.thisOrder.completed ? 'Undo completed status?' : 'Is the order complete?'
      }
    }
  },

  methods: {
    time (item) {
      return moment(item.updatedAt).format('MMM-DD-YYYY HH:mm:ss')
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
      this.dialog = false
    },

    async changeOrder () {
      this.thisOrder = (await orderService.put(this.thisOrder)).data
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
