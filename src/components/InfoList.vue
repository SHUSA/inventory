<template>
  <v-card>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs2 v-for="(item, index) in list" :key="item.name">
          <v-chip label>{{index}} - {{item.name}}</v-chip>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: [
    'list'
  ]
}
</script>

<style scoped>

</style>
