<template>
  <v-card>
  <!-- base card for ItemInfo and AssayInfo -->
  <!-- shares title, footer, and information areas -->
    <v-card-title class="title pb-1 blue lighten-2">
      <div>
        <v-icon small class="pb-1">{{titleIcon}}</v-icon>
        {{data.name}}
      </div>
    </v-card-title>
    <v-divider/>
    <!-- for extra information that goes under title -->
    <slot name="subinfo"/>
    <!-- main info area -->
    <v-card-text class="py-1">
      <template v-if="info">
          <v-layout row wrap>
            <v-flex xs6 v-for="(info, index) in info" :key="index">
              <v-tooltip left>
                <span slot="activator">
                  <v-icon small>{{info.icon}}</v-icon>
                  <span v-if="info.text">
                    {{info.text}}
                    <v-icon small>fa-caret-right</v-icon>
                    {{info.call}}
                  </span>
                </span>
                <span>{{info.tooltip}}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
      </template>
      <template v-else>
        I dunno man. There's no info to display. ¯\_(ツ)_/¯
      </template>
    </v-card-text>
    <v-divider/>
    <!-- card actions -->
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
    <deactivation :selection.sync="data" :dialog.sync="deactivate" :reassigned.sync="resData" :assays="assays" :vendors="vendors"/>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Deactivation from '../dialogs/Deactivation'

export default {
  props: [
    'data',
    'assays',
    'vendors',
    'reassigned',
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

    titleIcon () {
      if (this.data.hasOwnProperty('catalogNumber')) {
        // is item
        return 'fa-syringe'
      } else if (this.data.hasOwnProperty('weeklyVolume')) {
        // is assay
        return this.data.name.toLowerCase() === 'c. diff' ? 'fa-poo' : 'fa-dna'
      } else {
        // is vendor
        return 'fa-store'
      }
    },

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
    },

    resData: {
      get () {
        return this.reassigned
      },

      set (value) {
        this.$emit('update:reassigned', value)
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
