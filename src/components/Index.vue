<template>
  <v-layout>
    <navigation></navigation>
    <v-flex xs12 offset-xs2>
      <panel :info="info">
        <order></order>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Navigation from './Navigation'
import Panel from './Panel'
import Order from './Order'

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
    Panel,
    Order
  }
}
</script>

<style scoped>

</style>
