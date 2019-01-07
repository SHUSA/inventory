<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500px"
  >
    <v-card>
      <v-card-title class="title red lighten-2 font-weight-bold">
        You've met with a terrible fate, haven't you?
      </v-card-title>
      <v-card-text>
        {{getErrorMessage(response)}}
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="error" flat @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'response'
  ],

  data () {
    return {
      dialog: false,
      closed: false
    }
  },

  methods: {
    getErrorMessage (resp) {
      if (resp.status !== 200 && resp.status !== undefined && !this.closed) {
        // stop process and display error message
        this.dialog = true
        return Array.isArray(resp.data) ? resp.data[0].message : resp.statusText
      }
    },

    close () {
      this.dialog = false
      this.closed = true
    }
  }
}
</script>

<style scoped>

</style>
