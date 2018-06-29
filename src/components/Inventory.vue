<template>
  <v-card>
    <v-card-title>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-btn v-if="admin" slot="activator" color="primary" class="mb-0" dark>New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field v-model="editedItem.name" :rules="[rules.item]" label="Item Name" required/>
                </v-flex>
                <v-flex xs6>
                  <v-select
                    :items="assayList"
                    autocomplete
                    label="Assay"
                    item-text="name"
                    item-value="name"
                    v-model="editedItem.assay"
                    append-icon="note_add"
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
                    append-icon="note_add"
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
                  <v-text-field disabled v-model="editedItem.safetyStock" label="Safety Stock"/>
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
            <v-btn color="red darken-1" disabled flat @click.native="deleteItem(currentItem)" v-if="currentItem != null">Deactivate</v-btn>
            <v-spacer/>
            <v-progress-circular indeterminate color="primary" v-if="loading"/>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
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

      <v-dialog
        v-model="assayDialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{assayForm}}</span>
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
            <v-progress-circular indeterminate color="primary" v-if="loading"/>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveAssay">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="vendorDialog"
        max-width="500px"
      >
        <v-btn v-if="admin" slot="activator" color="primary" class="mb-0" dark @click="editVendor">Edit Vendor</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{vendorForm}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="editedVendor.name" label="Name" :rules="[rules.vendor]" required/>
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
            <v-progress-circular indeterminate color="primary" v-if="loading"/>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveVendor">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="supplies"
      :search="search"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td>{{props.item.vendor}}</td>
        <td @click="editAssay(props.item)">{{props.item.assay}}</td>
        <td>{{props.item.catalogNumber}}</td>
        <td>{{props.item.itemDescription}}</td>
        <td>{{props.item.currentStock}}</td>
        <td>{{props.item.reorderQuantity}}</td>
        <td class="comment" :id=props.item.catalogNumber @click="expand(props.item.catalogNumber)">{{props.item.comment}}</td>
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
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        No results for {{search}}.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
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
      loading: false,
      search: '',
      alertMessage: '',
      assayForm: '',
      vendorForm: '',
      errors: {
        assay: false,
        vendor: false,
        catalog: false,
        item: false,
        num: []
      },
      rules: {
        number: (val) => {
          const num = parseFloat(val)
          // create error object with all number validated refs, check $ref.<refname>.value to see if is num, true if yes, false if no
          if (!isNaN(num) && num >= 0) {
            this.errors.num.pop()
            return true
          } else {
            this.errors.num.push('')
            return 'Please enter a valid number'
          }
        },
        catalog: (text) => {
          if (text.length === 0) {
            this.errors.catalog = true
            return 'Please enter a catalog number'
          } else if (this.supplies.find(item => item.catalogNumber.toUpperCase() === text.toUpperCase()) !== undefined) {
            // fixes error throwing on existing items
            if (this.editedIndex > -1) {
              this.errors.catalog = false
              return true
            } else {
              this.errors.catalog = true
              return 'Duplicate catalog found'
            }
          } else {
            this.errors.catalog = false
            return true
          }
        },
        assay: (text) => {
          if (text.length === 0) {
            this.errors.assay = true
            return 'Please enter a valid name'
          } else {
            this.errors.assay = false
            return true
          }
        },
        vendor: (text) => {
          if (text.length === 0) {
            this.errors.vendor = true
            return 'Please enter a valid name'
          } else {
            this.errors.vendor = false
            return true
          }
        },

        item: (text) => {
          if (text.length === 0) {
            this.errors.item = true
            return 'Please enter a valid name'
          } else {
            this.errors.item = false
            return true
          }
        }
      },
      headers: [
        {text: 'Item', value: 'name', width: '15%'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Assay', value: 'assay'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'itemDescription'},
        {text: 'Stock', value: 'currentStock'},
        {text: 'To Order', value: 'reorderQuantity'},
        {text: 'Comment', value: 'comment', width: '15%'},
        {text: 'Last Update', value: 'lastUpdate'},
        {text: '', value: 'name', sortable: false, width: '5%'}
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
    },
    ...mapState([
      'pageTitle',
      'admin'
    ])
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    assayDialog (val) {
      if (!val) {
        this.alert = false
      }
    },

    vendorDialog (val) {
      if (!val) {
        this.alert = false
      }
    },

    items () {
      // how is this triggering on item udpdate/addition?
      this.supplies = this.items
      this.vendorList = this.vendors
      this.assayList = this.assays
    }
  },

  async mounted () {
    // initialize variables
    // initialize items
    this.supplies = this.items
    this.vendorList = (await vendorService.index(true)).data
    this.assayList = (await assayService.index(true)).data
  },

  methods: {

    time (item) {
      return moment(item.lastUpdate).format('MMM-DD-YYYY HH:mm:ss')
    },

    addAssay () {
      this.assayForm = 'New Assay'
      this.assayDialog = true
    },

    addVendor () {
      this.vendorForm = 'New Vendor'
      this.vendorDialog = true
    },

    expand (catalogNumber) {
      let ele = document.getElementById(catalogNumber)
      let classes = []
      classes = ele.className.split(' ')

      if (classes.includes('expanded')) {
        ele.classList.remove('expanded')
      } else {
        ele.classList.add('expanded')
      }
    },

    editAssay (item) {
      let assays = this.assayList
      this.assayForm = 'Edit Assay'
      for (let i = 0; i < assays.length; i++) {
        if (item.assay === assays[i].name) {
          this.editedAssay = Object.assign({}, assays[i])
          break
        }
      }
      this.assayDialog = true
    },

    editVendor () {
      let vendors = this.vendorList
      this.vendorForm = 'Edit Vendor'
      for (let i = 0; i < vendors.length; i++) {
        if (this.pageTitle === vendors[i].name) {
          this.editedVendor = Object.assign({}, vendors[i])
          break
        }
      }
      this.vendorDialog = true
    },

    editItem (item) {
      this.currentItem = item
      this.editedIndex = this.supplies.indexOf(item)
      this.editedItem = Object.assign(this.editedItem, item)
      this.dialog = true
    },

    async deleteItem (item) {
      const index = this.supplies.indexOf(item)
      if (confirm(`Are you sure you want to deactivate ${item.name}?`)) {
        item.active = false
        await itemService.put(item._id, item, null)
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

    async saveAssay () {
      const num = this.errors.num.length
      this.alertMessage = 'Please fix issues'

      if (this.errors.assay || num) {
        this.alert = true
      } else {
        this.loading = true
        this.alert = false
        if (this.assayForm === 'Edit Assay') {
          // existing assay
          let assayInfo = {}
          let edited = this.editedAssay
          for (let i = 0; i < this.assayList.length; i++) {
            if (this.assayList[i]._id === edited._id) {
              assayInfo = this.assayList[i]
              Object.assign(assayInfo, (await assayService.put(edited, assayInfo.name)).data)
              break
            }
          }
        } else {
          // new assay
          this.assayList.push((await assayService.post(this.editedAssay)).data)
        }
      }

      if (!this.alert) {
        this.loading = false
        this.close()
      }
    },

    async saveVendor () {
      const num = this.errors.num.length
      this.alertMessage = 'Please fix issues'

      if (this.errors.vendor || num) {
        this.alert = true
      } else {
        this.loading = true
        this.alert = false
        if (this.vendorForm === 'Edit Vendor') {
          // existing vendor
          let vendorInfo = {}
          let edited = this.editedVendor
          for (let i = 0; i < this.vendorList.length; i++) {
            if (this.vendorList[i]._id === edited._id) {
              vendorInfo = this.vendorList[i]
              Object.assign(vendorInfo, (await vendorService.put(edited, vendorInfo.name)).data)
              this.$store.dispatch('setTitle', this.vendorList[i].name)
              break
            }
          }
        } else {
          // new vendor
          this.vendorList.push((await vendorService.post(this.editedVendor)).data)
        }
      }

      if (!this.alert) {
        this.loading = false
        this.close()
      }
    },

    async save () {
      const num = this.errors.num.length
      this.alertMessage = 'Please fix issues'

      if (this.errors.item || num) {
        this.alert = true
        console.log(this.errors)
      } else {
        let assayInfo = this.assayList.find(assay => assay.name.toUpperCase() === this.editedItem.assay.toUpperCase())
        this.loading = true
        this.alert = false
        for (let key in this.editedItem) {
          if (typeof this.editedItem[key] === 'string') {
            this.editedItem[key] = this.editedItem[key].trim()
          }
        }
        this.editedItem.catalogNumber = this.editedItem.catalogNumber.toUpperCase()
        this.editedItem.currentStock = parseInt(this.editedItem.currentStock * 100) / 100

        if (this.editedIndex > -1) {
          // existing item
          let focusedItem = this.supplies[this.editedIndex]
          let initalVendor = focusedItem.vendor
          this.editedItem.lastUpdate = Date.now()
          Object.assign(focusedItem, (await itemService.put(focusedItem._id, this.editedItem, assayInfo)).data)
          if (initalVendor !== focusedItem.vendor) {
            this.supplies.splice(this.editedIndex, 1)
          }
        } else {
          // new item
          this.supplies.push((await itemService.post(this.editedItem, assayInfo)).data)
        }
      }

      if (!this.alert) {
        this.loading = false
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
