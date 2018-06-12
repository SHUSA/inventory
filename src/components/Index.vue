<template>
  <v-layout>
    <v-navigation-drawer
    clipped
    app
    temporary
    :value="drawer"
    width="150"
    hide-overlay
    stateless
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              {{drawerTitle}}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile v-for="(item, index) in items" :key="item.name" @click="set(index)">
          <v-list-tile-action>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="item.shortName">{{item.shortName}}</v-list-tile-title>
            <v-list-tile-title v-else>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-flex xs12 offset-xs2 v-if="drawer">
      <tabs :list="items[index]" :search="drawerTitle"/>
    </v-flex>
    <v-flex xs12 v-else>
      <tabs :list="items[index]" :search="drawerTitle"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import assayService from '@/services/AssayService.js'
import vendorService from '@/services/VendorService.js'
import Tabs from './Tabs'

export default {
  data () {
    return {
      items: [],
      drawerTitle: '',
      index: 0
    }
  },
  components: {
    Tabs
  },
  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'drawer'
    ])
  },
  async mounted () {
    console.log('login status')
    console.log(`user: ${this.user}`)
    console.log(`admin: ${this.admin}`)
    if (this.user) {
      this.items = (await assayService.index(true)).data
      this.drawerTitle = 'Assays'
    } else if (this.admin) {
      this.items = (await vendorService.index(true)).data
      this.drawerTitle = 'Vendors'
    } else {
      this.items = [{name: 1}, {name: 2}, {name: 3}]
      this.drawerTitle = 'Demos'
    }
  },
  methods: {
    set (index) {
      this.$store.dispatch('setTitle', this.items[index].name)
      this.$store.dispatch('setDrawer')
      this.index = index
      console.log(this.index)
    }
  }
}
</script>

<style scoped>

</style>
