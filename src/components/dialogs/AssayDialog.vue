<template>
  <v-dialog
    v-model="assayDialog"
    max-width="500px"
    @keydown.enter="saveAssay"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{assayForm}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs6>
              <v-text-field v-model="editedAssay.name" :rules="[rules.assay]" label="Name" required/>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="editedAssay.weeklyVolume" ref="weeklyVolume" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Weekly Volume"/>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="editedAssay.weeklyRuns" ref="weeklyRuns" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Runs per Week"/>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="editedAssay.controlsPerRun" ref="controlsPerRun" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Controls per Run"/>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="editedAssay.maxBatchSize" ref="maxBatchSize" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Max Batch Size"/>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="editedAssay.sampleReplicates" ref="sampleReplicates" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Sample Replicates"/>
            </v-flex>
            <v-flex xs12>
              <v-alert
                :value="alert"
                type="error"
              >
                {{alertMessage}}
              </v-alert>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-progress-circular indeterminate color="primary" v-if="loading"/>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="saveAssay">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
