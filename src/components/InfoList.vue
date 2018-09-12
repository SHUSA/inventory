<template>
  <v-card>
    <v-card-title>
      <!-- button for spacer -->
      <v-btn flat disabled value="false"/>
      <v-spacer/>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        clearable
        single-line
        hide-details
      />
    </v-card-title>
    <v-container grid-list-md>
      <v-data-iterator
        :items="list"
        :search="search"
        content-tag="v-layout"
        hide-actions
        row
        wrap
      >
        <v-flex
          slot="item"
          slot-scope="props"
          xs2
        >
          <v-chip v-if="props.item.active" color="teal" label>{{props.item.name}}</v-chip>
          <v-chip v-else color="red" label>{{props.item.name}}</v-chip>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: [
    'list'
  ],
  data () {
    return {
      search: ''
    }
  }
}
</script>

<style scoped>

</style>
