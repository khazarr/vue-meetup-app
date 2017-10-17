

<template>

<v-container class="mt-1">
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <h4 class="primary--text">Create new meetup</h4>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex xs12>
            <form @submit.prevent="onCreateMeetup">
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    name="title"
                    label="Title"
                    id="title"
                    v-model="title"
                    required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    name="location"
                    label="Location"
                    id="location"
                    v-model="location"
                    required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    name="imageUrl"
                    label="Image URL"
                    id="image-url"
                    v-model="imageUrl"
                    required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
              <img style="max-width:300px" :src="imageUrl" />
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    name="description"
                    label="Description"
                    id="description"
                    v-model="description"
                    multi-line
                    required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <h5>Choose a Date & time</h5>
                </v-flex>
              </v-layout>
              <v-layout row class="mb-2">
                <v-flex xs12 sm6 offset-sm3>
                  <v-date-picker v-model="date"></v-date-picker>
                  <p>
                    {{ date }}
                  </p>
                </v-flex>
              </v-layout row>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3 >
                  <v-time-picker format="24hr" v-model="time"></v-time-picker>
                  <p>
                    {{ time }}
                  </p>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="primary"
                    :disabled="!formIsValid"
                    type="submit">Create Meetup</v-btn>
                    {{ subittableDateTime }}
                </v-flex>
              </v-layout>
            </form>
        </v-flex>
    </v-layout>
</v-container>

</template>


<script>
  export default {
    data () {
      return {
        title: '',
        location: '',
        imageUrl: '',
        description: '',
        date: new Date(),
        time: new Date()
      }
    },
    computed: {
      formIsValid () {
        return this.title !== '' &&
        this.location !== '' &&
        this.description !== '' &&
        this.imageUrl !== ''
      },
      subittableDateTime () {
        const date = new Date(this.date)
        if (typeof this.time === 'string') {
          const hours = this.time.match(/^(\d+)/)[1]
          const minutes = this.time.match(/:(\d+)/)[1]
          date.setHours(hours)
          date.setMinutes(minutes)
        } else {
          date.setHours(this.time.getHours())
          date.setMinutes(this.time.getMinutes())
        }
        console.log(date)
        return date
      }
    },
    methods: {
      onCreateMeetup () {
        if (!this.formIsValid) {
          return
        }
        const meetupData = {
          title: this.title,
          location: this.location,
          imageUrl: this.imageUrl,
          description: this.description,
          date: new Date()
        }
        this.$store.dispatch('createMeetup', meetupData)
        this.$router.push('/meetups')
      }
    }
  }
</script>
