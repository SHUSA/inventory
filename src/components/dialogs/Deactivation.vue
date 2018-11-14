<template>
  <v-dialog
    v-model="deactivationDialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Deactivate {{currentItem.name}}?</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" flat @click="deactivationDialog = false">No</v-btn>
        <v-btn color="red darken-1" flat @click="deactivateItem(currentItem)">Yes</v-btn>
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
