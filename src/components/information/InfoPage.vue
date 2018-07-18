<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline mb-0">{{infoTab.name}}</h3>
        </v-card-title>
        {{test}}
        <slot name='test'/>
        <slot>no content</slot>
        <li v-for="(value, key, id) in infoTab" :key="id">
          {{key}} : {{value}}
        </li>
      </v-card>
    </v-flex>
  </v-layout>
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
