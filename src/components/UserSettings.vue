<template>
  <v-dialog
    v-model="settingsDialog"
    width="500px"
  >
    <popup title="Settings">
      <template slot="content">
        <v-form ref="form" v-model="form" lazy-validation>
          <v-container>
            <v-layout row wrap>
              <!-- username -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.username"
                  label="Username"
                  clearable
                />
              </v-flex>
              <!-- email -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.email"
                  label="Email"
                  clearable
                />
              </v-flex>
              <!-- new password -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.password"
                  label="New Password"
                  clearable
                  type="password"
                />
              </v-flex>
              <!-- confirm new password -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.passwordConfirm"
                  label="Confirm Password"
                  clearable
                  type="password"
                />
              </v-flex>
              <!-- password hint -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.passwordHint"
                  label="Password Hint"
                  clearable
                />
              </v-flex>
              <!-- Department Name -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.department.name"
                  label="Current Department"
                  clearable
                />
              </v-flex>
              <!-- weeks of safety stock -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.itemDefaults.weeksOfSafetyStock"
                  label="Weeks of Safety Stock"
                  clearable
                />
              </v-flex>
              <!-- Lead Time Days -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.itemDefaults.leadTimeDays"
                  label="Lead Time Days"
                  clearable
                />
              </v-flex>
              <!-- weeks of reorder -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.itemDefaults.weeksOfReorder"
                  label="Weeks of Reorder"
                  clearable
                />
              </v-flex>
              <!-- weekly volume -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.assayDefaults.weeklyVolume"
                  label="Weekly Volume"
                  clearable
                />
              </v-flex>
              <!-- weekly runs -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.assayDefaults.weeklyRuns"
                  label="Weekly Runs"
                  clearable
                />
              </v-flex>
              <!-- controls per run -->
              <v-flex xs6>
                <v-text-field
                  v-model="editedSettings.assayDefaults.controlsPerRun"
                  label="Controls per Run"
                  clearable
                />
              </v-flex>
              <!-- <v-flex xs12 v-for="(info, index) in settings" :key="index">
                <v-text-field
                  v-if="!objectDefaults(info.key)"
                  :label="info.title"
                  v-model="editedSettings[info.key]"
                />
              </v-flex> -->
            </v-layout>
          </v-container>
        </v-form>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat color="error" @click="close()">Close</v-btn>
          <v-btn flat color="primary">Save</v-btn>
        </v-card-actions>
      </template>
    </popup>
  </v-dialog>
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
      settingsInfo: {},
      settings: [],
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
        asssayDefaults: {
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
        asssayDefaults: {
          weeklyVolume: 0,
          weeklyRuns: 0,
          controlsPerRun: 0
        }
      }
    }
  },

  watch: {
    dialog (val) {
      this.settingsInfo = Object.assign({}, this.user)
      this.editedSettings = Object.assign(this.editedSettings, this.settingsInfo)
      // if (val) {
      //   this.settings = [
      //     {
      //       title: 'Username',
      //       key: 'username',
      //       val: this.settingsInfo.info.username
      //     },
      //     {
      //       title: 'Email',
      //       key: 'email',
      //       val: this.settingsInfo.info.email
      //     },
      //     {
      //       title: 'Password Hint',
      //       key: 'passwordHint',
      //       val: this.settingsInfo.info.passwordHint
      //     },
      //     {
      //       title: 'Department',
      //       key: 'department',
      //       val: this.settingsInfo.department
      //     },
      //     {
      //       title: 'Item Defaults',
      //       key: 'itemDefaults',
      //       val: this.settingsInfo.itemDefaults
      //     },
      //     {
      //       title: 'Assay Defaults',
      //       key: 'assayDefaults',
      //       val: this.settingsInfo.assayDefaults
      //     }
      //   ]
      // }
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
    // objectDefaults (title) {
    //   return title === 'itemDefaults' || title === 'assayDefaults'
    // },

    save () {

    },

    close () {
      setTimeout(() => {
        this.editedSettings = Object.assign({}, this.defaultSettings)
        this.settingsDialog = false
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
