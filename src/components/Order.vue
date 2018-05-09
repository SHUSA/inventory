<template>
  <v-data-table
    :headers="headers"
    :items="supplies"
    hide-actions
    class="mt-5"
  >
    <template slot="items" slot-scope="props">
      <td>{{props.item.name}}</td>
      <td>{{props.item.vendor}}</td>
      <td>{{props.item.catalogNumber}}</td>
      <td>{{props.item.description}}</td>
      <td>{{props.item.previousStock}}</td>
      <td>{{props.item.currentStock}}</td>
      <td>{{props.item.toOrder}}</td>
      <td>{{props.item.comment}}</td>
      <td>{{props.item.lastUpdate}}</td>      
    </template>
  </v-data-table>
</template>

<script>
const moment = require('moment')

export default {
  data () {
    return {
      headers: [
        {text: 'Item', value: 'name'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Cat#', value: 'catalogNumber'},
        {text: 'Description', value: 'description'},
        {text: 'Previous Stock', value: 'previousStock'},
        {text: 'Current Stock', value: 'currentStock'},
        {text: 'To Order', value: 'toOrder'},
        {text: 'Comment', value: 'comment'},
        {text: 'Last Update', value: 'lastUpdate'}
      ],
      supplies: [
        {
          value: false,
          name: 'name',
          vendor: 'vendor',
          catalogNumber: '0123456789',
          description: '9999 cases',
          previousStock: 999999,
          currentStock: 0,
          toOrder: 1,
          comment: 'enter your comment in this field for further clarification',
          lastUdate: moment().format('MMM-DD-YYYY HH:mm:ss')
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
