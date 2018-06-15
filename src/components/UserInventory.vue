<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Update Inventory</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="editedItem.currentStock"
                  type="number"
                  min=0
                  validate-on-blur
                  :rules="[rules.number]"
                  label="Current Stock"/>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="editedItem.comment"
                  textarea
                  no-resize
                  counter=140
                  validate-on-blur
                  :rules="[rules.text]"
                  label="Comment"/>
              </v-flex>
              <v-flex xs12>
                <v-alert
                  :value="alert"
                  type="error"
                >
                  Please fix issues
                </v-alert>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-progress-circular indeterminate color="primary" v-if="loading"/>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
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
      <td>{{props.item.previousStock}}</td>
      <td>{{props.item.currentStock}}</td>
      <td>{{props.item.toOrder}}</td>
      <td class="comment" :id=props.item._id @click="expand(props.item._id)">{{props.item.comment}}</td>
      <td>{{time(props.item)}}</td>
      <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
        </td>
    </template>
  </v-data-table>
  </div>
</template>

<script>
import itemService from '@/services/ItemService.js'
const moment = require('moment')
document.getElementsByTagName('input').onwheel = () => false

export default {
  props: [
    'items',
    'assays'
  ],
  data () {
    return {
      error: [],
      rules: {
        number: (v) => {
          const num = parseFloat(v)
          if (!isNaN(num) && num >= 0) {
            this.error.pop()
            return true
          } else {
            this.error.push('num')
            return 'Please enter a valid number'
          }
        },
        text: (v) => {
          if (v.length <= 140) {
            this.error.pop()
            return true
          } else {
            this.error.push('text')
            return 'Max 140 characters'
          }
        }
      },
      alert: false,
      dialog: false,
      loading: false,
      editedIndex: -1,
      editedItem: {
        currentStock: 0,
        comment: ''
      },
      defaultItem: {
        currentStock: 0,
        comment: ''
      },
      info: {
        title: 'user title'
      },
      headers: [
        {text: 'Item', value: 'name', width: '15%'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'itemDescription'},
        {text: 'Prev Stock', value: 'previousStock'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'toOrder'},
        {text: 'Comment', value: 'comment', width: '15%'},
        {text: 'Last Update', value: 'updatedAt'},
        {text: '', value: 'name', sortable: false}
      ],
      supplies: []
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    items () {
      this.supplies = this.items
      this.supplies.map(x => {
        x.toOrder = 0
        x.order = false
      })
    }
  },

  mounted () {
    // this section mainly for dev
    // limited function in live?
    this.supplies = this.items
    this.supplies.map(x => {
      x.toOrder = 0
      x.order = false
    })
  },

  methods: {
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

    time (item) {
      return moment(item.updatedAt).format('MMM-DD-YYYY HH:mm:ss')
    },

    editItem (item) {
      this.editedIndex = this.supplies.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save () {
      if (this.error.length > 0) {
        this.alert = true
      } else {
        this.alert = false
        let thisItem = this.editedItem
        thisItem.updatedAt = Date.now()
        thisItem.currentStock = parseInt(thisItem.currentStock * 100) / 100
        if (thisItem.currentStock <= thisItem.reorderPoint) {
          thisItem.order = true
          thisItem.toOrder = thisItem.reorderQuantity
        } else {
          thisItem.order = false
          thisItem.toOrder = 0
        }
        thisItem.user = true
        thisItem.comment = thisItem.comment.trim()
        this.loading = true
        Object.assign(this.supplies[this.editedIndex], (await itemService.put(thisItem._id, thisItem, thisItem.assay)).data)
        this.loading = false
        this.close()
      }
    }
  }
}
</script>

<style>
  table {
    table-layout: fixed;
    width: 100%;
  }
  td.comment {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  td.comment.expanded {
    overflow: auto;
    text-overflow: initial;
    white-space: normal;
  }
</style>
