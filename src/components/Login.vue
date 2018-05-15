<template>
  <v-layout>
    <v-flex xs2></v-flex>
    <v-flex xs8>
      <v-card>
        <v-card-title>
          <h3 class="headline">Who are you?</h3>
        </v-card-title>
        <v-card-actions>
          <router-link to="/">
            <v-btn flat>User</v-btn>
          </router-link>
          <router-link to="/">
            <v-btn flat>Admin</v-btn>
          </router-link>
          <router-link to="/">
            <v-btn flat>Demo</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs2></v-flex>
  </v-layout>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
