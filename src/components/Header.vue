<template>
  <v-toolbar app clipped-left flat dark>
    <v-toolbar-title>
      {{title}} v.b-build-1
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat @click.native="drawer">
        <v-icon>menu</v-icon>
        {{pageTitle}}
      </v-btn>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <v-btn flat @click="login">
        Login
      </v-btn>
      <v-btn flat>
        {{time}}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
const moment = require('moment')

export default {
  data () {
    return {
      time: moment().format('MMM DD, YYYY'),
      title: 'Molecular Inventory'
    }
  },
  computed: {
    ...mapState([
      'pageTitle'
    ])
  },
  methods: {
    login () {
      this.$router.push({
        name: 'login'
      })
    },

    drawer () {
      this.$store.dispatch('setDrawer')
    }
  }
}

</script>

<style scoped>

</style>
