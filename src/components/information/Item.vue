<template>
  <v-card-text slot="info">
    <v-container fill-height grid-list-md>
      <v-card flat dark class="box">
        <v-card-text v-if="infoTab.itemDescription">{{infoTab.itemDescription}}</v-card-text>
        <v-card-text v-else>No description.</v-card-text>
      </v-card>
    </v-container>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs6>{{infoTab.itemDescription}}</v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'infoTab'
    ])
  }
}
</script>

<style scoped>
  .box {
    min-width: 25%;
  }
</style>
