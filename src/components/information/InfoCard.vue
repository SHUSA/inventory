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
    <!-- to do: add deactivation.vue here -->
    <v-divider/>
    <v-footer>
      <v-flex text-xs-center>
        Last Updated: {{time(data)}}
      </v-flex>
    </v-footer>
  </v-card>
</template>

<script>
export default {
  props: [
    'data',
    'info'
  ],

  methods: {
    time (data) {
      return this.$moment(data.updatedAt).format('MMM-DD-YYYY')
    }
  }
}
</script>

<style scoped>

</style>
