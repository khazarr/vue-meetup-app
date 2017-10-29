<template>
<v-container class="mt-1">
<v-layout row>
  <v-flex xs12>
    <Messages></Messages>
    <AddNewMessage :user="user" ></AddNewMessage>
  </v-flex>
</v-layout>
</v-container>



</template>


<script>
import Messages from './Messages.vue'
import AddNewMessage from './AddNewMessage.vue'

export default {
  components: {
    Messages,
    AddNewMessage
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
</script>
