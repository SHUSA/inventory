<template>
  <div>
    <!-- user settings -->
    <user-settings :dialog.sync="dialog"/>
    <!-- logout -->
    <v-dialog
      v-model="logoutDialog"
      width="500px"
    >
      <popup title="Log out?">
        <v-card-actions slot="content">
          <v-spacer/>
          <v-btn flat color="error" @click="logoutDialog = false">No</v-btn>
          <v-btn flat color="primary" @click="exit()">Yes</v-btn>
        </v-card-actions>
      </popup>
    </v-dialog>
    <!-- toolbar -->
    <v-toolbar app clipped-left flat dark>
      <v-toolbar-title>
        {{title}} v1.00
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
            >
              <v-list-tile-title>{{item}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-spacer/>
      <v-toolbar-items>
        <!-- login and other info -->
        <v-btn flat :disabled="!user.isUserLoggedIn" class="display" @click="dialog = true">
          <v-icon v-if="user.isUserLoggedIn" class="pr-1" small>fa-cog</v-icon>
          <span class="white--text">{{welcome}}</span>
        </v-btn>
        <v-btn v-if="this.$route.name !== 'login'" flat @click="logout()">
          Log Out
        </v-btn>
        <v-btn flat disabled class="display">
          <span class="white--text">{{time}}</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Help from './information/Help'
import UserSettings from './UserSettings'

export default {
  components: {
    Help,
    UserSettings
  },

  data () {
    return {
      time: this.$moment().format('MMM DD, YYYY'),
      title: 'Molecular Inventory',
      help: false,
      dialog: false,
      logoutDialog: false
    }
  },

  computed: {
    ...mapState([
      'pageTitle',
      'user',
      'welcome'
    ]),

    routes () {
      if (this.user.isUserLoggedIn) {
        return ['Inventory', 'Orders', 'Catalog', 'Inactive']
      } else {
        return ['Inventory', 'Orders', 'Catalog']
      }
    }
  },

  methods: {
    logout () {
      if (this.user.isUserLoggedIn) {
        // admin
        this.logoutDialog = true
        return null
      }
      this.$router.push({
        name: 'login'
      })
    },

    exit () {
      this.logoutDialog = false
      setTimeout(() => {
        this.$router.push({
          name: 'login'
        })
      }, 300)
    },

    goTo (route) {
      this.$router.push({
        name: route.toLowerCase()
      })
    }
  }
}
</script>

<style scoped>

</style>
