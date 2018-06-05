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
                  <v-text-field v-model="editedItem.assay" :rules="[rules.assay]" :append-icon="newAssay ? 'note_add' : null" :append-icon-cb="addAssay" label="Assay"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.catalogNumber" label="Catalog Number"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.itemDescription" label="Item Description"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.reactionsPerItem" validate-on-blur :rules="[rules.number]" type="number" min=0 hint="Use 0 for general items." persistent-hint label="Reactions per Item"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.currentStock" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Current Stock"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field disabled label="Safety Stock" value="999"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.weeksOfSafetyStock" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Safety Weeks"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.leadTimeDays" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Lead Time (Days)"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.weeksOfReorder" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Reorder Weeks"/>
                </v-flex>
                <template v-if="editedItem.reactionsPerItem = 0">
                  <v-flex xs6>
                    <v-text-field disabled label="Reorder Point" value="999"/>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field disabled label="Reorder Quantity" value="999"/>
                  </v-flex>
                </template>
                <template v-else>
                  <v-flex xs6>
                    <v-text-field v-model="editedItem.reorderPoint" label="Reorder Point" value="999"/>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field v-model="editedItem.reorderQuantity" label="Reorder Quantity" value="999"/>
                  </v-flex>
                </template>
                <v-flex xs12>
                  <v-alert
                    :value="alert"
                    type="error"
                  >
                    {{alertMessage}}
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

      <v-dialog
        v-model="assayDialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">New Assay</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.name" label="Name"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.weeklyVolume" :rules="[rules.number]" type="number" min=0 label="Weekly Volume"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.weeklyRuns" :rules="[rules.number]" type="number" min=0 label="Runs per Week"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.controlsPerRun" :rules="[rules.number]" type="number" min=0 label="Controls per Run"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.maxBatchSize" :rules="[rules.number]" type="number" min=0 label="Max Batch Size"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.sampleReplicates" :rules="[rules.number]" type="number" min=0 label="Sample Replicates"/>
                </v-flex>
                <v-flex xs12>
                  <v-alert
                    :value="alert"
                    type="error"
                  >
                    {{alertMessage}}
                  </v-alert>
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
          <td>{{props.item.assay}}</td>
          <td>{{props.item.catalogNumber}}</td>
          <td>{{props.item.itemDescription}}</td>
          <td>{{props.item.currentStock[props.item.currentStock.length - 1]}}</td>
          <td>{{props.item.toOrder}}</td>
          <td class="comment" id="comment" @click="expand">{{props.item.comment}}</td>
          <td>{{props.item.updatedAt}}</td>
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
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
const moment = require('moment')
document.getElementsByTagName('input').onwheel = () => false

export default {
  data () {
    return {
      currentItem: null,
      dialog: false,
      assayDialog: false,
      newAssay: false,
      alert: false,
      alertMessage: '',
      error: [],
      rules: {
        number: (val) => {
          const num = parseFloat(val)
          if (!isNaN(num) && num >= 0) {
            this.error.pop()
            return true
          } else {
            this.error.push('')
            return 'Please enter a valid number'
          }
        },
        assay: (text) => {
          if (this.assays.find(assay => assay.name.toLowerCase() === text.toLowerCase()) !== undefined) {
            this.error.pop()
            this.newAssay = false
            return true
          } else {
            this.newAssay = true
            this.editedAssay.name = text
            this.error.push('')
            return 'Please enter a valid assay'
          }
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
        {text: 'Last Update', value: 'updatedAt'},
        {text: '', value: 'name', sortable: false}
      ],
      supplies: [],
      assays: [],
      editedAssay: {
        name: '',
        weeklyVolume: 0,
        weeklyRuns: 0,
        controlsPerRun: 0,
        maxBatchSize: 0,
        sampleReplicates: 0
      },
      editedIndex: -1,
      editedItem: {
        name: '',
        assay: '',
        vendor: '',
        catalogNumber: '',
        itemDescription: '',
        reactionsPerItem: 0,
        currentStock: 0,
        weeksOfSafetyStock: 2,
        leadTimeDays: 7,
        weeksOfReorder: 8,
        reorderPoint: 0,
        reorderQuantity: 0
      },
      defaultItem: {
        name: '',
        assay: '',
        vendor: '',
        catalogNumber: '',
        itemDescription: '',
        reactionsPerItem: 0,
        currentStock: 0,
        weeksOfSafetyStock: 2,
        leadTimeDays: 7,
        weeksOfReorder: 8,
        reorderPoint: 0,
        reorderQuantity: 0
      }
    }
  },

  async mounted () {
    this.supplies = (await itemService.index()).data
    this.assays = (await assayService.index()).data
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
      this.supplies = []
    },

    addAssay () {
      this.assayDialog = !this.assayDialog
    },

    expand () {
      // figure out how to do dynamic IDs
      // may add as action button
      let ele = document.getElementById('comment')
      let classes = []

      classes = ele.className.split(' ')

      if (classes.includes('expanded')) {
        ele.classList.remove('expanded')
      } else {
        ele.classList.add('expanded')
      }
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
      if (this.assayDialog) {
        this.assayDialog = false
      } else {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      }
    },

    async save () {
      if (this.assayDialog) {
        this.assays.push((await assayService.post(this.editedAssay)).data)
      } else {
        let assayInfo = this.assays.find(assay => assay.name === this.editedItem.assay)

        if (this.error.length > 0) {
          this.alert = true
          this.alertMessage = 'Please fix issues'
        } else {
          this.alert = false
          if (this.editedIndex > -1) {
            let focusedItem = this.supplies[this.editedIndex]
            this.editedItem.updatedAt = moment().format('MMM-DD-YYYY HH:mm:ss')
            this.editedItem.currentStock = parseInt(this.editedItem.currentStock * 100) / 100
            Object.assign(focusedItem, (await itemService.put(focusedItem._id, this.editedItem, assayInfo)).data)
          } else {
            // check if assay exists, if not then create before continuing
            this.supplies.push(this.editedItem)
          }
        }
      }
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
