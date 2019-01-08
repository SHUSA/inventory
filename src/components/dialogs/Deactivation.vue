<template>
  <div>
    <!-- main deactivation dialog -->
    <v-dialog
      v-model="deactivationDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="title blue lighten-2 font-weight-bold">
          Selected "{{selectedItem.name}}"
        </v-card-title>
        <v-card-text class="subheading">
          <p v-if="!isItem() && selectedItem.hasItem">
            <v-chip disabled color="orange lighten-2" text-color="black" small label>Reassign</v-chip>
            Items can be assigned a different {{isAssay() ? 'Assay' : 'Vendor'}}.
          </p>
          <p>
            <v-chip disabled color="red lighten-2" text-color="black" small label>Deactivate</v-chip>
            <span v-if="!isItem()">Any items associated with an assay or vendor will also be deactivated.</span>
            <span v-else>Selected item will be deactivated.</span>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!isItem() && selectedItem.hasItem" color="orange darken-1" flat @click="reassignDialog = true">
            Reassign {{isAssay() ? 'Assay' : 'Vendor'}}
          </v-btn>
          <v-spacer/>
          <v-btn color="red darken-1" flat @click="deactivate(selectedItem)">Deactivate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- results dialog -->
    <v-dialog
      v-model="resultsDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="title blue lighten-2 font-weight-bold">
          Results
        </v-card-title>
        <v-card-text class="subheading">
          <p>{{selectedItem.name}} {{reassignDialog ? `reassigned to ${reassignInfo.name}` : 'deactivated'}}</p>
          <p v-if="!isItem()">{{numItems}} items {{reassignDialog ? 'reassigned' : 'deactivated'}}</p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- reassign dialog -->
    <v-dialog
      v-model="reassignDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="title blue lighten-2 font-weight-bold">
          Reassign items with {{selectedItem.name}} to ...?
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            :items="isAssay() ? assays : vendors"
            :label="isAssay() ? 'Assay' : 'Vendor'"
            item-text="name"
            return-object
            v-model="temp"
            clearable
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="red darken-1" flat @click="reassignDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="reassign(selectedItem)">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'

export default {
  props: [
    'selection',
    'dialog',
    'assays',
    'vendors',
    'reassigned'
  ],

  data () {
    return {
      resultsDialog: false,
      reassignDialog: false,
      loading: false,
      temp: {},
      numItems: 0
    }
  },

  watch: {
    resultsDialog (val) {
      if (!val) {
        this.deactivationDialog = false
        this.reassignDialog = false
      }
    },

    reassignDialog (val) {
      if (!val) {
        this.reassignedId = ''
      }
    }
  },

  computed: {
    ...mapState([
      'admin',
      'user'
    ]),

    deactivationDialog: {
      get () {
        return this.dialog
      },
      set (value) {
        if (!value) {
          // requires :dialog.sync="variable" in parent
          this.$emit('update:dialog', false)
        }
      }
    },

    selectedItem: {
      get () {
        return this.selection
      },
      set (value) {
        this.$emit('update:selection', value)
      }
    },

    reassignInfo: {
      get () {
        return this.reassigned
      },
      set (value) {
        this.$emit('update:reassigned', value)
      }
    }
  },

  methods: {
    isItem () {
      return this.selectedItem.hasOwnProperty('catalogNumber')
    },

    isAssay () {
      return this.selectedItem.hasOwnProperty('weeklyVolume')
    },

    async deactivate (item) {
      // conditional branching to determine which service to use
      // if selected has catalogNumber -> item, if has weeklyVolume -> assay, else vendor
      if (this.isItem()) {
        item.active = false
        await itemService.put(item.id, {active: !this.selectedItem.active})
      } else if (this.isAssay()) {
        item.active = false
        await assayService.put(item)
        // deactivate items with matching AssayId
        this.numItems = (await itemService.deactivate(item.id)).data[0]
      } else {
        item.active = false
        await vendorService.put(item)
        // deactivate items with matching VendorId
        this.numItems = (await itemService.deactivate(item.id)).data[0]
      }
      this.resultsDialog = true
    },

    async reassign (item) {
      let resId = this.temp.id
      if (this.isAssay()) {
        // reassign AssayId
        this.numItems = (await itemService.reassign(item.id, resId, 'AssayId')).data[0]
      } else {
        // reassign VendorId
        this.numItems = (await itemService.reassign(item.id, resId, 'VendorId')).data[0]
      }
      if (item.id !== resId) {
        item.hasItem = false
        this.temp.hasItem = true
        this.reassignInfo = Object.assign({}, this.temp)
      }
      this.resultsDialog = true
    }
  }
}
</script>

<style scoped>

</style>
