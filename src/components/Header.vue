<template>
  <v-toolbar app clipped-left flat dark>
    <v-toolbar-title>
      {{title}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat>
        {{pageTitle}}
      </v-btn>
      <v-btn flat>
        {{time}}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
const moment = require('moment')

export default {
  data () {
    return {
      time: moment().format('MMM DD, YYYY'),
      title: 'Molecular Inventory',
      pageTitle: 'Page Title'
    }
  }
}

</script>

<style scoped>

</style>
