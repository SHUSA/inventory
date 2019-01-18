<template>
  <v-card>
    <v-card-title :class="'title ' + titleStyle">
      {{title}}
    </v-card-title>
    <v-divider/>
    <slot name="content"/>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    titleStyle: {
      type: String,
      default: 'blue lighten-2'
    }
  }
}
</script>

<style scoped>

</style>
