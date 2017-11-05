

<template>

<v-container>
    <v-layout row wrap v-for="meetup in meetups" :key="meetup.id" class="mb-2">
        <v-flex xs12 sm10 offset-sm1>
            <v-card >
                <v-container fluid>
                    <v-layout row>
                        <v-flex xs5>
                            <v-card-media :src="meetup.imageUrl" height="130px"></v-card-media>
                        </v-flex>
                        <v-flex xs7>
                            <v-card-title class="pb-2 pt-1">
                                <div>
                                    <h5>{{ meetup.title }}</h5>
                                    <div>{{ meetup.date | date }}</div>
                                    <div> {{meetup.description }}</div>
                                </div>
                            </v-card-title>
                            <v-card-actions class="mt-0">
                                <v-spacer></v-spacer>
                                <v-btn v-bind:to="'/meetups/' + meetup.id">
                                    <v-icon left>arrow_forward</v-icon>
                                    View Meetup
                                </v-btn>
                            </v-card-actions>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>

</template>

<script>
export default {
  computed: {
    meetups () {
      return this.$store.getters.loadedMeetups
    }
  }
}
</script>
