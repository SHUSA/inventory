<template>
  <v-layout>
    <v-flex xs6>
      <v-list>
        <v-list-tile v-for="item in left" :key="item.label">
          <v-flex xs5>
            <v-chip small disabled>{{item.label}}</v-chip>
          </v-flex>
          <v-flex xs5 class="text-xs-right dashed-border">
            {{item.description}}
          </v-flex>
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-flex xs6>
      <v-list>
        <v-list-tile v-for="item in right" :key="item.label">
          <v-flex xs5>
            <v-chip small disabled>{{item.label}}</v-chip>
          </v-flex>
          <v-flex xs5 class="text-xs-right dashed-border">
            {{item.description}}
          </v-flex>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      left: [
        { label: 'Assay', description: 2 },
        { label: 'Catalog #', description: 2 },
        { label: 'Item Description', description: 2 },
        { label: 'Reactions per Item', description: 2 }
      ],
      right: [
        { label: 'On Hand', description: 4 },
        { label: 'Lead Time Days', description: 4 },
        { label: 'Safety Stock', description: 4 },
        { label: 'Safety Weeks', description: 4 },
        { label: 'Reorder Point', description: 4 },
        { label: 'Reorder Weeks', description: 4 },
        { label: 'Reorder Quantity', description: 4 }
      ]
    }
  }
}
</script>

<style scoped>
  .dashed-border:after {
    content: "";
    display: block;
    width: 105%;
    float: right;
    border-bottom: 1px dashed gray;
  }

  .chip {
    width: 100%;
    text-align: center;
  }

</style>
