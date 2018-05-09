<template>
  <v-layout>
    <navigation></navigation>
    <v-flex xs12 offset-xs2>
      <panel></panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Navigation from './Navigation'
import Panel from './Panel'
export default {
  components: {
    Navigation,
    Panel
  }
}
</script>

<style scoped>

</style>
