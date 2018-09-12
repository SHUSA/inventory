<template>
  <v-card>
    <v-card-title>{{assayInfo.name}}</v-card-title>
    <v-divider/>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs3 fill-height justify-center>
          <v-chip label color="light-blue lighten-1" class="label" small>Max Batch Size</v-chip>
        </v-flex>
        <v-flex xs3 class="dashed-border pa-2 text-xs-right">
          {{assayInfo.maxBatchSize}}
        </v-flex>

        <v-flex xs3 fill-height justify-center>
          <v-chip label color="light-blue lighten-1" class="label" small></v-chip>
        </v-flex>
        <v-flex xs3 class="dashed-border pa-2 text-xs-right">
          {{assayInfo.weeklyVolume}}
        </v-flex>

        <v-flex xs3 fill-height justify-center>
          <v-chip label color="light-blue lighten-1" class="label" small></v-chip>
        </v-flex>
        <v-flex xs3 class="dashed-border pa-2 text-xs-right">
          {{assayInfo.controlsPerRun}}
        </v-flex>

        <v-flex xs3 fill-height justify-center>
          <v-chip label color="light-blue lighten-1" class="label" small></v-chip>
        </v-flex>
        <v-flex xs3 class="dashed-border pa-2 text-xs-right">
          {{assayInfo.weeklyRuns}}
        </v-flex>

        <v-flex xs3 fill-height justify-center>
          <v-chip label color="light-blue lighten-1" class="label" small></v-chip>
        </v-flex>
        <v-flex xs3 class="dashed-border pa-2 text-xs-right">
          {{assayInfo.sampleReplicates}}
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'assayInfo'
    ])
  }
}
</script>

<style scoped>
  .box {
    min-width: 25%;
  }

  .label {
    width: 95%;
  }

  .dashed-border:after {
    content: "";
    display: block;
    width: 105%;
    float: right;
    border-bottom: 1px dotted gray;
  }
</style>
