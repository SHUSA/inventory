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
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: [
    'data',
    'info'
  ],

  computed: {
    ...mapState([
      'admin',
      'user'
    ])
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
