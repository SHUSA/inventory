<template>
  <div>
    <!-- item cards -->
    <!-- needs to maximize information in a small space -->
    <!-- originally tested in Order.vue -->
    <v-container fluid grid-list-md>
      <v-data-iterator
        :items="items"
        content-tag="v-layout"
        row
        wrap
      >
        <v-flex
          slot="item"
          slot-scope="props"
          xs2
        >
          <!-- big card -->
          <v-card>
            <v-card-title class="title py-1">{{props.item.name}}</v-card-title>
            <v-card-text class="caption py-0">{{props.item.catalogNumber}} - {{props.item.vendor}} - {{props.item.assay}}</v-card-text>
            <v-divider/>
            <v-card-text class="py-1" v-if="props.item.itemDescription">{{props.item.itemDescription}}</v-card-text>
            <v-card-text class="py-1" v-else>No description</v-card-text>
            <v-divider/>
            <v-container class="py-0">
              <v-form>
                <v-text-field label="Stock" persistent-hint hint="Reorder amount: ${props.item.reorderQuantity}"></v-text-field>
                <v-textarea class="py-0" rows="2" no-resize label="Comment"></v-textarea>
              </v-form>
            </v-container>
          </v-card>
          <!-- mini card -->
          <v-card>
            <v-card-title class="title py-1">
              {{props.item.name}}
              <v-icon small>fa-info-circle</v-icon>
            </v-card-title>
            <v-flex xs5>
            </v-flex>
            <v-chip small>QTY: {{props.item.currentStock}}</v-chip>
            <v-icon small>fa-comment</v-icon>
            <v-card-text class="caption py-0">{{props.item.catalogNumber}} - {{props.item.vendor}} - {{props.item.assay}}</v-card-text>
          </v-card>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </div>  
</template>

<script>
export default {
  
}
</script>

<style scoped>

</style>
