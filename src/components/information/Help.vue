<template>
  <v-card>
    <v-card-title class="title">Help</v-card-title>
    <v-divider/>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header">Formula</div>
        <v-card color="grey lighten-3">
          <v-card-text>
              <p>weeklyUse = (weeklyVolume + weeklyRuns * controlsPerRun) / reactionsPerItem</p>
              <p>baseStock = weeklyUse * 4</p>
              <p>safetyStock = ceil(weeklyUse * weeksOfSafetyStock * 100) / 100</p>
              <p>leadTimeUsage = weeklyUse * leadTimeDays / 7</p>
              <p>reorderPoint = ceil((leadTimeUsage + safetyStock + baseStock) * 100) / 100</p>
              <p>reorderQuantity = ceil(weeklyUse * weeksOfReorder)</p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
