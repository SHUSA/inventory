<template>
  <v-toolbar app clipped-left flat dark>
    <v-toolbar-title>
      {{title}} v.b-1.7.17
      <v-dialog
        v-model="dialog"
        scrollable
        width="500"
      >
        <v-btn slot="activator" icon small class="mx-0">
          <v-icon small>fa-scroll</v-icon>
        </v-btn>
        <update/>
      </v-dialog>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn v-if="$route.name !== 'login'" flat @click.native="drawer">
        <v-icon small class="pr-1">fa-bars</v-icon>
        {{pageTitle}}
      </v-btn>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <v-btn flat class="display">{{welcome}}</v-btn>
      <v-btn flat @click="login">
        Login
      </v-btn>
      <v-btn flat class="display">
        {{time}}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
import Update from './Update'
const moment = require('moment')

export default {
  data () {
    return {
      time: moment().format('MMM DD, YYYY'),
      title: 'Molecular Inventory',
      dialog: false
    }
  },
  computed: {
    ...mapState([
      'pageTitle',
      'admin',
      'user',
      'welcome'
    ])
  },
  components: {
    Update
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
