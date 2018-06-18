<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Support</v-tab>
    </v-tabs>
    <template>
      <admin-inventory :items='items' :assays="assays" :vendors="vendors" v-if="admin"/>
      <user-inventory :items='items' :assays="assays" v-if="user"/>
    </template>
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
      this.items = (await itemService.index(this.selection, true, this.search.toLowerCase())).data
    }
  }
}
</script>

<style scoped>

</style>
