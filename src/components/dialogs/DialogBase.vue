<template>
  <!-- shared styling -->
  <popup :title="formTitle" titleStyle="transparent">
    <template slot="content" >
      <slot name="input-fields"/>
      <v-divider/>
      <v-card-actions>
        <template v-if="hasData(data)">
          <v-tooltip right>
            <v-btn slot="activator" small flat @click="deactivate = true">
              <v-icon :color="data.active ? 'success' : 'error'">
                fa-power-off
              </v-icon>
            </v-btn>
            <span>{{deactivationText}} is {{data.active ? 'ACTIVE' : 'INACTIVE'}}</span>
          </v-tooltip>
        </template>
        <v-spacer/>
        <slot name="buttons"/>
      </v-card-actions>
      <!-- deactivate -->
      <deactivation v-if="hasData(data)" :selection.sync="data" :dialog.sync="deactivate" :reassigned.sync="resData" :assays="assays" :vendors="vendors"/>
    </template>
  </popup>
</template>

<script>
import { mapState } from 'vuex'
import Deactivation from './Deactivation'

export default {
  props: [
    'formTitle',
    'dataInfo',
    'assays',
    'vendors',
    'reassigned'
  ],

  components: {
    Deactivation
  },

  data () {
    return {
      deactivate: false,
      deactivationText: ''
    }
  },

  watch: {
    data (value) {
      if (this.hasData(value)) {
        if (value.hasOwnProperty('catalogNumber')) {
          // is item
          this.deactivationText = 'Item'
        } else if (value.hasOwnProperty('weeklyVolume')) {
          // is assay
          this.deactivationText = 'Assay'
        } else {
          // is vendor
          this.deactivationText = 'Vendor'
        }
      }
    }
  },

  computed: {
    ...mapState([
      'admin',
      'user'
    ]),

    resData: {
      get () {
        return this.reassigned
      },

      set (value) {
        this.$emit('update:reassigned', value)
      }
    },

    data: {
      get () {
        return this.dataInfo
      },

      set (value) {
        this.$emit('update:dataInfo', value)
      }
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
