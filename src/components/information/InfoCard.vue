<template>
  <v-card>
  <!-- base card for ItemInfo and AssayInfo -->
  <!-- shares title, footer, and information areas -->
    <v-card-title class="title pb-1 blue lighten-2">
      {{data.name}}
    </v-card-title>
    <v-divider/>
    <!-- for extra information that goes under title -->
    <slot name="subinfo"/>
    <!-- main info area -->
    <v-card-text class="py-1">
      <v-layout row wrap>
        <v-flex xs6 v-for="(info, index) in info" :key="index">
          <v-tooltip left>
            <v-icon slot="activator" small>{{info.icon}}</v-icon>
            <span>{{info.tooltip}}</span>
          </v-tooltip>
          <span v-if="info.text">
            {{info.text}}
            <v-icon small>fa-caret-right</v-icon>
            {{info.call}}
          </span>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider/>
    <template v-if="admin">
      <v-card-actions>
        <v-tooltip right>
            <v-btn slot="activator" small flat @click="deactivate = true">
              <v-icon :color="data.active ? 'success' : 'error'">
                fa-power-off
              </v-icon>
            </v-btn>
          <span>{{deactivationText}} is {{data.active ? 'ACTIVE' : 'INACTIVE'}}</span>
        </v-tooltip>
        <slot name="actions">
          Card actions go here.
        </slot>
      </v-card-actions>
      <!-- to do: add deactivation.vue here -->
      <v-divider/>
    </template>
    <v-footer>
      <v-flex text-xs-center>
        Last Updated: {{time(data)}}
      </v-flex>
    </v-footer>

    <!-- deactivate -->
    <deactivation :selection.sync="data" :dialog.sync="deactivate"/>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Deactivation from '../dialogs/Deactivation'

export default {
  props: [
    'data',
    'info'
  ],

  data () {
    return {
      deactivate: false
    }
  },

  components: {
    Deactivation
  },

  computed: {
    ...mapState([
      'admin',
      'user'
    ]),

    deactivationText () {
      if (this.data.hasOwnProperty('catalogNumber')) {
        // is item
        return 'Item'
      } else if (this.data.hasOwnProperty('weeklyVolume')) {
        // is assay
        return 'Assay'
      } else {
        // is vendor
        return 'Vendor'
      }
    }
  },

  methods: {
    time (data) {
      return this.$moment(data.updatedAt).format('MMM-DD-YYYY')
    }
  }
}
</script>

<style scoped>
  /* input {
    border-bottom: 1px solid black;
  } */
</style>
