<template>
  <v-layout>
    <!-- components -->
    <template v-if="pageTitle !== 'Menu'">
      <inventory v-if="pageTitle === 'inventory'"/>
      <order-index v-if="pageTitle === 'orders'"/>
    </template>
    <update v-else/>
    <!-- fab button -->
    <v-fab-transition>
      <v-btn v-scroll="onScroll" v-show="goUp" @click="goToTop" fixed bottom small right fab color="blue">
        <v-icon color="white">fa-angle-double-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-fab-transition>
      <v-btn v-scroll="onScroll" v-show="goDown" @click="goToBottom" fixed bottom small right fab color="red">
        <v-icon color="white">fa-angle-double-down</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import Inventory from './Inventory'
import OrderIndex from './order/OrderIndex'
import Update from './Update'

export default {
  components: {
    Inventory,
    OrderIndex,
    Update
  },

  data () {
    return {
      goUp: false,
      goDown: true
    }
  },

  mounted () {
    this.$store.dispatch('setTitle', 'Menu')
  },

  computed: {
    ...mapState([
      'user',
      'admin',
      'pageTitle'
    ])
  },

  methods: {
    onScroll () {
      this.goUp = document.documentElement.scrollTop > 210
      this.goDown = document.documentElement.scrollTop <= 210
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
