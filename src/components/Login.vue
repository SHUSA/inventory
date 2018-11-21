<template>
  <v-layout>
    <v-flex xs2></v-flex>
    <v-flex xs8>
      <v-card>
        <v-card-title>
          <h3 class="headline">Who are you?</h3>
        </v-card-title>
        <v-card-actions>
          <v-btn flat @click="login('user')">User</v-btn>
          <v-btn flat @click="login('admin')">Admin</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs2></v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  mounted () {
    let initial = 'menu'
    this.$store.dispatch('setTitle', initial)
    this.$store.dispatch('setMode', initial)
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle',
      'mode'
    ])
  },

  methods: {
    login (type) {
      this.$store.dispatch('setUser', type)
      this.$router.push({
        name: 'index'
      })
    }
  }
}
</script>

<style scoped>

</style>
