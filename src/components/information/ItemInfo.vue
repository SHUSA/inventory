<template>
    <v-dialog
      v-model="itemInfoDialog"
      max-width="400px"
    >
      <item-dialog
        :itemDialog.sync="itemDialog"
        :selectedItem.sync="itemInfo"
        :catalogNumbers.sync="catalogs"
        :assayNameList.sync="assayNames"
        :vendorNameList.sync="vendorNames"
        :itemList.sync="items"
        :assayList.sync="assays"
        :vendorList.sync="vendors"
        :editedIndex.sync="index"
      />
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
            {{itemInfo.Assay ? itemInfo.Assay.name : ''}}
            <v-tooltip left>
              <v-icon slot="activator" small class="pr-0 pl-2">fa-store</v-icon>
              <span>Vendor</span>
            </v-tooltip>
            {{itemInfo.Vendor ? itemInfo.Vendor.name : ''}}
          </v-card-text>
          <v-divider/>
          <v-card-text class="py-1">
            <v-icon small>{{descriptionIcon}}</v-icon>
            {{description}}
          </v-card-text>
          <v-divider/>
        </template>
        <template slot="actions">
          <v-spacer/>
          <v-tooltip left>
            <v-btn slot="activator" small flat @click="itemDialog = true">
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
import ItemDialog from '../dialogs/ItemDialog'

export default {
  props: [
    'item',
    'dialog',
    'itemList',
    'assayList',
    'vendorList',
    'catalogNumbers',
    'vendorNameList',
    'assayNameList',
    'itemIndex'
  ],

  components: {
    InfoCard,
    ItemDialog
  },

  data () {
    return {
      deactivate: false,
      info: [],
      assayIcon: '',
      descriptionIcon: '',
      description: '',
      itemDialog: false
    }
  },

  watch: {
    itemInfo (value) {
      this.info = [
        {
          icon: 'fa-cube',
          text: 'Current',
          tooltip: 'Current Stock',
          call: value.currentStock
        },
        {
          icon: 'fa-cube',
          text: 'Safety',
          tooltip: 'Safety Stock',
          call: value.safetyStock
        },

        {
          icon: 'fa-less-than-equal',
          text: 'Reorder',
          tooltip: 'Reorder Point',
          call: value.reorderPoint
        },
        {
          icon: 'fa-shopping-cart',
          text: 'Reorder',
          tooltip: 'Reorder Quantity',
          call: value.reorderQuantity
        },
        {
          icon: 'fa-calendar-week',
          text: 'Reorder Weeks',
          tooltip: 'Reorder Weeks',
          call: value.weeksOfReorder
        },
        {
          icon: 'fa-calendar-week',
          text: 'Safety Weeks',
          tooltip: 'Safety Weeks',
          call: value.weeksOfSafetyStock
        },
        {
          icon: 'fa-calendar-week',
          text: 'Base Weeks',
          tooltip: 'Safety Weeks',
          call: value.baseWeeks
        },
        {
          icon: 'fa-clock',
          text: 'Lead Days',
          tooltip: 'Lead Time Days',
          call: value.leadTimeDays
        }
      ]

      this.assayIcon = value.name.toLowerCase() === 'c. diff' ? 'fa-poo' : 'fa-dna'
      this.descriptionIcon = value.itemDescription ? 'fa-sticky-note' : 'fa-times'
      this.description = value.itemDescription ? value.itemDescription : 'No description'
    }
  },

  computed: {
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

    index: {
      get () {
        return this.itemIndex
      },

      set (value) {
        this.$emit('update:itemIndex', value)
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
    time (item) {
      return this.$moment(item.updatedAt).format('MMM-DD-YYYY')
    }
  }
}
</script>

<style scoped>
</style>
