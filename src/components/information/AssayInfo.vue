<template>
  <div>
    <v-dialog
      v-model="assayInfoDialog"
      max-width="400px"
    >
      <info-card :data="assay" :info="info">
      </info-card>
    </v-dialog>
  </div>
</template>

<script>
import InfoCard from './InfoCard'

export default {
  props: [
    'assay',
    'dialog'
  ],

  components: {
    InfoCard
  },

  data () {
    return {
      info: [
        {
          icon: 'fa-calendar-week',
          text: 'Volume',
          tooltip: 'Weekly Volume',
          call: this.assay.weeklyVolume
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
          call: this.assay.weeklyRuns
        },
        {
          icon: 'fab fa-nintendo-switch',
          text: '/ Run',
          tooltip: 'Controls per Run',
          call: this.assay.controlsPerRun
        },
        {
          icon: 'fa-boxes',
          text: 'Max Size',
          tooltip: 'Max Batch Size',
          call: this.assay.maxBatchSize
        },
        {
          icon: 'fa-vials',
          text: 'Replicates',
          tooltip: 'Sample Replicates',
          call: this.assay.sampleReplicates
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
    }
  }
}
</script>

<style scoped>
</style>
