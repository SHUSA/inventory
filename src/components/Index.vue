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
        <v-list-tile v-for="item in items" :key="item.title" @click="set(item.title, item)">
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
      <panel :info="info">        
        <user-inventory v-if="items[0].user"/>
        <admin-inventory v-if="items[1].admin"/>
        <item v-if="items[2].item"/>
      </panel>
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
      info: {
        title: 'your title here',
        assay: 'your assay here'
      },
      items: [
        { title: 'User', icon: null, user: false },
        { title: 'Admin', icon: null, admin: false },
        { title: 'Item', icon: null, item: false }
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
    set (title, item) {
      let key = title.toLowerCase()

      item[key] = !item[key]
    }
  }
}
</script>

<style scoped>

</style>
