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
          <v-chip v-if="props.item.active" color="teal" label @click="getInfo(props.item)">{{props.item.name}}</v-chip>
          <v-chip v-else color="red" label @click="getInfo(props.item)">{{props.item.name}}</v-chip>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: [
    'list',
    'getInfo'
  ],
  data () {
    return {
      search: ''
    }
  },
  watch: {
    list () {
      // for testing; to verify information
      console.log(this.list)
    }
  },
  computed: {
    // to fix
    filteredItems () {
      let regexp = new RegExp(this.search, 'gi')
      return this.list.filter(x => {
        // do search vs name or active
        if (x.name.match(regexp) || x.active.match(regexp)) {
          return x
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
