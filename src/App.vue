<template>
  <div id="app">
    <v-app>
      <page-header/>
      <notification/>
      <error :response="response"/>
      <main>
        <v-container fluid>
          <router-view/>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import Notification from '@/components/globals/Notification'
import authenticationService from '@/services/AuthenticationService.js'

export default {
  name: 'App',
  components: {
    PageHeader,
    Notification
  },

  data () {
    return {
      response: ''
    }
  },

  async mounted () {
    if (this.$route.name !== 'login') {
      this.response = await authenticationService.sessionCheck()
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 64px;
  }

  html, body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance:textfield;
  }
</style>
