<template>
<v-card>
  <v-card-text>
    <v-layout row>
      <v-flex xs12>
        <v-text-field
          name="message"
          label="Type new message"
          id="message"
          v-model="message"
          required
          full-width
          single-line></v-text-field>
      </v-flex>
    </v-layout>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn @click="onAddMessage" class="primary">Add</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  props: ['user'],
  data () {
    return {
      message: ''
    }
  },
  methods: {
    onAddMessage () {
      const message = {
        text: this.message,
        user: this.user.email,
        date: new Date()
      }
      this.$store.dispatch('addNewChatMessage', message)
      this.message = ''
    }
  }
}
</script>
