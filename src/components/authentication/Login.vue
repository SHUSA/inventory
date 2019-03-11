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
                <!-- forgot password -->
                <!-- <v-flex xs12 class="py-0">
                  <a class="grey--text">Forgot Password?</a>
                </v-flex> -->
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

    <!-- register -->
    <v-dialog
      v-model="registerDialog"
      width="500px"
    >
      <popup title="Registration">
        <template slot="content">
          <v-form ref="regForm" v-model="regForm" lazy-validation>
            <v-container grid-list-md>
              <v-layout row wrap>
                <!-- to do: add v-flex and rules -->
                <v-flex xs12>
                  <!-- username -->
                  <v-text-field
                    label="Username"
                    validate-on-blur
                    v-model.trim="registration.username"
                    clearable
                    :rules="[rules.text]"
                    :error-messages="usernameError"
                    persistent-hint
                    required
                  />
                </v-flex>
                <!-- email -->
                <v-flex xs12>
                  <v-text-field
                    label="Email"
                    validate-on-blur
                    v-model.trim="registration.email"
                    clearable
                    :error-messages="emailError"
                    :rules="[rules.text]"
                    required
                  />
                </v-flex>
                <v-flex xs12>
                  <!-- department -->
                  <v-combobox
                    v-model="registration.department"
                    :items="departments"
                    item-text="name"
                    item-value="name"
                    :return-object="false"
                    :search-input.sync="search"
                    label="Department"
                    hint="Join an existing department or create a new one"
                    persistent-hint
                    validate-on-blur
                    :rules="[rules.department]"
                  >
                    <template v-slot:no-data>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-combobox>
                </v-flex>
                <v-flex xs12>
                  <!-- password -->
                  <v-text-field
                    label="Password"
                    validate-on-blur
                    v-model.trim="registration.password"
                    clearable
                    :rules="[rules.text]"
                    :error-messages="passwordError"
                    type="password"
                    autocomplete="off"
                    required
                  />
                </v-flex>
                  <v-flex xs12>
                  <!-- password confirm -->
                  <v-text-field
                    label="Confirm Password"
                    validate-on-blur
                    v-model.trim="registration.confirmPassword"
                    clearable
                    :rules="[rules.text]"
                    type="password"
                    autocomplete="off"
                    required
                  />
                  </v-flex>
                  <!-- alert -->
                  <v-flex xs12>
                    <v-alert
                      :value="regAlert"
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
            <v-btn flat color="primary" @click="validateData('regForm')">Submit</v-btn>
          </v-card-actions>
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
            <v-btn flat @click="userDialog = true">User</v-btn>
            <v-btn flat @click="dialog = true">Admin</v-btn>
          </v-card-actions>
          <v-divider/>
          <v-card-text class="caption pl-0 pt-0 pb-1">
            <v-btn small flat class="text-capitalize" @click="registerDialog = true">
              Register
            </v-btn>
          </v-card-text>
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
      registerDialog: false,
      dialog: false,
      alert: false,
      regAlert: false,
      loading: false,
      form: true,
      regForm: true,
      count: 0,
      hint: '',
      response: '',
      search: null,
      usernameError: '',
      emailError: '',
      passwordError: '',
      departments: [],
      persistentHint: false,
      alertMessage: '',
      credentials: {
        username: '',
        password: ''
      },
      registration: {
        username: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        text (val) {
          return val.length > 0 ? true : 'Required'
        },
        department (val) {
          return val.length > 0 ? true : 'Please enter or select a department'
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
      this.registerDialog = false
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

    validateData (formRef = 'form') {
      const msg = 'Please complete the form'
      this.$validate.form(this, msg, formRef)
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

    async register () {
      if (this.registration.password !== this.registration.confirmPassword) {
        this.alertMessage = 'Passwords do not match'
        this.alert = true
        return
      }
      this.response = await AuthenticationService.register(this.registration)
      if (this.response.status === 200) {
        // data is good, login
        this.setUserData(this.response.data)
      } else if (this.response.status === 400) {
        // bad registration, assign error messages
        this.usernameError = this.response.data.usernameError || ''
        this.emailError = this.response.data.emailError || ''
        this.passwordError = this.response.data.passwordError || ''
        this.alertMessage = 'Errors in registration. Please fix.'
        this.loading = false
        this.regAlert = true
      }
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
