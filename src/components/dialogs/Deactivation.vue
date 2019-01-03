<template>
  <div>
    <!-- main deactivation dialog -->
    <v-dialog
      v-model="deactivationDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="title red lighten-2 font-weight-bold">
          <span>Deactivate {{selectedItem.name}}?</span>
        </v-card-title>
        <v-card-text class="subheading">
          <p>Note: Any items associated with an assay or vendor will also be deactivated.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" flat @click.stop="deactivationDialog = false">No</v-btn>
          <v-btn color="red darken-1" flat @click="deactivate(selectedItem)">Yes</v-btn>
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
          <span>Results</span>
        </v-card-title>
        <v-card-text class="subheading">
          <p>{{selectedItem.name}} deactivated</p>
          <p v-if="!isItem(selectedItem)">{{itemsDeleted}} items deactivated</p>
        </v-card-text>
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
    'dialog'
  ],

  data () {
    return {
      resultsDialog: false,
      itemsDeleted: 0
    }
  },

  watch: {
    resultsDialog (val) {
      if (!val) {
        this.deactivationDialog = false
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
    }
  },

  methods: {
    isItem (item) {
      return item.hasOwnProperty('catalogNumber')
    },

    async deactivate (item) {
      // conditional branching to determine which service to use
      // if selected has catalogNumber -> item, if has weeklyVolume -> assay, else vendor
      if (this.isItem(item)) {
        await itemService.put(item.id, {active: !this.selectedItem.active})
      } else if (item.hasOwnProperty('weeklyVolume')) {
        item.active = false
        await assayService.put(item)
        // deactivate items with matching AssayId
        this.itemsDeleted = (await itemService.deactivate(item.id)).data[0]
      } else {
        item.active = false
        await vendorService.put(item)
        // deactivate items with matching VendorId
        this.itemsDeleted = (await itemService.deactivate(item.id)).data[0]
      }
      this.resultsDialog = true
    }
  }
}
</script>

<style scoped>

</style>
