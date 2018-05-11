<template>
  <v-layout mt-5>
    <v-flex xs6>
      <v-list>
        <v-list-tile v-for="item in left" :key="item.label">
          <v-flex xs6 class="text-xs-center">
            <v-chip label disabled>{{item.label}}</v-chip>
          </v-flex>
          <v-flex xs4 class="text-xs-right dashed-border">
            {{item.description}}
          </v-flex>           
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-flex xs6>
      <v-list>
        <v-list-tile v-for="item in right" :key="item.label">
          <v-flex xs6>
            <v-chip label disabled>{{item.label}}</v-chip>
          </v-flex>
          <v-flex xs4 class="text-xs-right dashed-border">
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
        { label: 1, description: 2 },
        { label: 1, description: 2 },
        { label: 1, description: 2 },
        { label: 1, description: 2 },
        { label: 1, description: 2 }
      ],
      right: [
        { label: 3, description: 4 },
        { label: 3, description: 4 },
        { label: 3, description: 4 },
        { label: 3, description: 4 }
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
    /* width: 100%; */
  }
</style>
