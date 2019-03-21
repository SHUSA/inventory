<template>
  <div>
    <error :response="response"/>
    <v-dialog
      v-model="resetDialog"
      width="500px"
    >
      <popup :title="`Reset ${targetUser.username}?`">
        <v-card-actions slot="content">
          <v-spacer/>
          <v-btn flat color="error" @click="resetDialog = false">No</v-btn>
          <v-btn flat color="primary" @click="reset(targetUser)">Yes</v-btn>
        </v-card-actions>
      </popup>
    </v-dialog>
    <!-- user management dialog -->
    <v-dialog
      v-model="manageDialog"
      width="800px"
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
              <td>
                <v-select
                  v-model="props.item.DepartmentId"
                  :items="departments"
                  item-text="name"
                  item-value="id"
                  :loading="loading[props.item.id]"
                  @change="updateUser(props.item)"
                />
              </td>
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
              <td>
                <v-btn small @click="openResetDialog(props.item)">
                  Reset
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
import { mapState } from 'vuex'
import AuthenticationService from '@/services/AuthenticationService.js'
import DepartmentService from '@/services/DepartmentService.js'

export default {
  props: [
    'dialog'
  ],

  data () {
    return {
      response: '',
      resetDialog: false,
      roles: [],
      departments: [],
      users: [],
      targetUser: {},
      headers: [
        { text: 'Username', sortable: false },
        { text: 'Department', sortable: false },
        { text: 'Role', sortable: false },
        { text: 'Password Reset', sortable: false }
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
        this.targetUser = {}
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
        this.departments = this.$clonedeep((await DepartmentService.index()).data)
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
        let origDept = this.departments.find(dept => dept.name === data.Department.name)
        data.Role.id = origId
        data.DepartmentId = origDept
      }
    },

    openResetDialog (data) {
      this.targetUser = data
      this.resetDialog = true
    },

    async reset (data) {
      this.loading[data.id] = true
      this.response = await AuthenticationService.reset(data)
      this.loading[data.id] = false
      if (this.response.status === 200) {
        // merge received data into users
        this.resetDialog = false
        data.role = false
        data = this.$clonedeep(this.response.data)
        this.$store.dispatch('setSnack', {
          text: `${data.username} reseted`,
          color: 'warning',
          icon: 'fa-user'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
