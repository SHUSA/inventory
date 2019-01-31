<template>
  <div>
    <error :response="response"/>
    <!-- snack -->
    <v-snackbar
      v-model="snackbar"
      color="primary"
      bottom
    >
      <v-flex class="text-xs-center">
        {{snackText}}
      </v-flex>
    </v-snackbar>

    <!-- dialog -->
    <v-dialog
      v-model="dialog"
      max-width="500px"
      @keydown.enter="validateData()"
    >
      <dialog-base :formTitle="formTitle" :dataInfo.sync="currentAssay" :assays="assays" :reassigned.sync="resData">
        <v-form slot="input-fields" ref="form" v-model="form" lazy-validation>
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <v-text-field v-model.trim="editedAssay.name" :rules="[rules.assay]" label="Name" required/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedAssay.weeklyVolume" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Weekly Volume"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedAssay.weeklyRuns" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Runs per Week"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedAssay.controlsPerRun" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Controls per Run"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedAssay.maxBatchSize" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Max Batch Size"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model.number="editedAssay.sampleReplicates" validate-on-blur :rules="[rules.wholeNumber]" type="number" min=0 label="Sample Replicates"/>
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
        <!-- actions -->
        <template slot="buttons">
          <v-progress-circular indeterminate color="primary" v-if="loading"/>
          <v-btn flat color="error" @click="close">Cancel</v-btn>
          <v-btn flat color="primary" @click="validateData()">Save</v-btn>
        </template>
      </dialog-base>
    </v-dialog>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import itemService from '@/services/ItemService.js'
import assayService from '@/services/AssayService.js'
import Deactivation from './Deactivation'
import DialogBase from './DialogBase'

export default {
  props: [
    'assayDialog',
    'selectedAssay',
    'itemList',
    'assayNameList',
    'assayList',
    'assayIndex',
    'editedItem',
    'reassigned'
  ],

  components: {
    Deactivation,
    DialogBase
  },

  data () {
    return {
      form: true,
      deactivationDialog: false,
      response: '',
      alert: false,
      alertMessage: '',
      loading: false,
      snackbar: false,
      snackText: '',
      formTitle: 'New Assay',
      rules: {
        wholeNumber: (val) => {
          return val !== null && val >= 0 && Number.isInteger(val) ? true : 'Please enter an integer'
        },
        assay: (text) => {
          if (text.length === 0) {
            return 'Please enter a valid name'
          } else if (this.assayList.find(assay => assay.name.toUpperCase() === text.toUpperCase())) {
            if (this.index > -1) {
              return true
            } else {
              return 'Duplicate assay name found'
            }
          } else {
            return true
          }
        }
      },
      editedAssay: {
        name: '',
        weeklyVolume: 0,
        weeklyRuns: 0,
        controlsPerRun: 0,
        maxBatchSize: 0,
        sampleReplicates: 1
      },
      defaultAssay: {
        name: '',
        weeklyVolume: 0,
        weeklyRuns: 0,
        controlsPerRun: 0,
        maxBatchSize: 0,
        sampleReplicates: 1
      }
    }
  },

  watch: {
    dialog (val) {
      if (val) {
        if (this.index > -1) {
          // existing assay
          this.editedAssay = Object.assign(this.editedAssay, this.currentAssay)
          this.formTitle = `Editing ${this.selectedAssay.name}`
        } else {
          // new assay
          this.formTitle = 'New Assay'
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

    dialog: {
      get () {
        return this.assayDialog
      },

      set (value) {
        this.$emit('update:assayDialog', value)
      }
    },

    index: {
      get () {
        return this.assayIndex
      },

      set (value) {
        this.$emit('update:assayIndex', value)
      }
    },

    currentItem: {
      get () {
        return this.editedItem
      },

      set (value) {
        this.$emit('update:editedItem', value)
      }
    },

    currentAssay: {
      get () {
        return this.selectedAssay
      },

      set (value) {
        this.$emit('update:selectedAssay', value)
      }
    },

    assayNames: {
      get () {
        return this.assayNameList
      },

      set (value) {
        this.$emit('update:assayNameList', value)
      }
    },

    items: {
      get () {
        return this.itemList
      },

      set (value) {
        this.$emit('update:itemList', value)
      }
    },

    assays: {
      get () {
        return this.assayList
      },

      set (value) {
        this.$emit('update:assayList', value)
      }
    },

    resData: {
      get () {
        return this.reassigned
      },

      set (value) {
        this.$emit('update:reassigned', value)
      }
    }
  },

  methods: {
    openSnack (text) {
      this.snackText = text
      this.snackbar = true
    },

    close () {
      setTimeout(() => {
        this.editedAssay = Object.assign({}, this.defaultAssay)
        // this.index = -1
        // this.currentAssay = {}
        this.dialog = false
      }, 300)
    },

    validateData () {
      // checks input entry for numbers
      if (this.$refs.form.validate()) {
        this.alert = false
        this.loading = true
        this.save()
      } else {
        this.alert = true
        this.alertMessage = 'Please fix errors'
      }
    },

    async save () {
      let assayInfo = {}

      if (this.index > -1) {
        // existing assay]
        // update active state if changed
        if (this.currentAssay.active !== this.editedAssay.active) {
          this.editedAssay.active = this.currentAssay.active
        }
        this.response = await assayService.put(this.editedAssay)

        if (this.response.status === 200) {
          assayInfo = this.editedAssay
          // only run currentItem.AssayId if editing item
          if (this.currentItem.AssayId) {
            this.currentItem.AssayId = assayInfo.id
          }
          Object.assign(this.assays[this.index], assayInfo)
          // update all items with edited assay
          let itemList = []
          this.items.map(item => {
            if (item.AssayId === assayInfo.id) {
              itemList.push(item)
            }
          })
          this.response = await itemService.put(null, null, null, itemList)

          if (this.response.status === 200) {
            let index = 0
            // reassign new values to supplies
            this.response.data.map(item => {
              index = this.items.findIndex(x => x.id === item.id)
              this.items.splice(index, 1)
              this.items.push(item)
            })
          }
          this.snackText = `${assayInfo.name} updated`
        }
      } else {
        // new assay
        this.response = await assayService.post(this.editedAssay)

        if (this.response.status === 200) {
          let data = this.response.data

          data.hasItem = true
          this.currentItem.AssayId = data.id
          this.assays.push(data)
          this.assayNames.push(data.name)
          this.snackText = `${data.name} saved`
        }
      }

      if (!this.alert) {
        this.loading = false
        this.openSnack(this.snackText)
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
