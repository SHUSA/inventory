<template>
  <div>
    <error :response="response"/>
    <!-- login dialog -->
    <v-dialog
      v-model="dialog"
      width="500px"
      @keydown.enter="validateData()"
    >
      <popup title="Login">
        <template slot="content">
          <v-form ref="form" v-model="form" lazy-validation>
            <v-container>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Username/Email"
                    validate-on-blur
                    v-model.trim="credentials.username"
                    :rules=[rules.text]
                    clearable
                  />
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Password"
                    validate-on-blur
                    v-model.trim="credentials.password"
                    type="password"
                    autocomplete="off"
                    :rules=[rules.text]
                    clearable
                    :hint="hint"
                    :persistent-hint="persistentHint"
                  />
                </v-flex>
                <!-- alert -->
                <v-flex xs12>
                  <v-alert
                    :value="alert"
                    type="error"
                  >
                    {{alertMessage}}
                  </v-alert>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-card-actions>
            <v-spacer/>
            <v-progress-circular indeterminate color="primary" v-if="loading"/>
            <v-btn flat color="error" @click="close()">Cancel</v-btn>
            <v-btn flat color="primary" @click="validateData()">Submit</v-btn>
          </v-card-actions>
        </template>
      </popup>
    </v-dialog>

    <!-- user login -->
    <v-dialog
      v-model="userDialog"
      width="500px"
    >
      <popup title="User Login">
        <template slot="content">
          <span v-for="dept in departments" :key="dept.id">
            <v-btn flat @click="login(dept)">{{dept.name}}</v-btn>
          </span>
        </template>
      </popup>
    </v-dialog>

    <!-- choose login -->
    <v-layout>
      <v-spacer/>
      <v-flex xs8>
        <v-card>
          <v-card-title>
            <h3 class="headline">Choose your login</h3>
          </v-card-title>
          <v-card-actions>
            <!-- to do: change menu to dialog with all departments -->
            <v-btn flat @click="userDialog = true">User</v-btn>
            <v-btn flat @click="dialog = true">Admin</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-spacer/>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AuthenticationService from '@/services/AuthenticationService.js'
import DepartmentService from '@/services/DepartmentService.js'

export default {
  data () {
    return {
      userDialog: false,
      dialog: false,
      alert: false,
      loading: false,
      form: true,
      count: 0,
      hint: '',
      response: '',
      departments: [],
      persistentHint: false,
      alertMessage: '',
      credentials: {
        username: '',
        password: ''
      },
      rules: {
        text (val) {
          if (val) {
            return val.length > 0 ? true : ''
          } else {
            return ''
          }
        }
      }
    }
  },

  async mounted () {
    let initial = 'menu'
    // this.$store.dispatch('resetAll')
    this.$store.dispatch('setTitle', initial)
    this.response = await DepartmentService.index(['id', 'name'])
    if (this.response.status === 200) {
      this.departments = this.$clonedeep(this.response.data)
    }
  },

  watch: {
    dialog (val) {
      return val || this.close()
    }
  },

  computed: {
    ...mapState([
      'user',
      'pageTitle'
    ])
  },

  methods: {
    close () {
      this.dialog = false
      this.loading = false
      setTimeout(() => {
        this.hint = ''
        this.persistentHint = false
        this.alert = false
        this.username = ''
        this.password = ''
      }, 300)
    },

    validateData () {
      const msg = 'Please complete the form'
      this.$validate.form(this, msg)
    },

    setUserData (data) {
      this.count = 0
      this.persistentHint = false
      // success
      // set store values and load index component
      this.$store.dispatch('setToken', data.token)
      this.$store.dispatch('setUser', data.user)
      this.$store.dispatch('setSettings', data.user)
      this.$store.dispatch('setInventoryTitle', data.user.Department.name)
      this.close()
      this.$router.push({
        name: 'index'
      })
    },

    async login (dept = null) {
      if (dept) {
        // user
        this.response = await AuthenticationService.userLogin(dept)

        if (this.response.status === 200) {
          this.setUserData(this.response.data)
        }
      } else {
        // check credentials
        this.response = await AuthenticationService.login(this.credentials)

        if (this.response.status === 200) {
          this.setUserData(this.response.data)
        } else {
          // failure
          this.count++
          if (this.count === 3) {
            this.hint = this.response.data.hint || ''
            this.persistentHint = true
            this.count = 0
          }
          this.alertMessage = this.response.data.error
          this.loading = false
          this.alert = true
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
