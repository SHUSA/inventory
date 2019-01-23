<template>
  <!-- shared styling -->
  <popup :title="formTitle" titleStyle="transparent">
    <template slot="content" >
      <slot name="input-fields"/>
      <v-divider/>
      <v-card-actions>
        <deactivation v-if="hasData(data)" :selection="data"/>
        <v-spacer/>
        <slot name="buttons"/>
      </v-card-actions>
    </template>
  </popup>
</template>

<script>
import Deactivation from './Deactivation'

export default {
  // shared rules
  props: [
    'formTitle',
    'data',
    'inputs'
  ],

  components: {
    Deactivation
  },

  data () {
    return {
    }
  },

  methods: {
    hasData (data = {}) {
      return Object.keys(data).length > 0
    }
  }
}
</script>

<style scoped>

</style>
