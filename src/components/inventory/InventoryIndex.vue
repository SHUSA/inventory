<template>
  <v-card flat color="#fafafa">
    <!-- use this component to pre-select options before rendering table -->
    <!-- options: choose assays and/or vendors; some, one, or all -->
    <v-container fluid fill-height grid-list-md>
      <v-layout v-if="!submit" row wrap>
        <v-card-text>Choose your filters</v-card-text>
        <v-btn @click="populateList('assays')">Assays</v-btn>
        <v-btn @click="populateList('vendors')">Vendors</v-btn>
        <v-flex xs12>
          <transition-group name="chips" tag="span">
            <v-chip v-if="show" key="select-all" @click="selectAll(list)" :color="allSelected ? 'red' : someSelected ? 'orange' : ''">
              {{!allSelected ? 'SELECT ALL' : 'DESELECT ALL'}}
            </v-chip>
            <v-chip v-if="show" key="submit" @click="submit = true">Go!</v-chip>
            <br key="break">
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
      <inventory v-else :selected="selected"/>
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
      shown: '',
      submit: false
    }
  },

  mounted () {
    this.initialize()
  },

  computed: {
    allSelected () {
      if (this[this.shown]) {
        return this.selected.length === this[this.shown].length
      } else {
        return false
      }
    },

    someSelected () {
      return this.selected.length > 0 && !this.allSelected
    }
  },

  methods: {
    async initialize () {
      this.assays = (await assayService.index(true, ['name'])).data
      this.vendors = (await vendorService.index(true, ['name'])).data
    },

    populateList (type) {
      // control chip visibility
      if (this.show) {
        if (this.shown === type) this.show = false
      } else {
        this.show = true
      }

      // pass data to list
      if (type === 'assays') {
        this.list = this.assays
      } else if (type === 'vendors') {
        this.list = this.vendors
      }
      this.shown = type
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

    selectAll (list) {
      if (this.selected.length === list.length) {
        this.selected = []
      } else {
        this.selected = list.map(x => x.name)
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
