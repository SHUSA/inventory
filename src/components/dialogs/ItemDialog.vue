<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    @keydown.enter="save(false)"
  >
    <!-- <v-btn v-if="admin" slot="activator" color="primary" class="mb-0" dark>New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{formTitle}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- admin input -->
            <template v-if="admin">
              <v-flex xs6>
                <v-text-field v-model="editedItem.name" :rules="[rules.item]" label="Item Name" required/>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :items="assayList"
                  label="Assay"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.AssayId"
                  append-icon="fa-plus-circle "
                  @click:append="addAssay"
                  :rules="[rules.assay]"
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
                  append-icon="fa-plus-circle "
                  @click:append="addVendor"
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
                <v-text-field v-model="editedItem.weeksOfSafetyStock" validate-on-blur :rules="[rules.wholeNumber]" ref="safetyStock" type="number" min=0 label="Safety Weeks"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="editedItem.leadTimeDays" validate-on-blur :rules="[rules.wholeNumber]" ref="leadtimeDays" type="number" min=0 label="Lead Time (Days)"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="editedItem.weeksOfReorder" validate-on-blur :rules="[rules.wholeNumber]" ref="weeksOfReorder" type="number" min=0 label="Reorder Weeks"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="editedItem.reorderPoint" validate-on-blur :rules="[rules.number]" ref="reorderPoint" type="number" min=0 label="Reorder Point"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="editedItem.reorderQuantity" validate-on-blur :rules="[rules.wholeNumber]" ref="reorderQuantity" type="number" min=0 label="Reorder Quantity"/>
              </v-flex>
            </template>
            <!-- user input -->
            <template v-if="user">
              <v-flex xs6 fill-height justify-center>
                <v-chip label color="light-blue lighten-1" class="label" small>Reactions per Item</v-chip>
              </v-flex>
              <v-flex class="dashed-border pa-2 text-xs-right" xs6>
                {{editedItem.reactionsPerItem}}
              </v-flex>

              <v-flex xs6 fill-height justify-center>
                <v-chip label color="light-blue lighten-1" class="label" small>Reorder Point</v-chip>
              </v-flex>
              <v-flex class="dashed-border pa-2 text-xs-right" xs6>
                {{editedItem.reorderPoint}}
              </v-flex>

              <v-flex xs6 fill-height justify-center>
                <v-chip label color="light-blue lighten-1" class="label" small>Reorder Quantity</v-chip>
              </v-flex>
              <v-flex class="dashed-border pa-2 text-xs-right" xs6>
                {{editedItem.reorderQuantity}}
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  v-model="editedItem.currentStock"
                  validate-on-blur :rules="[rules.number]"
                  ref="focus"
                  type="number"
                  min=0
                  label="Current Stock"
                  persistent-hint
                />
              </v-flex>
              <v-flex xs12>
                <v-textarea
                v-model="editedItem.comment"
                outline
                no-resize
                counter=140
                validate-on-blur
                :rules="[rules.text]"
                label="Comment"/>
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
        <!-- enable deactivation button once reactivation is complete -->
        <v-btn color="red darken-1" disabled @click.native="deactivationDialog = !deactivationDialog" v-if="currentItem.name && admin">Deactivate</v-btn>
        <v-btn color="orange" small @click.native="save(true)" v-if="user">Manual Order</v-btn>
        <v-spacer/>
        <v-progress-circular indeterminate color="primary" v-if="loading"/>
        <v-btn color="red darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save(false)">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import entryService from '@/services/EntryService.js'
import orderService from '@/services/OrderService.js'
import AssayDialog from './AssayDialog'
import VendorDialog from './VendorDialog'
// Notes on number input type
// -unable to block e, -, +
// -unable to prevent mouse scroll
// -possible vue limitation?
// -look into https://www.npmjs.com/package/@paulpv/vuetify-number-field?activeTab=readme
// in the meantime, treat as text and only allow real and positive numbers to pass through

export default {
  props: [
    'itemList',
    'assayList',
    'vendorList'
  ],

  computed: {
    ...mapState([
      'admin',
      'user',
      'itemDialog',
      'assayDialog',
      'vendorDialog',
      'itemSave',
      'assaySave',
      'vendorSave'
    ])
  },

  components: {
    AssayDialog,
    VendorDialog
  },

  data () {
    return {
      
    }
  }
}
</script>

<style scoped>

</style>
