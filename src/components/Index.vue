<template>
  <v-layout>
    <v-navigation-drawer
    clipped
    app
    permanent
    width="150"
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Test
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile v-for="(item, index) in items" :key="item.title" @click="set(index)">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-flex xs12 offset-xs2>
      <user-inventory v-if="items[0].tag"/>
      <admin-inventory v-if="items[1].tag"/>
      <item v-if="items[2].tag"/>
    </v-flex>
  </v-layout>
</template>

<script>
import UserInventory from './UserInventory'
import AdminInventory from './AdminInventory'
import Item from './Item'

export default {
  data () {
    return {
      items: [
        { title: 'User', icon: null, tag: false },
        { title: 'Admin', icon: null, tag: false },
        { title: 'Item', icon: null, tag: false }
      ]
    }
  },
  components: {
    UserInventory,
    AdminInventory,
    Item
  },
  methods: {
    // find a smarter way to do this
    set (index) {
      for (let i = 0; i < this.items.length; i++) {
        if (i === index) {
          this.items[i].tag = !this.items[i].tag
        } else {
          this.items[i].tag = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
