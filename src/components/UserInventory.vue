<template>
  <panel :info="info">
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
                    :rules="[rules.number]"
                    label="Current Stock"/>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="editedItem.comment"
                    textarea
                    no-resize
                    counter=140
                    :rules="[rules.comment]"
                    label="Comment"/>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-data-table
      :headers="headers"
      :items="supplies"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td>{{props.item.vendor}}</td>
        <td>{{props.item.catalogNumber}}</td>
        <td>{{props.item.description}}</td>
        <td>{{props.item.previousStock}}</td>
        <td>{{props.item.currentStock}}</td>
        <td>{{props.item.toOrder}}</td>
        <td>{{props.item.comment}}</td>
        <td>{{props.item.lastUpdate}}</td>
        <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
          </td>
      </template>
    </v-data-table>
    </div>

  </panel>
</template>

<script>
const moment = require('moment')

export default {
  data () {
    return {
      rules: {
        number: (v) => {
          return !isNaN(parseFloat(v)) || 'Please enter a number'
        },
        text: (v) => {
          return v < 140 || 'Max 140 characters'
        }
      },
      dialog: false,
      editedIndex: -1,
      editedItem: {
        currentStock: 0,
        comment: 'd'
      },
      defaultItem: {
        currentStock: 0,
        comment: 'd'
      },
      info: {
        title: 'user title'
      },
      headers: [
        {text: 'Item', value: 'name'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'description'},
        {text: 'Prev Stock', value: 'previousStock'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'toOrder'},
        {text: 'Comment', value: 'comment'},
        {text: 'Last Update', value: 'lastUpdate'}
      ],
      supplies: [
        {
          value: false,
          name: 'name',
          vendor: 'vendor',
          catalogNumber: '0123456789',
          description: '9999 cases',
          previousStock: 999999,
          currentStock: 0,
          toOrder: 1,
          comment: 'enter your comment in this field for further clarification',
          lastUpdate: moment().format('MMM-DD-YYYY HH:mm:ss')
        }
      ]
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  methods: {
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

    save () {
      if (this.editedIndex > -1) {
        this.editedItem.lastUpdate = moment().format('MMM-DD-YYYY HH:mm:ss')
        this.editedItem.currentStock = parseInt(this.editedItem.currentStock * 100) / 100
        Object.assign(this.supplies[this.editedIndex], this.editedItem)
      } else {
        this.supplies.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
