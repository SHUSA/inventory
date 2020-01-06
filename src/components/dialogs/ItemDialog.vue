<template>
  <div>
    <error :response="response"/>

    <assay-dialog
      :assayDialog.sync="assayDialog"
      :itemList.sync="itemList"
      :assayList.sync="assayList"
      :assayNameList.sync="assayNameList"
      :editedItem.sync="editedItem"
    />

    <vendor-dialog
      :vendorDialog.sync="vendorDialog"
      :vendorList.sync="vendorList"
      :vendorNameList.sync="vendorNameList"
      :editedItem.sync="editedItem"
    />

    <!-- dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
      @keydown.enter="validateData()"
      @keydown.esc="close()"
    >
      <dialog-base :formTitle="formTitle" :dataInfo.sync="currentItem">
        <v-form slot="input-fields" ref="form" v-model="form" lazy-validation>
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <v-text-field
                  v-model.trim="editedItem.name"
                  :rules="[rules.name]"
                  clearable required
                >
                  <template slot="label">
                    <v-icon small>fa-syringe</v-icon> Item Name
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :items="assayList"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.AssayId"
                  append-icon="fa-plus-square"
                  @click:append="assayDialog = true"
                  :rules="[rules.name]"
                  dense required
                >
                  <template slot="label">
                    <v-icon small>fa-dna</v-icon> Assay
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :items="vendorList"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.VendorId"
                  append-icon="fa-plus-square"
                  @click:append="vendorDialog = true"
                  :rules="[rules.name]"
                  dense required
                >
                  <template slot="label">
                    <v-icon small>fa-store</v-icon> Vendor
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.trim="editedItem.catalogNumber"
                  :rules="[rules.catalog]"
                  clearable required
                >
                  <template slot="label">
                    <v-icon small>fa-hashtag</v-icon> Catalog Number
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.trim="editedItem.itemDescription"
                  clearable
                >
                  <template slot="label">
                    <v-icon small>fa-sticky-note</v-icon> Item Description
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-menu
                  :close-on-content-click="false"
                  ref="dateDialog"
                  v-model="dateDialog"
                  :return-value.sync="editedItem.expirationDate"
                >
                  <template slot="activator">
                    <v-text-field
                      v-model="editedItem.expirationDate"
                      readonly
                      clearable
                    >
                      <template slot="label">
                        <v-icon small>fa-calendar-day</v-icon> Expiration Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="editedItem.expirationDate" scrollable>
                    <v-spacer/>
                    <v-btn text color="error" @click="dateDialog = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dateDialog.save(editedItem.expirationDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.reactionsPerItem"
                  validate-on-blur :rules="[rules.number]"
                  type="number" min=0 hint="Use 0 for general items."
                  persistent-hint
                  clearable
                >
                  <template slot="label">
                    <v-icon small>fa-vial</v-icon> Reactions per Item
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.currentStock"
                  validate-on-blur
                  :rules="[rules.number]"
                  type="number" min=0
                  clearable
                >
                  <template slot="label">
                    <v-icon small>{{stockIcon}}</v-icon> Current Stock
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  disabled
                  v-model="editedItem.safetyStock"
                >
                  <template slot="label">
                    <v-icon small>{{stockIcon}}</v-icon> Safety Stock
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.baseWeeks"
                  validate-on-blur :rules="[rules.number]"
                  type="number" min=0 clearable
                >
                  <template slot="label">
                    <v-icon small>{{weekIcon}}</v-icon> Base Stock Weeks
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.weeksOfSafetyStock"
                  validate-on-blur :rules="[rules.number]"
                  type="number" min=0
                  clearable
                >
                  <template slot="label">
                    <v-icon small>{{weekIcon}}</v-icon> Safety Weeks
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.leadTimeDays"
                  validate-on-blur
                  :rules="[rules.number]"
                  type="number" min=0
                  clearable
                >
                  <template slot="label">
                    <v-icon small>fa-clock</v-icon> Lead Time (Days)
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.weeksOfReorder"
                  validate-on-blur :rules="[rules.number]"
                  type="number" min=0
                  clearable
                >
                  <template slot="label">
                    <v-icon small>{{weekIcon}}</v-icon> Reorder Weeks
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.reorderPoint"
                  validate-on-blur
                  :rules="[rules.number]"
                  type="number" min=0
                  clearable
                >
                  <template slot="label">
                    <v-icon small>fa-less-than-equal</v-icon> Reorder Point
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model.number="editedItem.reorderQuantity"
                  validate-on-blur :rules="[rules.wholeNumber]"
                  type="number" min=0
                  clearable
                >
                  <template slot="label">
                    <v-icon small>fa-shopping-cart</v-icon> Reorder Quantity
                  </template>
                </v-text-field>
              </v-flex>
              <!-- alert -->
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
        </v-form>
        <!-- actions -->
        <template slot="buttons">
          <v-progress-circular indeterminate color="primary" v-if="loading"/>
          <v-btn flat color="error" @click="close()">Cancel</v-btn>
          <v-btn flat color="primary" @click="validateData()">Save</v-btn>
        </template>
      </dialog-base>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import AssayDialog from './AssayDialog'
import VendorDialog from './VendorDialog'
import Deactivation from './Deactivation'
import DialogBase from './DialogBase'

export default {
  props: [
    'itemDialog',
    'selectedItem',
    'catalogNumbers',
    'assayNameList',
    'vendorNameList',
    'itemList',
    'assayList',
    'vendorList',
    'editedIndex'
  ],

  components: {
    AssayDialog,
    VendorDialog,
    DialogBase,
    Deactivation
  },

  data () {
    return {
      form: true,
      assayDialog: false,
      vendorDialog: false,
      deactivationDialog: false,
      dateDialog: false,
      response: '',
      alert: false,
      alertMessage: '',
      loading: false,
      snackText: '',
      formTitle: 'New Item',
      rules: {
        number: (val) => {
          return val !== null && val >= 0 ? true : 'Please enter a valid number'
        },
        wholeNumber: (val) => {
          return val !== null && val >= 0 && Number.isInteger(val) ? true : 'Please enter an integer'
        },
        catalog: (text) => {
          if (text.length === 0) {
            return 'Please enter a unique catalog number'
          } else if (this.catalogs.includes(text.toUpperCase())) {
            // fixes error throwing on existing items
            if (this.index > -1) {
              return true
            } else {
              return 'Duplicate catalog found'
            }
          } else {
            return true
          }
        },
        name: (text) => {
          return text.length > 0 ? true : 'Please enter a valid name'
        }

      },
      editedItem: {
        name: '',
        AssayId: '',
        VendorId: '',
        catalogNumber: '',
        itemDescription: '',
        expirationDate: '',
        reactionsPerItem: 0,
        currentStock: 0,
        baseWeeks: 4,
        weeksOfSafetyStock: 2,
        leadTimeDays: 7,
        weeksOfReorder: 8,
        reorderPoint: 0,
        reorderQuantity: 0
      },
      defaultItem: {
        name: '',
        AssayId: '',
        VendorId: '',
        catalogNumber: '',
        itemDescription: '',
        expirationDate: '',
        reactionsPerItem: 0,
        currentStock: 0,
        baseWeeks: 4,
        weeksOfSafetyStock: 2,
        leadTimeDays: 7,
        weeksOfReorder: 6,
        reorderPoint: 0,
        reorderQuantity: 0
      }
    }
  },

  watch: {
    dialog (val) {
      if (val) {
        this.editedItem = Object.assign(this.editedItem, this.currentItem)
        if (this.editedIndex === -1) {
          this.editedItem = Object.assign(this.editedItem, this.user.itemDefaults)
        }
        this.formTitle = this.index === -1 ? 'New Item' : `Editing ${this.editedItem.name}`
      } else {
        this.close()
      }
    }
  },

  computed: {
    ...mapState([
      'user'
    ]),

    stockIcon () {
      return 'fa-cube'
    },

    weekIcon () {
      return 'fa-calendar-week'
    },

    dialog: {
      get () {
        return this.itemDialog
      },

      set (value) {
        this.$emit('update:itemDialog', value)
      }
    },

    currentItem: {
      get () {
        return this.selectedItem
      },

      set (value) {
        this.$emit('update:selectedItem', value)
      }
    },

    index: {
      get () {
        return this.editedIndex
      },

      set (value) {
        this.$emit('update:editedIndex', value)
      }
    },

    catalogs: {
      get () {
        return this.catalogNumbers
      },

      set (value) {
        this.$emit('update:catalogNumbers', value)
      }
    },

    assayNames: {
      get () {
        return this.assayNameList
      },

      set (value) {
        this.$emit('update:assayNameList', value)
      }
    },

    vendorNames: {
      get () {
        return this.vendorNameList
      },

      set (value) {
        this.$emit('update:vendorNameList', value)
      }
    },

    items: {
      get () {
        return this.itemList
      },

      set (value) {
        this.$emit('update:itemList', value)
      }
    },

    assays: {
      get () {
        return this.assayList
      },

      set (value) {
        this.$emit('update:assayList', value)
      }
    },

    vendors: {
      get () {
        return this.vendorList
      },

      set (value) {
        this.$emit('update:vendorList', value)
      }
    }
  },

  methods: {
    close () {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        // this.index = -1
        // this.currentItem = {}
        this.loading = false
        this.dialog = false
      }, 300)
    },

    validateData () {
      this.$validate.form(this)
    },

    async save () {
      let assayInfo = this.assays.find(assay => assay.id === this.editedItem.AssayId)

      // scaling to account for weird JS math
      this.editedItem.currentStock = parseInt(this.editedItem.currentStock * 100 + 0.01) / 100

      if (this.index > -1) {
        // existing item
        this.editedItem.updatedAt = Date.now()
        // update active state if changed
        if (this.currentItem.active !== this.editedItem.active) {
          this.editedItem.active = this.currentItem.active
        }
        this.response = await itemService.put(this.currentItem.id, this.editedItem, assayInfo)

        if (this.response.status === 200) {
          Object.assign(this.items[this.index], this.response.data[0])
          if (this.currentItem.catalogNumber !== this.editedItem.catalogNumber) {
            let index = this.catalogs.indexOf(this.editedItem.catalogNumber)
            this.catalogs[index] = this.currentItem.catalogNumber
          }
          this.snackText = `${this.response.data[0].name} updated`
        }
      } else {
        // new item
        this.response = await itemService.post(this.editedItem, assayInfo)

        if (this.response.status === 200) {
          this.items.push(this.response.data)
          this.catalogs.push(this.response.data.catalogNumber)
          this.snackText = `${this.response.data.name} saved`
        }
      }

      if (!this.alert && this.response.status === 200) {
        this.loading = false
        this.$store.dispatch('setSnack', {
          text: this.snackText,
          color: 'success',
          icon: 'fa-syringe'
        })
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
