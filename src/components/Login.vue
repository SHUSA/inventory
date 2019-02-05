<template>
  <div>
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
                    autocomplete="foo"
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

    <!-- choose login -->
    <v-layout>
      <v-spacer/>
      <v-flex xs8>
        <v-card>
          <v-card-title>
            <h3 class="headline">Who are you?</h3>
          </v-card-title>
          <v-card-actions>
            <v-btn flat @click="login('user')">User</v-btn>
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

export default {
  data () {
    return {
      dialog: false,
      alert: false,
      loading: false,
      form: true,
      count: 0,
      hint: '',
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
    this.$store.dispatch('resetAll')
    this.$store.dispatch('setTitle', initial)
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
      if (this.$refs.form.validate()) {
        this.alert = false
        this.loading = true
        this.login()
      } else {
        this.alert = true
        this.alertMessage = 'Please complete the form'
      }
    },

    async login (type = null) {
      if (type) {
        // user
        this.persistentHint = false
        this.$store.dispatch('setUser', type)
        this.$router.push({
          name: 'index'
        })
      } else {
        // check credentials
        let response = null
        response = await AuthenticationService.login(this.credentials)

        if (response.status === 200) {
          let user = response.data.user

          this.count = 0
          this.persistentHint = false
          // success
          // set store values and load index component
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', user)
          this.$store.dispatch('setSettings', user)
          this.close()
          this.$router.push({
            name: 'index'
          })
        } else {
          // failure
          this.count++
          if (this.count === 3) {
            this.hint = response.data.hint || ''
            this.persistentHint = true
            this.count = 0
          }
          this.alertMessage = response.data.error
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
