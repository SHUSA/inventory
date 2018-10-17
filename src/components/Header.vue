<template>
  <v-toolbar app clipped-left flat dark>
    <v-toolbar-title>
      {{title}} v.b-1.7.14
      <v-dialog
        v-model="dialog"
        scrollable
        width="500"
      >
        <v-btn slot="activator" icon small class="mx-0">
          <v-icon>announcement</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline">What's New!</v-card-title>
          <v-divider/>
          <update/>
        </v-card>
      </v-dialog>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn v-if="$route.name !== 'login'" flat @click.native="drawer">
        <v-icon>menu</v-icon>
        {{pageTitle}}
      </v-btn>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <v-btn flat disabled>{{welcome}}</v-btn>
      <v-btn flat @click="login">
        Login
      </v-btn>
      <v-btn flat disabled>
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
  .v-toolbar__items /deep/ .v-btn--disabled {
    color: white!important;
  }

</style>
