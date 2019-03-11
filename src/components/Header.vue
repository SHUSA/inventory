<template>
  <div>
    <!-- user settings -->
    <user-settings v-if="!user.isGeneral" :dialog.sync="dialog"/>
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
        {{inventoryTitle}}Inventory<sup>v1.011</sup>
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
            >
              <router-link :to="{name: item.toLowerCase()}" class="no-underline">
                <a class="link-color">{{item}}</a>
              </router-link>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-spacer/>
      <v-toolbar-items>
        <!-- manage users -->
        <v-btn v-if="user.isAdmin" icon flat>
          <v-icon>fa-users</v-icon>
        </v-btn>
        <!-- login and other info -->
        <v-btn flat :disabled="user.isGeneral" class="display" @click="dialog = true">
          <v-icon v-if="!user.isGeneral" class="pr-1" small>fa-cog</v-icon>
          <span class="white--text">{{welcome}}</span>
        </v-btn>
        <v-btn icon v-if="this.$route.name !== 'login'" flat @click="logout()">
          <!-- Log Out -->
          <v-icon>fa-sign-out-alt</v-icon>
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
import UserSettings from './authentication/UserSettings'

export default {
  components: {
    Help,
    UserSettings
  },

  data () {
    return {
      time: this.$moment().format('MMM DD, YYYY'),
      help: false,
      dialog: false,
      logoutDialog: false
    }
  },

  computed: {
    ...mapState([
      'inventoryTitle',
      'pageTitle',
      'user',
      'welcome'
    ]),

    routes () {
      if (this.user.isAdmin || this.user.isSubAdmin) {
        return ['Inventory', 'Orders', 'Catalog', 'Inactive']
      } else {
        return ['Inventory', 'Orders', 'Catalog']
      }
    }
  },

  methods: {
    logout () {
      this.logoutDialog = true
    },

    exit () {
      this.logoutDialog = false
      setTimeout(() => {
        this.$store.dispatch('resetAll')
        this.$router.push({
          name: 'login'
        })
      }, 300)
    }
  }
}
</script>

<style scoped>
  .no-underline {
    text-decoration: none;
  }

  .link-color {
    color: black;
  }
</style>
