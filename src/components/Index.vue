<template>
  <v-layout>
    <navigation></navigation>
    <v-flex xs12 offset-xs2>
      <panel :info="info">
        <user-inventory></user-inventory>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Navigation from './Navigation'
import UserInventory from './UserInventory'

export default {
  data () {
    return {
      info: {
        title: "your title here",
        assay: "your assay here"
      }
    }
  },
  components: {
    Navigation,
    UserInventory
  }
}
</script>

<style scoped>

</style>
