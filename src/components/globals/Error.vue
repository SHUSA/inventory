<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500px"
  >
    <popup
      title="You've met with a terrible fate, haven't you?"
      titleStyle="error"
    >
      <template slot="content">
        <v-card-text>
          {{getErrorMessage(response)}}
          <br>
          {{getExtraMessage(response)}}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" flat @click="close()">Close</v-btn>
        </v-card-actions>
      </template>
    </popup>
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

    getExtraMessage (resp) {
      if (resp.status !== 200 && resp.status !== undefined && !this.closed) {
        // stop process and display error message
        this.dialog = true
        return resp.data.error || null
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
