<template>
  <v-dialog
    v-model="deactivationDialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Deactivate {{selection.name}}?</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" flat @click.stop="deactivationDialog = false">No</v-btn>
        <v-btn color="red darken-1" flat @click="deactivateItem(selection)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    }
  },

  methods: {
    deactivateItem (item) {
      alert('test')
    }
  }
}
</script>

<style scoped>

</style>
