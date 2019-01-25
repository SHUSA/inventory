<template>
  <v-toolbar app clipped-left flat dark>
    <v-toolbar-title>
      {{title}} v.b-2.14
      <!-- help -->
      <v-dialog
        v-model="help"
        scrollable
        width="500"
      >
        <v-btn slot="activator" icon small class="mx-0">
          <v-icon small>fa-question-circle</v-icon>
        </v-btn>
        <help/>
      </v-dialog>
    </v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items>
      <!-- menu routes -->
      <!-- to do: add icons; book, elementor, triangle !, etc -->
      <v-menu v-if="this.$route.name !== 'login'">
        <v-btn slot="activator" flat>
          <v-icon small class="pr-1">fa-bars</v-icon>
          {{pageTitle}}
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(item, index) in routes" :key="index"
            @click="goTo(item)"
            v-if="checkUser(item)"
          >
            <v-list-tile-title>{{item}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <!-- login and other info -->
      <v-btn flat disabled class="display"><span class="white--text">{{welcome}}</span></v-btn>
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
import Help from './information/Help'

export default {
  data () {
    return {
      time: this.$moment().format('MMM DD, YYYY'),
      title: 'Molecular Inventory',
      help: false,
      routes: ['Inventory', 'Orders', 'Catalog', 'Inactive']
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
    Help
  },

  methods: {
    login () {
      this.$router.push({
        name: 'login'
      })
    },

    goTo (route) {
      this.$router.push({
        name: route.toLowerCase()
      })
    },

    checkUser (item) {
      if (item === 'Inactive' && this.user) {
        return false
      } else {
        return true
      }
    }
  }
}

</script>

<style scoped>

</style>
