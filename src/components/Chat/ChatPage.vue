<template>
<v-container class="mt-1">
<v-layout row>
  <v-flex xs12>
    <Messages
      v-for="message in chatMessages"
      :text = "message.text"
      :user = "message.user"
      :date = "message.date"
      :id = "message.id"
      :key = "message.id"
      >
    </Messages>
    <AddNewMessage :user="user" ></AddNewMessage>
  </v-flex>
</v-layout>
</v-container>



</template>


<script>
import Messages from './Messages.vue'
import AddNewMessage from './AddNewMessage.vue'
import * as firebase from 'firebase'

export default {
  components: {
    Messages,
    AddNewMessage
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    chatMessages () {
      return this.$store.getters.chatMessages
    }
  },
  created () {
    const db = firebase.database().ref('chat')
    db.on('value', (data) => {
      const chatMessages = []
      const obj = data.val()
      for (let key in obj) {
        chatMessages.push({
          id: key,
          text: obj[key].text,
          user: obj[key].user,
          date: obj[key].date
        })
      }
      this.$store.commit('setLoadedChatMessages', chatMessages)
    })
  }
}
</script>
