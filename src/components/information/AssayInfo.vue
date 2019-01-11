<template>
  <div>
    <v-dialog
      v-model="assayInfoDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="title pb-1">
          {{assay.name}}
        </v-card-title>
        <v-divider/>
        <v-card-text class="py-1">
          <v-layout row wrap>
            <v-flex xs6 v-for="(info, index) in info" :key="index">
              <v-tooltip left>
                <v-icon slot="activator" small>{{info.icon}}</v-icon>
                <span>{{info.tooltip}}</span>
              </v-tooltip>
              <span v-if="info.text">
                {{info.text}}
                <v-icon small>fa-caret-right</v-icon>
                {{info.call}}
              </span>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider/>
        <v-footer>
          <v-flex text-xs-center>
            Last Updated: {{time(assay)}}
          </v-flex>
        </v-footer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  props: [
    'assay',
    'dialog'
  ],

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
          text: 'Week',
          tooltip: 'Runs per Week',
          call: this.assay.weeklyRuns
        },
        {
          icon: 'fab fa-nintendo-switch',
          text: 'per Run',
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
  },

  methods: {
    time (assay) {
      return this.$moment(assay.updatedAt).format('MMM-DD-YYYY')
    }
  }
}
</script>

<style scoped>
</style>
