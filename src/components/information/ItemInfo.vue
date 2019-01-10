<template>
  <div>
    <v-dialog
      v-model="itemInfoDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="title py-1">
            {{item.name}}
            <!-- to do: add transition (bouncing) -->
            <v-icon small color="red" v-if="checkQuantity">fa-exclamation-circle</v-icon>
            <br>
        </v-card-title>
        <v-card-text class="caption py-0">
          Reactions/Item <v-icon small>fa-caret-right</v-icon> {{item.reactionsPerItem}}
          <br>
          <v-icon small class="pr-1">fa-hashtag</v-icon>{{item.catalogNumber}}
          <v-icon small class="pr-1 pl-2">{{assayIcon}}</v-icon>{{getAssay(item)}}
          <v-icon small class="pr-1 pl-2">fa-store</v-icon>{{getVendor(item)}}
        </v-card-text>
        <v-divider/>
        <v-card-text class="py-1">
          <v-icon small>{{descriptionIcon}}</v-icon>
          {{description}}
        </v-card-text>
        <v-divider/>
        <v-card-text class="py-1">
          <v-layout row wrap>
            <v-flex xs6 v-for="(info, index) in info" :key="index">
              <v-icon small>{{info.icon}}</v-icon>
              <span v-if="info.text">{{info.text}}
                <v-icon small>fa-caret-right</v-icon>
                {{info.call}}
              </span>
            </v-flex>
          </v-layout>
        </v-card-text>
        <template v-if="hasComment">
          <v-divider/>
          <v-card-text class="py-1">
            <v-icon small>fa-comment-dots</v-icon>
            {{item.comment}}
          </v-card-text>
        </template>
        <v-divider/>
        <v-footer class="caption" color="white">
          <v-flex text-xs-center>
            Last Updated: {{time(item)}}
          </v-flex>
        </v-footer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  props: [
    'item',
    'dialog',
    'assays',
    'vendors'
  ],

  data () {
    return {
      info: [
        {
          icon: 'fa-tag',
          text: 'Current',
          call: this.item.currentStock
        },
        {
          icon: 'fa-tags',
          text: 'Safety',
          call: this.item.safetyStock
        },
        {
          icon: 'fa-calendar-week',
          text: 'Reorder Weeks',
          call: this.item.weeksOfReorder
        },
        {
          icon: 'fa-calendar-week',
          text: 'Safety Weeks',
          call: this.item.weeksOfSafetyStock
        },
        {
          icon: 'fa-clock',
          text: 'Lead Days',
          call: this.item.leadTimeDays
        },
        { // empty column
          icon: null,
          text: null,
          call: null
        },
        {
          icon: 'fa-bell',
          text: 'Reorder',
          call: this.item.reorderPoint
        },
        {
          icon: 'fa-shopping-cart',
          text: 'Reorder',
          call: this.item.reorderQuantity
        }
      ]
    }
  },

  computed: {
    checkQuantity () {
      return this.item.currentStock < this.item.reorderPoint
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
      return this.getAssay(this.item).toLowerCase() === 'c. diff' ? 'fa-poo' : 'fa-dna'
    },

    descriptionIcon () {
      return this.item.itemDescription ? 'fa-sticky-note' : 'fa-times'
    },

    description () {
      return this.item.itemDescription ? this.item.itemDescription : 'No description'
    },

    hasComment () {
      return this.item.comment.trim()
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
