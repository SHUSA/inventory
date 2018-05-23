<template>
  <v-layout>
    <v-flex xs12>
      <v-card width="100%" class="pa-3">
        <v-toolbar absolute flat dark>
          <v-toolbar-title>
            {{info.title}}
          </v-toolbar-title>
          <v-toolbar-items>
            <v-btn flat @click.native="drawer">
              {{info.assay}}
              {{info.vendor}}
              {{info.item}}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <div class="mt-5">
          <slot>
            Lorem ipsum dolor sit amet, copiosae urbanitas nam ut, labores albucius has ea. Ius animal legimus utroque ea. Ad augue ubique pericula sed, bonorum democritum argumentum mel at. At labores voluptatum has, ei justo regione omnesque vix, et purto nullam duo. Mea no commodo voluptaria consequuntur, ex vim ornatus accusamus constituam.

Ei congue aliquando mel, in expetendis liberavisse sit. Eos decore fabulas tibique ea. Eu iracundia similique contentiones vel. Eum docendi lobortis cu, an sed scripta tritani eleifend. Eum te ludus iriure fuisset, paulo tantas doming ea per. Pri audire efficiantur an.

Ne case aeque dicam vim, paulo doctus salutandi at qui. Has vero voluptua ut, facilis mnesarchum ad mel. Te cum lorem summo everti, natum sonet corpora quo ut. Ea vim esse possim, eam dicit eruditi legimus ei. Cum id quas quidam consequat.

Elitr officiis maluisset cum ad. At duo utinam diceret, cu vim probo cotidieque delicatissimi, te purto propriae delectus eos. Per agam admodum sadipscing et. Ne mel maiestatis reprimique. Vis in utamur commodo equidem, paulo eligendi eu pri. Te eos tractatos salutandi signiferumque, qui ei autem erroribus, vel aperiri iracundia id.

Ipsum fabulas incorrupte in eam, per et eirmod impetus. Nec ea zril mandamus scriptorem. An sonet legimus sit, vim et autem mnesarchum, ad quas probatus gloriatur nec. Ea quo malis mundi. Per inani aliquid disputando ne, id qui omittam repudiandae, nam ex ubique senserit hendrerit.
          </slot>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    info: {
      default () {
        return {
          title: 'test'
        }
      }
    }
  },

  methods: {
    drawer () {
      this.$store.dispatch('setDrawer')
    }
  }
}
</script>

<style scoped>

</style>
