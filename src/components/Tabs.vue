<template>
  <div>
    <v-tabs
      dark
    >
      <v-tab>Main</v-tab>
      <v-tab>Support</v-tab>
    </v-tabs>
    <v-list-tile v-for="(item, index) in items" :key="item.name" @click="set(index)">
          <v-list-tile-action>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
  </div>
</template>

<script>
import Panel from './globals/Panel'
import itemService from '@/services/ItemService.js'

export default {
  props: [
    'list',
    'search'
  ],
  components: {
    Panel
  },
  data () {
    return {
      items: {}
    }
  },

  watch: {
    async list () {
      this.items = (await itemService.index(this.list, true, this.search.toLowerCase().slice(0, -1))).data
    }
  }
}
</script>

<style scoped>

</style>
