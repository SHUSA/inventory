<template>
  <div>
    <!-- main deactivation dialog -->
    <v-dialog
      v-model="deactivationDialog"
      max-width="500px"
    >
      <popup :title='`Selected "${selectedItem.name}"`' titleStyle="warning">
        <template slot="content">
          <v-card-text class="subheading">
            <p v-if="!isItem() && selectedItem.hasItem">
              <v-chip disabled color="orange lighten-2" text-color="black" small label>Reassign</v-chip>
              Items can be assigned a different {{isAssay() ? 'Assay' : 'Vendor'}}.
            </p>
            <p v-if="selectedItem.active">
              <v-chip disabled color="red lighten-2" text-color="black" small label>Deactivate</v-chip>
              <span v-if="!isItem()">Any items associated with an assay or vendor will also be deactivated.</span>
              <span v-else>Selected item will be deactivated.</span>
            </p>
            <p v-if="!selectedItem.active">
              <v-chip disabled color="red lighten-2" text-color="black" small label>Reactivate</v-chip>
              <span v-if="!isItem()">Any items associated with an assay or vendor will also be reactivated.</span>
              <span v-else>Selected item will be reactivated.</span>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!isItem() && selectedItem.hasItem" color="orange darken-1" flat @click="reassignDialog = true">
              Reassign {{isAssay() ? 'Assay' : 'Vendor'}}
            </v-btn>
            <v-spacer/>
            <v-btn :color="!this.selectedItem.active ? 'blue darken-1' : 'red darken-1'" flat @click="deactivate(selectedItem)">
              {{this.selectedItem.active ? 'Deactivate' : 'Reactivate'}}
            </v-btn>
          </v-card-actions>
        </template>
      </popup>
    </v-dialog>

    <!-- results dialog -->
    <v-dialog
      v-model="resultsDialog"
      max-width="500px"
    >
      <popup title="Results">
        <v-card-text class="subheading" slot="content">
          <p>{{selectedItem.name}} {{reassignDialog ? `reassigned to ${reassignInfo.name}` : selectedItem.active ? 'reactivated' : 'deactivated'}}</p>
          <p v-if="!isItem()">{{numItems}} items {{reassignDialog ? 'reassigned' : selectedItem.active ? 'reactivated' : 'deactivated'}}</p>
        </v-card-text>
      </popup>
    </v-dialog>

    <!-- reassign dialog -->
    <v-dialog
      v-model="reassignDialog"
      max-width="500px"
    >
      <popup
        :title="`Reassign items with ${selectedItem.name} to ...?`"
      >
        <template slot="content">
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
        </template>
      </popup>
    </v-dialog>

    <error :response="response"/>
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
      response: '',
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

    checkResponse (resp) {
      if (resp.status === 200) {
        return true
      } else {
        alert(`${resp.status} ${Array.isArray(resp.data) ? resp.data[0].message : resp.statusText}`)
        return false
      }
    },

    async deactivate (item) {
      // conditional branching to determine which service to use
      // if selected has catalogNumber -> item, if has weeklyVolume -> assay, else vendor
      if (this.isItem()) {
        this.response = await itemService.put(item.id, {active: !item.active})
        item.active = this.response.status === 200 ? !item.active : item.active
      } else if (this.isAssay()) {
        item.active = !item.active
        this.response = await assayService.put(item)
        if (this.response.status === 200) {
          // deactivate items with matching AssayId
          this.numItems = (await itemService.deactivate(item.id, item.active)).data[0]
        }
      } else {
        item.active = !item.active
        this.response = await vendorService.put(item)
        if (this.response.status === 200) {
          // deactivate items with matching VendorId
          this.numItems = (await itemService.deactivate(item.id, item.active)).data[0]
        }
      }

      if (this.response.status === 200) {
        this.resultsDialog = true
      }
    },

    async reassign (item) {
      let resId = this.temp.id
      if (this.isAssay()) {
        // reassign AssayId
        this.response = await itemService.reassign(item.id, resId, 'AssayId')
        if (this.response.status === 200) {
          this.numItems = this.response.data[0]
        }
      } else {
        // reassign VendorId
        this.response = await itemService.reassign(item.id, resId, 'VendorId')
        if (this.response.status === 200) {
          this.numItems = this.response.data[0]
        }
      }
      if (this.response.status === 200) {
        if (item.id !== resId) {
          item.hasItem = false
          this.temp.hasItem = true
          this.reassignInfo = Object.assign({}, this.temp)
        }
        this.resultsDialog = true
      }
    }
  }
}
</script>

<style scoped>

</style>
