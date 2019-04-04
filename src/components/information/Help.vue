<template>
  <popup title="Help" titleStyle="transparent">
    <v-expansion-panel slot="content">
      <v-expansion-panel-content>
        <div slot="header">Updates</div>
        <update/>
      </v-expansion-panel-content>
      <v-expansion-panel-content>
        <div slot="header">Formula</div>
        <v-card color="grey lighten-3">
          <v-card-text>
              <p>weeklyUse = (weeklyVolume + weeklyRuns * controlsPerRun) / reactionsPerItem</p>
              <p>baseStock = weeklyUse * baseWeeks</p>
              <p>safetyStock = ceil(weeklyUse * weeksOfSafetyStock * 100) / 100</p>
              <p>leadTimeUsage = weeklyUse * leadTimeDays / 7</p>
              <p>reorderPoint = ceil((leadTimeUsage + safetyStock + baseStock) * 100) / 100</p>
              <p>reorderQuantity = ceil(weeklyUse * weeksOfReorder)</p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </popup>
</template>

<script>
import Update from './Update'

export default {
  components: {
    Update
  }
}
</script>

<style scoped>

</style>
