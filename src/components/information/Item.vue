<template>
  <v-card>
    <v-card-title primary-title class="pb-0">
      <h3 class="headline mb-0">{{itemInfo.name}}</h3>
      <v-chip v-if="checkQuantity" color="red lighten-3" small>QTY: {{itemInfo.currentStock}}</v-chip>
      <v-chip v-else color="blue lighten-3" small>QTY: {{itemInfo.currentStock}}</v-chip>
    </v-card-title>
    <v-subheader>{{itemInfo.assay}} - {{itemInfo.vendor}} - Catalog #{{itemInfo.catalogNumber}}</v-subheader>
    <v-card-text>
      <v-container fill-height grid-list-md>
        <v-card flat color="transparent" class="box">
          <v-card-text class="pa-0" v-if="itemInfo.itemDescription">Description: {{itemInfo.itemDescription}}</v-card-text>
          <v-card-text class="pa-0" v-else>No description.</v-card-text>
        </v-card>
      </v-container>
      <v-divider/>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs3 fill-height justify-center>
            <v-chip label color="light-blue lighten-1" class="label" small>Reactions per Item</v-chip>
          </v-flex>
          <v-flex class="dashed-border pa-2 text-xs-right" xs3>
            {{itemInfo.reactionsPerItem}}
          </v-flex>

          <v-flex xs3 fill-height justify-center>
            <v-chip label color="light-blue lighten-1" class="label" small>Lead Time Days</v-chip>
          </v-flex>
          <v-flex class="dashed-border pa-2 text-xs-right" xs3>
            {{itemInfo.leadTimeDays}}
          </v-flex>

          <v-flex xs3 fill-height justify-center>
            <v-chip label color="light-blue lighten-1" class="label" small>Weeks of Safety Stock</v-chip>
          </v-flex>
          <v-flex class="dashed-border pa-2 text-xs-right" xs3>
            {{itemInfo.weeksOfSafetyStock}}
          </v-flex>

          <v-flex xs3 fill-height justify-center>
            <v-chip label color="light-blue lighten-1" class="label" small>Safety Stock</v-chip>
          </v-flex>
          <v-flex class="dashed-border pa-2 text-xs-right" xs3>
            {{itemInfo.safetyStock}}
          </v-flex>

          <v-flex xs3 fill-height justify-center>
            <v-chip label color="light-blue lighten-1" class="label" small>Weeks of Reorder</v-chip>
          </v-flex>
          <v-flex class="dashed-border pa-2 text-xs-right" xs3>
            {{itemInfo.weeksOfReorder}}
          </v-flex>

          <v-flex xs3 fill-height justify-center>
            <v-chip label color="light-blue lighten-1" class="label" small>Reorder Quantity</v-chip>
          </v-flex>
          <v-flex class="dashed-border pa-2 text-xs-right" xs3>
            {{itemInfo.reorderQuantity}}
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'itemInfo'
    ]),

    checkQuantity () {
      return this.itemInfo.currentStock < this.itemInfo.reorderPoint
    }
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
