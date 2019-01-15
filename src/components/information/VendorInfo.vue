<template>
  <div>
    <v-dialog
      v-model="vendorInfoDialog"
      max-width="400px"
    >
      <info-card :data="vendor">
        <template slot="actions">
          <v-spacer/>
          <v-tooltip left>
            <v-btn slot="activator" small flat>
              <v-icon>fa-edit</v-icon>
            </v-btn>
            <span>Edit</span>
          </v-tooltip>
        </template>
      </info-card>
    </v-dialog>
  </div>
</template>

<script>
import InfoCard from './InfoCard'

export default {
  props: [
    'vendor',
    'dialog'
  ],

  components: {
    InfoCard
  },

  computed: {
    vendorInfoDialog: {
      get () {
        return this.dialog
      },

      set (value) {
        if (!value) {
          this.$emit('update:dialog', false)
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
