<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Support</v-tab>
    </v-tabs>
    <!-- <v-list-tile v-for="(item, index) in items" :key="item.name" @click="set(index)">
          <v-list-tile-action>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
    </v-list-tile> -->
    <admin-inventory :items='items' :assays="assays" :vendors="vendors" v-if="admin"/>
    <user-inventory :items='items' :assays="assays" v-if="user"/>
  </div>
</template>

<script>
import Panel from './globals/Panel'
import AdminInventory from './AdminInventory'
import UserInventory from './UserInventory'
import itemService from '@/services/ItemService.js'
import { mapState } from 'vuex'

export default {
  props: [
    'selection',
    'search',
    'assays',
    'vendors'
  ],
  components: {
    Panel,
    AdminInventory,
    UserInventory
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
    ...mapState([
      'user',
      'admin',
      'drawer'
    ])
  },
  watch: {
    async selection () {
      this.items = (await itemService.index(this.selection, true, this.search.toLowerCase().slice(0, -1))).data
    }
  }
}
</script>

<style scoped>

</style>
