<template>
  <div>
    <error :response="response"/>
    <v-dialog
      v-model="manageDialog"
      width="500px"
    >
      <popup title="Department Management">
        <template slot="content">
          <v-divider/>
          <v-data-table
            :items="departments"
            :headers="headers"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <td>{{props.item.name}}</td>
              <td class="pa-0 ma-0">
                <v-btn flat small
                  class="pa-0 ma-0"
                  :color="props.item.active ? '' : 'error'"
                  @click="save(props.item)"
                >
                  {{props.item.active}}
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </template>
      </popup>
    </v-dialog>
  </div>
</template>

<script>
import DepartmentService from '@/services/DepartmentService.js'

export default {
  props: [
    'dialog'
  ],

  data () {
    return {
      response: '',
      departments: [],
      headers: [
        { text: 'Name', sortable: false },
        { text: 'Active', sortable: false }
      ]
    }
  },

  mounted () {
    this.initialize()
  },

  watch: {
    manageDialog (val) {
      if (val) {
        this.initialize()
      }
    }
  },

  computed: {
    manageDialog: {
      get () {
        return this.dialog
      },

      set (val) {
        this.$emit('update:dialog', val)
      }
    }
  },

  methods: {
    async initialize () {
      this.response = await DepartmentService.index([], [true, false])
      if (this.response.status === 200) {
        this.departments = this.$clonedeep(this.response.data)
      }
    },

    async save (data) {
      data.active = !data.active
      this.response = await DepartmentService.put(data)
      if (this.response.status === 200) {
        this.$store.dispatch('setSnack', {
          text: `${data.name} updated`,
          color: 'info',
          icon: 'fa-archive'
        })
      } else {
        data.active = !data.active
      }
    }
  }
}
</script>

<style scoped>

</style>
