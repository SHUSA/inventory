<template>
  <v-card>
    <v-card-title primary-title class="pb-0">
      <h3 class="headline mb-0">{{infoTab.name}}</h3>
    </v-card-title>
    <v-subheader>{{infoTab.assay}} - {{infoTab.vendor}} - Catalog #{{infoTab.catalogNumber}}</v-subheader>
    {{test}}
    <slot name="info"/>
    <slot>no content</slot>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: [
    'test'
  ],

  computed: {
    ...mapState([
      'infoTab'
    ])
  }
}
</script>

<style scoped>

</style>
