<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline mb-0">{{infoTab.name}}</h3>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
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

</style>
