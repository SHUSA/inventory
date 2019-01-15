<template>
  <div>
    <v-dialog
      v-model="itemInfoDialog"
      max-width="400px"
    >
      <info-card :data="itemInfo" :info="info">
        <template slot="subinfo">
          <v-card-text class="caption py-1">
            <v-tooltip left>
              <v-icon slot="activator" small class="pr-0">fa-hashtag</v-icon>
              <span>Catalog Number</span>
            </v-tooltip>
            {{itemInfo.catalogNumber}}
            <v-tooltip left>
              <v-icon slot="activator" small class="pr-0 pl-2">fa-vial</v-icon>
              <span>Reactions per Item</span>
            </v-tooltip>
            {{itemInfo.reactionsPerItem}}
            <br>
            <v-tooltip left>
              <v-icon slot="activator" small class="pr-0">{{assayIcon}}</v-icon>
              <span>Assay</span>
            </v-tooltip>
            {{getAssay(itemInfo)}}
            <v-tooltip left>
              <v-icon slot="activator" small class="pr-0 pl-2">fa-store</v-icon>
              <span>Vendor</span>
            </v-tooltip>
            {{getVendor(itemInfo)}}
          </v-card-text>
          <v-divider/>
          <v-card-text class="py-1">
            <v-icon small>{{descriptionIcon}}</v-icon>
            {{description}}
          </v-card-text>
          <v-divider/>
        </template>
        <template slot="actions">
          <v-btn small flat @click="deactivate = true">{{itemInfo.active ? 'Deactivate' : 'Reactivate'}}</v-btn>
          <v-spacer/>
          <v-btn small flat>Edit</v-btn>
        </template>
      </info-card>
    </v-dialog>

    <!-- deactivate -->
    <deactivation :selection.sync="itemInfo" :dialog.sync="deactivate"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Deactivation from '../dialogs/Deactivation'
import InfoCard from './InfoCard'

export default {
  props: [
    'item',
    'dialog',
    'assays',
    'vendors'
  ],

  components: {
    InfoCard,
    Deactivation
  },

  data () {
    return {
      deactivate: false,
      info: [
        {
          icon: 'fa-cube',
          text: 'Current',
          tooltip: 'Current Stock',
          call: this.item.currentStock
        },
        {
          icon: 'fa-cube',
          text: 'Safety',
          tooltip: 'Safety Stock',
          call: this.item.safetyStock
        },

        {
          icon: 'fa-less-than-equal',
          text: 'Reorder',
          tooltip: 'Reorder Point',
          call: this.item.reorderPoint
        },
        {
          icon: 'fa-shopping-cart',
          text: 'Reorder',
          tooltip: 'Reorder Quantity',
          call: this.item.reorderQuantity
        },
        {
          icon: 'fa-calendar-week',
          text: 'Reorder Weeks',
          tooltip: 'Reorder Weeks',
          call: this.item.weeksOfReorder
        },
        {
          icon: 'fa-calendar-week',
          text: 'Safety Weeks',
          tooltip: 'Safety Weeks',
          call: this.item.weeksOfSafetyStock
        },
        {
          icon: 'fa-clock',
          text: 'Lead Days',
          tooltip: 'Lead Time Days',
          call: this.item.leadTimeDays
        }
      ]
    }
  },

  computed: {
    ...mapState([
      'admin',
      'user'
    ]),

    itemInfo: {
      get () {
        return this.item
      },

      set (value) {
        this.$emit('update:item', value)
      }
    },

    checkQuantity () {
      return this.itemInfo.currentStock < this.itemInfo.reorderPoint
    },

    itemInfoDialog: {
      get () {
        return this.dialog
      },

      set (value) {
        if (!value) {
          this.$emit('update:dialog', false)
        }
      }
    },

    assayIcon () {
      return this.getAssay(this.itemInfo).toLowerCase() === 'c. diff' ? 'fa-poo' : 'fa-dna'
    },

    descriptionIcon () {
      return this.itemInfo.itemDescription ? 'fa-sticky-note' : 'fa-times'
    },

    description () {
      return this.itemInfo.itemDescription ? this.itemInfo.itemDescription : 'No description'
    },

    hasComment () {
      return this.itemInfo.comment.trim()
    }
  },

  methods: {
    getAssay (item) {
      if (this.assays.length === 0) {
        return null
      }
      return this.assays.find(assay => assay.id === item.AssayId).name
    },

    getVendor (item) {
      if (this.vendors.length === 0) {
        return null
      }
      return this.vendors.find(vendor => vendor.id === item.VendorId).name
    },

    time (item) {
      return this.$moment(item.updatedAt).format('MMM-DD-YYYY')
    }
  }
}
</script>

<style scoped>

</style>
