<template>
  <panel :info="info">
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
  </panel>
</template>

<script>
export default {
  data () {
    return {
      info: {
        title: 'assay title',
        assay: 'assay name'
      },
      left: [
        { label: 'Weekly Volume', description: 2 },
        { label: 'Weekly Runs', description: 2 }
      ],
      right: [
        { label: 'Controls per Run', description: 4 },
        { label: 'Max Batch Size', description: 4 },
        { label: 'Sample Repetitions', description: 4 }
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
