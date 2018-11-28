<template>
  <v-layout>
    <v-fab-transition>
      <v-btn v-scroll="onScroll" v-show="goUp" @click="goToTop" fixed bottom small right fab color="blue">
        <v-icon color="white">fa-angle-double-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <!-- <v-fab-transition>
      <v-btn v-scroll="onScroll" v-show="goDown" @click="goToBottom" fixed bottom small right fab color="red">
        <v-icon color="white">fa-angle-double-down</v-icon>
      </v-btn>
    </v-fab-transition> -->
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      goUp: false,
      goDown: true
    }
  },

  methods: {
    onScroll () {
      // clientHeight + scrollTop = scrollHeight (at most)
      let top = document.documentElement.scrollTop
      this.goUp = top > 200
      // this.goDown = top <= 210 && top > 100
    },

    goToTop () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },

    goToBottom () {
      window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>

</style>
