

<template>

<v-layout row>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <h6> {{user}} </h6>
          <v-spacer></v-spacer>
          {{date | date}}
        </v-card-title>
        <v-card-text>
          {{text}}
        </v-card-text>
      </v-card>
    </v-flex>
</v-layout>

</template>

<script>
export default {
  props: ['text', 'user', 'date', 'id']
}
</script>
