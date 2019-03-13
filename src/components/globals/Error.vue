<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500px"
  >
    <popup
      :title="title"
      titleStyle="error"
    >
      <template slot="content">
        <v-card-text>
          {{getErrorMessage(data)}}
          <br>
          {{getExtraMessage(data)}}
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
      closed: false,
      title: 'You\'ve met with a terrible fate, haven\'t you?',
      data: {}
    }
  },

  watch: {
    response () {
      this.data = this.$clonedeep(this.response)
    }
  },

  methods: {
    getErrorMessage (resp) {
      this.closed = false
      if (resp.status !== 200 && resp.status !== 400 && resp.status !== undefined && !this.closed) {
        // stop process and display error message
        this.title = resp.data.title ? resp.data.title : this.title
        this.dialog = true
        return Array.isArray(resp.data) ? resp.data[0].message : resp.statusText
      }
    },

    getExtraMessage (resp) {
      if (resp.status !== 200 && resp.status !== 400 && resp.status !== undefined && !this.closed) {
        // stop process and display error message
        if (resp.data.redirect) {
          setTimeout(() => {
            this.$store.dispatch('resetAll')
            this.close()
            this.$router.push({ name: 'login' })
          }, 3000)
        }
        return resp.data.error || null
      }
    },

    close () {
      this.dialog = false
      this.closed = true
      this.data = {}
    }
  }
}
</script>

<style scoped>

</style>
