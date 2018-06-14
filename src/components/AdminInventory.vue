<template>
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
                  <v-text-field v-model="editedItem.name" label="Item Name" required/>
                </v-flex>
                <v-flex xs6>
                  <v-select
                    :items="assayList"
                    autocomplete
                    label="Assay"
                    item-text="name"
                    item-value="name"
                    v-model="editedItem.assay"
                    :append-icon="'note_add'"
                    :append-icon-cb="addAssay"
                    :rules="[rules.assay]"
                    dense
                    required
                  />
                </v-flex>
                <v-flex xs6>
                  <v-select
                    :items="vendorList"
                    autocomplete
                    label="Vendor"
                    item-text="name"
                    item-value="name"
                    v-model="editedItem.vendor"
                    :append-icon="'note_add'"
                    :append-icon-cb="addVendor"
                    :rules="[rules.vendor]"
                    dense
                    required
                  />
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.catalogNumber" :rules="[rules.catalog]" label="Catalog Number" required/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.itemDescription" label="Item Description"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.reactionsPerItem" validate-on-blur :rules="[rules.number]" ref="reactionsPerItem" type="number" min=0 hint="Use 0 for general items." persistent-hint label="Reactions per Item"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.currentStock" validate-on-blur :rules="[rules.number]" ref="currentStock" type="number" min=0 label="Current Stock"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field disabled label="Safety Stock" value="999"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.weeksOfSafetyStock" validate-on-blur :rules="[rules.number]" ref="safetyStock" type="number" min=0 label="Safety Weeks"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.leadTimeDays" validate-on-blur :rules="[rules.number]" ref="leadtimeDays" type="number" min=0 label="Lead Time (Days)"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.weeksOfReorder" validate-on-blur :rules="[rules.number]" ref="weeksOfReorder" type="number" min=0 label="Reorder Weeks"/>
                </v-flex>
                  <v-flex xs6>
                    <v-text-field v-model="editedItem.reorderPoint" ref="reorderPoint" label="Reorder Point"/>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field v-model="editedItem.reorderQuantity" ref="reorderQuantity" label="Reorder Quantity"/>
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
                  <v-text-field v-model="editedAssay.name" :rules="[rules.assay]" label="Name" required/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.weeklyVolume" ref="weeklyVolume" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Weekly Volume"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.weeklyRuns" ref="weeklyRuns" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Runs per Week"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.controlsPerRun" ref="controlsPerRun" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Controls per Run"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.maxBatchSize" ref="maxBatchSize" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Max Batch Size"/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field v-model="editedAssay.sampleReplicates" ref="sampleReplicates" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Sample Replicates"/>
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

      <v-dialog
        v-model="vendorDialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">New Vendor</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="editedVendor.name" label="Name" required/>
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
        :items="items"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td>{{props.item.name}}</td>
          <td>{{props.item.assay}}</td>
          <td>{{props.item.catalogNumber}}</td>
          <td>{{props.item.itemDescription}}</td>
          <td>{{props.item.currentStock}}</td>
          <td>{{props.item.reorderQuantity}}</td>
          <td class="comment" :id=props.item._id @click="expand(props.item._id)">{{props.item.comment}}</td>
          <td>{{time(props.item)}}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">info</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-alert color="error" icon="warning">Nothing here!</v-alert>
        </template>
      </v-data-table>
    </div>
</template>

<script>
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
const moment = require('moment')
document.getElementsByTagName('input').onwheel = () => false
// Notes on number input type
// -unable to block e, -, +
// -unable to prevent mouse scroll
// -possible vue limitation?
// -look into https://www.npmjs.com/package/@paulpv/vuetify-number-field?activeTab=readme
// in the meantime, treat as text and only allow real and positive numbers to pass through

export default {
  props: [
    'items',
    'vendors',
    'assays'
  ],
  data () {
    return {
      currentItem: null,
      dialog: false,
      assayDialog: false,
      vendorDialog: false,
      alert: false,
      alertMessage: '',
      errors: [],
      rules: {
        number: (val) => {
          const num = parseFloat(val)
          // create error object with all number validated refs, check $ref.<refname>.value to see if is num, true if yes, false if no
          if (!isNaN(num) && num >= 0) {
            this.errors.pop()
            console.log('pop')
            return true
          } else {
            this.errors.push('')
            console.log('push')
            return 'Please enter a valid number'
          }
        },
        catalog: (text) => {
          const errMessage = 'catErr'
          const err = this.errors
          if (text === '') {
            err.indexOf(errMessage) === -1 ? err.push(errMessage) : console.log()
            return 'Please enter a catalog number'
          } else if (this.supplies.find(item => item.catalogNumber.toLowerCase() === text.toLowerCase()) !== undefined) {
            if (this.editedIndex > -1) {
              err.splice(err.indexOf(errMessage), 1)
              return true
            } else {
              err.indexOf(errMessage) === -1 ? err.push(errMessage) : console.log()
              return 'Duplicate catalog found'
            }
          } else {
            err.splice(err.indexOf(errMessage), 1)
            return true
          }
        },
        assay: (text) => {
          const errMessage = 'assayErr'
          const err = this.errors
          if (text.length === 0) {
            this.editedAssay.name = text
            err.indexOf(errMessage) === -1 ? err.push(errMessage) : console.log()
            return 'Please enter a valid assay'
          } else {
            err.splice(err.indexOf(errMessage), 1)
            return true
          }
        },
        vendor: (text) => {
          const errMessage = 'vendorErr'
          const err = this.errors
          if (text.length === 0) {
            this.editedVendor.name = text
            err.indexOf(errMessage) === -1 ? err.push(errMessage) : console.log()
            return 'Please enter a valid assay'
          } else {
            err.splice(err.indexOf(errMessage), 1)
            return true
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
        {text: 'Desc', value: 'itemDescription'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'reorderQuantity'},
        {text: 'Comment', value: 'comment'},
        {text: 'Last Update', value: 'updatedAt'},
        {text: '', value: 'name', sortable: false}
      ],
      supplies: [],
      assayList: [],
      vendorList: [],
      editedAssay: {
        name: '',
        weeklyVolume: 0,
        weeklyRuns: 0,
        controlsPerRun: 0,
        maxBatchSize: 0,
        sampleReplicates: 0
      },
      editedVendor: {
        name: ''
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

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    items () {
      this.supplies = this.items
      this.vendorList = this.vendors
      this.assayList = this.assays
    }
  },

  mounted () {
    // dev workaround
    this.supplies = this.items
    this.vendorList = this.vendors
    this.assayList = this.assays
  },

  methods: {

    time (item) {
      return moment(item.updatedAt).format('MMM-DD-YYYY HH:mm:ss')
    },

    addAssay () {
      this.assayDialog = true
    },

    addVendor () {
      this.vendorDialog = true
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
      } else if (this.vendorDialog) {
        this.vendorDialog = false
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
      } else if (this.vendorDialog) {
        this.vendors.push((await vendorService.post(this.editedVendor)).data)
      } else {
        console.log(this.editedItem.assay)
        let assayInfo = this.assays.find(assay => assay.name.toLowerCase() === this.editedItem.assay.toLowerCase())

        if (this.errors.length > 0) {
          this.alert = true
          this.alertMessage = 'Please fix issues'
        } else {
          this.alert = false
          if (this.editedIndex > -1) {
            // existing item
            let focusedItem = this.supplies[this.editedIndex]
            this.editedItem.updatedAt = Date.now()
            this.editedItem.currentStock = parseInt(this.editedItem.currentStock * 100) / 100
            Object.assign(focusedItem, (await itemService.put(focusedItem._id, this.editedItem, assayInfo)).data)
          } else {
            // new item
            this.supplies.push((await itemService.post(this.editedItem, assayInfo)).data)
          }
        }
      }

      if (!this.alert) {
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
