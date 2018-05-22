<template>
  <panel :info="info">
    <div>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-btn slot="activator" color="primary" class="mb-0" dark>New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.name" label="Item Name"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.assay" label="Assay"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.catalogNumber" label="Catalog Number"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.description" label="Item Description"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.reactionsPerItem" validate-on-blur :rules="[rules.number]" ref="reactions" type="number" min=0 label="Reactions per Item"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.currentStock" validate-on-blur :rules="[rules.number]" ref="stock" type="number" min=0 label="Current Stock"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field disabled label="Safety Stock" value="999"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.safetyWeeks" validate-on-blur :rules="[rules.number]" ref="safety" type="number" min=0 label="Safety Weeks"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.leadTimeDays" validate-on-blur :rules="[rules.number]" ref="leadtime" type="number" min=0 label="Lead Time (Days)"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.reorderWeeks" validate-on-blur :rules="[rules.number]" ref="reorder" type="number" min=0 label="Reorder Weeks"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field disabled label="Reorder Point" value="999"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field disabled label="Reorder Quantity" value="999"/>
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
            <v-btn color="red darken-1" flat @click.native="deleteItem(currentItem)" v-if="currentItem != null">Delete</v-btn>
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
          <td>{{props.item.assay}}</td>
          <td>{{props.item.catalogNumber}}</td>
          <td>{{props.item.description}}</td>
          <td>{{props.item.currentStock}}</td>
          <td>{{props.item.toOrder}}</td>
          <td>{{props.item.comment}}</td>
          <td>{{props.item.lastUpdate}}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">info</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="initialize">Reset</v-btn>
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
      currentItem: null,
      dialog: false,
      alert: false,
      error: [],
      rules: {
        number: (v) => {
          const num = parseFloat(v)
          if (!isNaN(num) && num >= 0) {
            this.error.pop()
            return true
          } else {
            this.error.push('')
            return 'Please enter a valid number'
          }
        },
        text: (v) => {
          return v.length < 140 || 'Max 140 characters'
        }
      },
      info: {
        title: 'admin title'
      },
      headers: [
        {text: 'Item', value: 'name'},
        {text: 'Assay', value: 'assay'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'description'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'toOrder'},
        {text: 'Comment', value: 'comment'},
        {text: 'Last Update', value: 'lastUpdate'},
        {text: '', value: 'name', sortable: false}
      ],
      supplies: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        assay: '',
        vendor: '',
        catalogNumber: 12345,
        description: '',
        reactionsPerItem: 0,
        currentStock: 0,
        safetyWeeks: 0,
        leadTimeDays: 0,
        reorderWeeks: 0
      },
      defaultItem: {
        name: '',
        assay: '',
        vendor: '',
        catalogNumber: 12345,
        description: '',
        reactionsPerItem: 0,
        currentStock: 0,
        safetyWeeks: 0,
        leadTimeDays: 0,
        reorderWeeks: 0
      }
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.supplies = [
        {
          name: 'name',
          assay: 'assay',
          vendor: 'vendor',
          catalogNumber: '0123456789',
          description: '9999 cases',
          reactionsPerItem: 0,
          currentStock: 0,
          toOrder: 1,
          safetyWeeks: 0,
          leadTimeDays: 0,
          reorderWeeks: 0,
          comment: 'enter your comment in this field for further clarification',
          lastUpdate: moment().format('MMM-DD-YYYY HH:mm:ss')
        },
        {
          name: 'name2',
          assay: 'assay',
          vendor: 'vendor',
          catalogNumber: '0123456789',
          description: '9999 cases',
          reactionsPerItem: 0,
          currentStock: 0,
          toOrder: 1,
          safetyWeeks: 0,
          leadTimeDays: 0,
          reorderWeeks: 0,
          comment: 'enter your comment in this field for further clarification',
          lastUpdate: moment().format('MMM-DD-YYYY HH:mm:ss')
        },
        {
          name: 'name3',
          assay: 'assay',
          vendor: 'vendor',
          catalogNumber: '0123456789',
          description: '9999 cases',
          reactionsPerItem: 0,
          currentStock: 0,
          toOrder: 1,
          safetyWeeks: 0,
          leadTimeDays: 0,
          reorderWeeks: 0,
          comment: 'enter your comment in this field for further clarification',
          lastUpdate: moment().format('MMM-DD-YYYY HH:mm:ss')
        }
      ]
    },

    editItem (item) {
      this.currentItem = item
      this.editedIndex = this.supplies.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.supplies.indexOf(item)
      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        this.supplies.splice(index, 1)
        this.dialog = false
      }
      this.currentItem = null
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      // console.log(this.error)
      if (this.error.length > 0) {
        this.alert = true
      } else {
        this.alert = false
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
}
</script>

<style scoped>

</style>
