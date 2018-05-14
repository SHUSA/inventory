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
        <v-list-tile v-for="item in items" :key="item.title" @click="set">
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
        <item v-if="tags.item"/>
        <user-inventory v-if="tags.user"/>
        <admin-inventory v-if="tags.admin"/>
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
      tags: {
        user: false,
        admin: false,
        item: false
      },
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ]
    }
  },
  components: {
    UserInventory,
    AdminInventory,
    Item
  },
  methods: {
    set () {
      this.tags.user = !this.tags.user
    }
  }
}
</script>

<style scoped>

</style>
