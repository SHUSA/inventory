<template>
  <panel :info="info">
    <v-data-table
      :headers="headers"
      :items="supplies"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td>{{props.item.vendor}}</td>
        <td>{{props.item.catalogNumber}}</td>
        <td>{{props.item.description}}</td>
        <td>{{props.item.previousStock}}</td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.currentStock"
            lazy
          > {{props.item.currentStock}}
            <v-text-field
              slot="input"
              v-model="props.item.currentStock"
              label="Edit"
              single-line
              :rules=[rules.number]
              type="number"
              min=0
            />
          </v-edit-dialog>
        </td>
        <td>{{props.item.toOrder}}</td>
        <td>{{props.item.comment}}</td>
        <td>{{props.item.lastUpdate}}</td>
      </template>
    </v-data-table>
  </panel>
</template>

<script>
const moment = require('moment')

export default {
  data () {
    return {
      rules: {
        number: (v) => {
          return !isNaN(parseFloat(v)) || 'Please enter a number.'
        }
      },
      info: {
        title: 'user title'
      },
      headers: [
        {text: 'Item', value: 'name'},
        {text: 'Vendor', value: 'vendor'},
        {text: 'Catalog #', value: 'catalogNumber'},
        {text: 'Desc', value: 'description'},
        {text: 'Prev Stock', value: 'previousStock'},
        {text: 'Stock', value: 'currentStock'},
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
          lastUpdate: moment().format('MMM-DD-YYYY HH:mm:ss')
        }
      ]
    }
  },
  methods: {
    // keyhandler () {
    //   // clean this up
    //   const validChars = /[0-9]/

    //   document.addEventListener('keydown', event => {
    //     if (!event.key.match(validChars)) {
    //       event.preventDefault()
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
