<template>
  <v-layout>
    <!-- components -->
    <v-flex xs12 wrap>
      <update/>
    </v-flex>
    <!-- fab button -->
    <scroll/>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import Update from './information/Update'

export default {
  components: {
    Update
  },

  mounted () {
    let initial = 'menu'
    this.$store.dispatch('setTitle', initial)
  },

  computed: {
    ...mapState([
      'user',
      'pageTitle'
    ])
  }
}
</script>

<style scoped>

</style>
