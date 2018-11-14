<template>
  <v-dialog
    v-model="vendorDialog"
    max-width="500px"
    @keydown.enter="saveVendor"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{vendorForm}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="editedVendor.name" label="Name" :rules="[rules.vendor]" required/>
            </v-flex>
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
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-progress-circular indeterminate color="primary" v-if="loading"/>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="saveVendor">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
