<template>
  <v-toolbar app clipped-left flat dark>
    <v-toolbar-title>
      {{title}} v.b-1.7.17
      <!-- recent updates button -->
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
    <v-spacer/>
    <v-toolbar-items>
      <!-- menu routes -->
      <v-menu v-if="this.$route.name === 'index'">
        <v-btn slot="activator" flat>
          <v-icon small class="pr-1">fa-bars</v-icon>
          {{pageTitle}}
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(item, index) in routes" :key="index"
            @click="goTo(item)"
          >
            <v-list-tile-title>{{item}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <!-- login and other info -->
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

export default {
  data () {
    return {
      time: this.$moment().format('MMM DD, YYYY'),
      title: 'Molecular Inventory',
      dialog: false,
      routes: ['Inventory', 'Orders']
    }
  },
  computed: {
    ...mapState([
      'pageTitle',
      'admin',
      'user',
      'welcome',
      'mode'
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

    goTo (route) {
      this.$store.dispatch('setTitle', route.toLowerCase())
      this.$store.dispatch('setMode', route.toLowerCase())
    }
  }
}

</script>

<style scoped>

</style>
