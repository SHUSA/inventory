<template>
  <div>
    <error :response="response"/>
    <!-- settings dialog -->
    <v-dialog
      v-model="settingsDialog"
      width="500px"
      @keydown.enter="validateData()"
    >
      <popup title="Settings">
        <template slot="content">
          <v-form ref="form" v-model="form" lazy-validation>
            <v-container>
              <v-layout row wrap>
                <v-flex xs12 class="subheading">
                  User Information
                  <v-icon small>fa-edit</v-icon>
                  <v-divider/>
                </v-flex>
                <!-- username -->
                <v-flex xs6>
                  <v-text-field
                    v-model.trim="editedSettings.username"
                    label="Username"
                    clearable
                    validate-on-blur
                    :rules=[rules.text]
                    required
                  />
                </v-flex>
                <!-- email -->
                <v-flex xs6>
                  <v-text-field
                    v-model.trim="editedSettings.email"
                    label="Email"
                    validate-on-blur
                    :rules=[rules.text]
                    required
                  />
                </v-flex>
                <v-flex xs12 class="subheading">
                  Password
                  <v-icon small>fa-edit</v-icon>
                  <v-divider/>
                </v-flex>
                <!-- new password -->
                <v-flex xs6>
                  <v-text-field
                    v-model.trim="editedSettings.password"
                    label="New Password"
                    type="password"
                    autocomplete="off"
                    :rules="[rules.password]"
                    validate-on-blur
                  />
                </v-flex>
                <!-- confirm new password -->
                <v-flex xs6>
                  <v-text-field
                    v-model.trim="editedSettings.passwordConfirm"
                    label="Confirm Password"
                    type="password"
                    autocomplete="off"
                    :rules="[rules.password]"
                    validate-on-blur
                    ref="confirmPassword"
                  />
                </v-flex>
                <!-- password hint -->
                <v-flex xs6>
                  <v-text-field
                    v-model="editedSettings.passwordHint"
                    label="Password Hint"
                    validate-on-blur
                  />
                </v-flex>
                <template v-if="user.isAdmin || user.isSubAdmin">
                  <v-flex xs12 class="subheading">
                    Item Defaults
                    <v-icon small>fa-edit</v-icon>
                    <v-divider/>
                  </v-flex>
                  <!-- weeks of safety stock -->
                  <v-flex xs6>
                    <v-text-field
                      v-model.number="editedSettings.itemDefaults.weeksOfSafetyStock"
                      label="Weeks of Safety Stock"
                      validate-on-blur
                      :rules=[rules.wholeNumber]
                      required
                    />
                  </v-flex>
                  <!-- Lead Time Days -->
                  <v-flex xs6>
                    <v-text-field
                      v-model.number="editedSettings.itemDefaults.leadTimeDays"
                      label="Lead Time Days"
                      validate-on-blur
                      :rules=[rules.wholeNumber]
                      required
                    />
                  </v-flex>
                  <!-- weeks of reorder -->
                  <v-flex xs6>
                    <v-text-field
                      v-model.number="editedSettings.itemDefaults.weeksOfReorder"
                      label="Weeks of Reorder"
                      validate-on-blur
                      :rules=[rules.wholeNumber]
                      required
                    />
                  </v-flex>
                  <v-flex xs12 class="subheading">
                    Assay Defaults
                    <v-icon small>fa-edit</v-icon>
                    <v-divider/>
                  </v-flex>
                  <!-- weekly volume -->
                  <v-flex xs6>
                    <v-text-field
                      v-model.number="editedSettings.assayDefaults.weeklyVolume"
                      label="Weekly Volume"
                      validate-on-blur
                      :rules=[rules.wholeNumber]
                      required
                    />
                  </v-flex>
                  <!-- weekly runs -->
                  <v-flex xs6>
                    <v-text-field
                      v-model.number="editedSettings.assayDefaults.weeklyRuns"
                      label="Weekly Runs"
                      validate-on-blur
                      :rules=[rules.wholeNumber]
                      required
                    />
                  </v-flex>
                  <!-- controls per run -->
                  <v-flex xs6>
                    <v-text-field
                      v-model.number="editedSettings.assayDefaults.controlsPerRun"
                      label="Controls per Run"
                      validate-on-blur
                      :rules=[rules.wholeNumber]
                      required
                    />
                  </v-flex>
                </template>
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
          <v-divider/>
          <v-card-actions>
            <v-spacer/>
            <v-progress-circular indeterminate color="primary" v-if="loading"/>
            <v-btn flat color="error" @click="settingsDialog = false">Close</v-btn>
            <v-btn flat color="primary" @click="validateData()">Save</v-btn>
          </v-card-actions>
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
      form: true,
      settings: [],
      response: '',
      loading: false,
      alert: false,
      alertMessage: '',
      rules: {
        wholeNumber: (val) => {
          return val !== null && val >= 0 && Number.isInteger(val) ? true : 'Please enter an integer'
        },
        text (val) {
          if (val) {
            return val.length > 0 ? true : ''
          } else {
            return ''
          }
        },
        password (val) {
          return val.length >= 8 || val.length === 0 || 'New password must be at least 8 characters long'
        }
      },
      editedSettings: {
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        passwordHint: '',
        department: '',
        itemDefaults: {
          weeksOfSafetyStock: 4,
          leadTimeDays: 7,
          weeksOfReorder: 4
        },
        assayDefaults: {
          weeklyVolume: 0,
          weeklyRuns: 0,
          controlsPerRun: 0
        }
      },
      defaultSettings: {
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        passwordHint: '',
        department: '',
        itemDefaults: {
          weeksOfSafetyStock: 4,
          leadTimeDays: 7,
          weeksOfReorder: 4
        },
        assayDefaults: {
          weeklyVolume: 0,
          weeklyRuns: 0,
          controlsPerRun: 0
        }
      }
    }
  },

  watch: {
    settingsDialog (val) {
      if (val) {
        for (let key in this.itemDefaults) {
          this.editedSettings.itemDefaults[key] = this.user.itemDefaults[key]
        }
        for (let key in this.assayDefaults) {
          this.editedSettings.assayDefaults[key] = this.user.assayDefaults[key]
        }
        for (let key in this.user) {
          // prevent cloning reference from store
          if (key === 'itemDefaults' || key === 'assayDefaults') {
            continue
          }
          this.editedSettings[key] = this.user[key]
        }
      } else {
        this.close()
      }
    }
  },

  computed: {
    ...mapState([
      'user'
    ]),

    settingsDialog: {
      get () {
        return this.dialog
      },

      set (val) {
        this.$emit('update:dialog', val)
      }
    }
  },

  methods: {
    validateData () {
      if (this.editedSettings.password !== this.editedSettings.passwordConfirm) {
        this.alertMessage = 'Passwords do not match'
        this.alert = true
        return
      }
      this.editedSettings.passwordHint = this.editedSettings.passwordHint || ''
      this.$validate.form(this)
    },

    async save () {
      this.response = await AuthenticationService.userUpdate(this.editedSettings)

      if (this.response.status === 200) {
        let data = this.response.data
        this.$store.dispatch('setToken', data.token)
        this.$store.dispatch('setUser', data.user)
        this.$store.dispatch('setSettings', data.user)
      }

      if (!this.alert && this.response.status === 200) {
        this.loading = false
        this.$store.dispatch('setSnack', {
          text: 'User data updated',
          color: 'success',
          icon: 'fa-user'
        })
        this.settingsDialog = false
      }
    },

    close () {
      setTimeout(() => {
        this.loading = false
        this.alert = false
        this.editedSettings = Object.assign({}, this.defaultSettings)
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
