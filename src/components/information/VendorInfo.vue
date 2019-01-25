<template>
  <v-dialog
    v-model="vendorInfoDialog"
    max-width="400px"
  >
    <vendor-dialog
      :vendorDialog.sync="vendorDialog"
      :selectedVendor.sync="currentVendor"
      :vendorNameList.sync="vendorNames"
      :vendorIndex.sync="index"
      :vendorList.sync="vendorList"
      :editedItem="{}"
      :reassigned.sync="resData"
    />
    <info-card :data="vendor" :vendors="vendors" :reassigned.sync="resData">
      <template slot="actions">
        <v-spacer/>
        <v-tooltip left>
          <v-btn slot="activator" small flat @click="vendorDialog = true">
            <v-icon>fa-edit</v-icon>
          </v-btn>
          <span>Edit</span>
        </v-tooltip>
      </template>
    </info-card>
  </v-dialog>
</template>

<script>
import InfoCard from './InfoCard'
import VendorDialog from '../dialogs/VendorDialog'

export default {
  props: [
    'vendor',
    'vendorList',
    'reassigned',
    'dialog',
    'vendorNameList',
    'vendorIndex'
  ],

  components: {
    InfoCard,
    VendorDialog
  },

  data () {
    return {
      vendorDialog: false
    }
  },

  computed: {
    vendorInfoDialog: {
      get () {
        return this.dialog
      },

      set (value) {
        if (!value) {
          this.$emit('update:dialog', false)
        }
      }
    },

    resData: {
      get () {
        return this.reassigned
      },

      set (value) {
        this.$emit('update:reassigned', value)
      }
    },

    index: {
      get () {
        return this.vendorIndex
      },

      set (value) {
        this.$emit('update:vendorIndex', value)
      }
    },

    currentVendor: {
      get () {
        return this.vendor
      },

      set (value) {
        this.$emit('update:vendor', value)
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

    vendors: {
      get () {
        return this.vendorList
      },

      set (value) {
        this.$emit('update:vendorList', value)
      }
    }
  }
}
</script>

<style scoped>
</style>
