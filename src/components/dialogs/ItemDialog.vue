<template>
  <div>
    <error :response="response"/>
      <!-- snack -->
    <v-snackbar
      v-model="snackbar"
      color="primary"
      bottom
    >
      <v-flex class="text-xs-center">
        {{snackText}}
      </v-flex>
    </v-snackbar>

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
      max-width="500px"
      @keydown.enter="validateData()"
    >
      <dialog-base :formTitle="formTitle">
        <v-form slot="input-fields" ref="form" v-model="form" lazy-validation>
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <v-text-field v-model.trim="editedItem.name" :rules="[rules.name]" label="Item Name" clearable required/>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :items="assayList"
                  label="Assay"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.AssayId"
                  append-icon="fa-plus-square"
                  @click:append="assayDialog = true"
                  :rules="[rules.name]"
                  dense
                  required
                />
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :items="vendorList"
                  label="Vendor"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.VendorId"
                  append-icon="fa-plus-square"
                  @click:append="vendorDialog = true"
                  :rules="[rules.name]"
                  dense
                  required
                />
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.trim="editedItem.catalogNumber" :rules="[rules.catalog]" label="Catalog Number" clearable required/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.trim="editedItem.itemDescription" label="Item Description" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.reactionsPerItem" validate-on-blur :rules="[rules.number]" type="number" min=0 hint="Use 0 for general items." persistent-hint label="Reactions per Item" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.currentStock" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Current Stock" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field disabled v-model="editedItem.safetyStock" label="Safety Stock"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.weeksOfSafetyStock" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Safety Weeks" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.leadTimeDays" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Lead Time (Days)" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.weeksOfReorder" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Reorder Weeks" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.reorderPoint" validate-on-blur :rules="[rules.number]" type="number" min=0 label="Reorder Point" clearable/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedItem.reorderQuantity" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Reorder Quantity" clearable/>
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
          <v-btn flat color="error">Cancel</v-btn>
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
      response: '',
      alert: false,
      alertMessage: '',
      loading: false,
      snackbar: false,
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
        AssayId: '',
        VendorId: '',
        catalogNumber: '',
        itemDescription: '',
        reactionsPerItem: 0,
        currentStock: 0,
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
        this.editedItem = Object.assign(this.editedItem, this.selectedItem)
        this.formTitle = this.index === -1 ? 'New Item' : `Editing ${this.editedItem.name}`
      } else {
        this.close()
      }
    }
  },

  computed: {
    ...mapState([
      'admin',
      'user'
    ]),

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
    openSnack (text) {
      this.snackText = text
      this.snackbar = true
    },

    close () {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.index = -1
        this.currentItem = {}
        this.dialog = false
      }, 300)
    },

    validateData () {
      // checks input entry for numbers
      if (this.$refs.form.validate()) {
        this.alert = false
        this.loading = true
        this.save()
      } else {
        this.alert = true
        this.alertMessage = 'Please fix errors'
      }
    },

    async save () {
      let assayInfo = this.assays.find(assay => assay.id === this.editedItem.AssayId)

      this.editedItem.catalogNumber = this.editedItem.catalogNumber.toUpperCase()
      // scaling to account for weird JS math
      this.editedItem.currentStock = parseInt(this.editedItem.currentStock * 100 + 0.01) / 100

      if (this.index > -1) {
        // existing item
        let focusedItem = this.items[this.index]
        this.editedItem.updatedAt = Date.now()
        this.response = await itemService.put(focusedItem.id, this.editedItem, assayInfo)

        if (this.response.status === 200) {
          Object.assign(focusedItem, this.response.data[0])
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

      if (!this.alert) {
        this.loading = false
        this.openSnack(this.snackText)
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
