<template>
  <v-dialog
    v-model="assayInfoDialog"
    max-width="400px"
  >
    <assay-dialog
      :assayDialog.sync="assayDialog"
      :selectedAssay.sync="currentAssay"
      :itemList.sync="items"
      :assayNameList.sync="assayNames"
      :assayList.sync="assays"
      :assayIndex.sync="index"
      :editedItem="{}"
      :reassigned.sync="resData"
    />
    <info-card :data="assay" :assays="assays" :info="info" :reassigned.sync="resData">
      <template slot="actions">
        <v-spacer/>
        <v-tooltip left>
          <v-btn slot="activator" small flat @click="assayDialog = true">
            <v-icon>fa-edit</v-icon>
          </v-btn>
          <span>Edit</span>
        </v-tooltip>
      </template>
    </info-card>
  </v-dialog>
</template>

<script>
import InfoCard from './InfoCard'
import AssayDialog from '../dialogs/AssayDialog'

export default {
  props: [
    'assay',
    'itemList',
    'assayList',
    'reassigned',
    'dialog',
    'assayNameList',
    'assayIndex'
  ],

  components: {
    InfoCard,
    AssayDialog
  },

  data () {
    return {
      info: [],
      assayDialog: false
    }
  },

  watch: {
    currentAssay (value) {
      this.info = [
        {
          icon: 'fa-calendar-week',
          text: 'Volume',
          tooltip: 'Weekly Volume',
          call: value.weeklyVolume
        },
        {
          icon: null,
          text: null,
          call: null
        },
        {
          icon: 'fa-running',
          text: '/ Week',
          tooltip: 'Runs per Week',
          call: value.weeklyRuns
        },
        {
          icon: 'fab fa-nintendo-switch',
          text: '/ Run',
          tooltip: 'Controls per Run',
          call: value.controlsPerRun
        },
        {
          icon: 'fa-boxes',
          text: 'Max Size',
          tooltip: 'Max Batch Size',
          call: value.maxBatchSize
        },
        {
          icon: 'fa-vials',
          text: 'Replicates',
          tooltip: 'Sample Replicates',
          call: value.sampleReplicates
        }
      ]
    }
  },

  computed: {
    assayInfoDialog: {
      get () {
        return this.dialog
      },

      set (value) {
        if (!value) {
          this.$emit('update:dialog', false)
        }
      }
    },

    resData: {
      get () {
        return this.reassigned
      },

      set (value) {
        this.$emit('update:reassigned', value)
      }
    },

    index: {
      get () {
        return this.assayIndex
      },

      set (value) {
        this.$emit('update:assayIndex', value)
      }
    },

    currentAssay: {
      get () {
        return this.assay
      },

      set (value) {
        this.$emit('update:assay', value)
      }
    },

    assayNames: {
      get () {
        return this.assayNameList
      },

      set (value) {
        this.$emit('update:assayNameList', value)
      }
    },

    items: {
      get () {
        return this.itemList
      },

      set (value) {
        this.$emit('update:itemList', value)
      }
    },

    assays: {
      get () {
        return this.assayList
      },

      set (value) {
        this.$emit('update:assayList', value)
      }
    }
  }
}
</script>

<style scoped>
</style>
