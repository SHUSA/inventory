<template>
  <v-snackbar
    v-model="open"
    bottom
    :color="snackbar.color"
  >
    <v-flex class="text-xs-center">
      <v-icon class="pr-0">{{snackbar.icon}}</v-icon>
      {{snackbar.text}}
    </v-flex>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'snackbar'
    ]),

    open: {
      get () {
        return this.snackbar.open
      },
      set (val) {
        if (!val) {
          this.$store.dispatch('setSnack', { open: val })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
