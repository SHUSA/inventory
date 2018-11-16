<template>
  <v-card flat color="#fafafa">
    <!-- use this component to pre-select options before rendering table -->
    <!-- options: choose assays and/or vendors; some, one, or all -->
    <v-container fluid fill-height grid-list-md>
      <v-layout row wrap>
        <v-btn @click="populateList('assay')">Assays</v-btn>
        <v-btn @click="populateList('vendor')">Vendors</v-btn>
        <v-flex xs12>
          <transition-group name="chips" tag="span">
            <v-chip v-if="show" key="select-all">SELECT ALL</v-chip>
            <v-chip
              v-if="show"
              v-for="(item, index) in list"
              :key="index"
              :color="isSelected(item.name) ? 'blue lighten-2' : ''"
              @click="add(item)"
            >
              {{item.name}}
            </v-chip>
          </transition-group>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import Inventory from './Inventory'

export default {
  components: {
    Inventory
  },

  data () {
    return {
      assays: [],
      vendors: [],
      list: [],
      selected: [],
      show: false,
      shown: null
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      this.assays = (await assayService.index(true, ['name'])).data
      this.vendors = (await vendorService.index(true, ['name'])).data
    },

    populateList (type) {
      // pass data to list
      if (type === 'assay') {
        this.list = this.assays
      } else if (type === 'vendor') {
        this.list = this.vendors
      }
      // control chip visibility
      // fix this
      if (this.shown === type) {
        this.show = !this.show
      } else {
        this.shown = type
      }
    },

    add (item) {
      let arr = this.selected
      if (!arr.includes(item.name)) {
        arr.push(item.name)
      } else {
        arr.splice(arr.indexOf(item.name), 1)
      }
    },

    isSelected (item) {
      return this.selected.includes(item)
    },

    selectAll () {
      if (this.all) {
        this.selected = []
      } else {
        this.selected = []
        this.selected = this.assays.map(x => x.name)
      }
    }
  }

}
</script>

<style scoped>
  .chips-enter-active, .chips-enter-leave {
    transition: all 1s;
  }

  .chips-enter {
    opacity: 0;
    transform: translateX(-100px);
  }

  .chips-leave-to {
    opacity: 0;
    transform: translateX(100px);
  }
</style>
