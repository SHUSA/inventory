<template>
  <v-card>
    <v-list>

    </v-list>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import orderService from '@/services/OrderService.js'
import Order from './Order'

export default {
  data () {
    return {
      orders: []
    }
  }, 
  async mounted () {
    this.orders = (await orderService.index()).data
  }
}
</script>

<style scoped>

</style>
