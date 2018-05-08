<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card class="pa-3">
          <v-text-field
            name="num-test"
            label="Number Test"
            id="number-test"
            v-model="test.number"
          ></v-text-field>

          <v-text-field
            name="text-test"
            label="Text Test"
            id="text-test"
            v-model="test.text"
          ></v-text-field>

          <v-btn dark @click="create">Submit</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
    <br>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <li v-for="item in tested">
            {{item.number}}
          </li>
          <br>
          <li v-for="item in tested">
            {{item.text}}
          </li>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Test from '@/services/Test'
export default {
  data () {
    return {
      test: {
        number: null,
        text: null
      },
      tested: {}
    }
  },
  methods: {
    async create () {
      try {
        await Test.post(this.test)
        this.tested = (await Test.index()).data
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted () {
    this.tested = (await Test.index()).data
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
