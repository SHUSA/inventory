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
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs6 v-for="(info, index) in info" :key="index">
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
          icon: null,
          text: 'Weekly Volume',
          call: this.assay.weeklyVolume
        },
        {
          icon: null,
          text: null,
          call: null
        },
        {
          icon: null,
          text: 'Runs per Week',
          call: this.assay.weeklyRuns
        },
        {
          icon: null,
          text: 'Controls per Run',
          call: this.assay.controlsPerRun
        },
        {
          icon: null,
          text: 'Max Batch Size',
          call: this.assay.maxBatchSize
        },
        {
          icon: null,
          text: 'Sample Replicates',
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
