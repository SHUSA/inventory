<template>
  <div>
    <error :response="response"/>
    <!-- user management dialog -->
    <v-dialog
      v-model="manageDialog"
      width="500px"
    >
      <popup :title="`${user.department.name} Users`">
        <template slot="content">
          <v-divider/>
          <v-data-table
            :items="users"
            :headers="headers"
            hide-actions
          >
            <!-- allow change user role -->
            <template slot="items" slot-scope="props">
              <td>{{props.item.username}}</td>
              <td>{{props.item.Department.name}}</td>
              <td>
                <v-select
                  v-model="props.item.Role.id"
                  :items="roles"
                  item-text="name"
                  item-value="id"
                  :loading="loading[props.item.id]"
                  @change="updateUser(props.item)"
                />
              </td>
            </template>
          </v-data-table>
        </template>
      </popup>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthenticationService from '@/services/AuthenticationService.js'

export default {
  props: [
    'dialog'
  ],

  data () {
    return {
      response: '',
      roles: [],
      users: [],
      headers: [
        { text: 'Username', sortable: false },
        { text: 'Department', sortable: false },
        { text: 'Role', sortable: false }
      ],
      loading: {}
    }
  },

  mounted () {
    this.initialize()
  },

  watch: {
    manageDialog (val) {
      if (!val) {
        this.loading = {}
      } else {
        this.initialize()
      }
    }
  },

  computed: {
    ...mapState([
      'user'
    ]),

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
      this.response = await AuthenticationService.getUsers()
      if (this.response.status === 200) {
        this.users = this.$clonedeep(this.response.data.users)
        this.roles = this.$clonedeep(this.response.data.roles)
      }
    },

    async updateUser (data) {
      // update user role
      data.role = true
      this.loading[data.id] = true
      this.response = await AuthenticationService.userUpdate(data)
      this.loading[data.id] = false
      if (this.response.status === 200) {
        // merge received data into users
        data.role = false
        data = this.$clonedeep(this.response.data)
        this.$store.dispatch('setSnack', {
          text: `${data.username} updated`,
          color: 'info',
          icon: 'fa-user'
        })
      } else {
        let origId = this.roles.find(role => role.name === data.Role.name)
        data.Role.id = origId
      }
    }
  }
}
</script>

<style scoped>

</style>
