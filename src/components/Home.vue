

<template>

<v-container class="mt-1">

    <v-layout  v-if="!loading" row wrap class="mb-4 mt-3">
        <v-flex xs12>
            <v-carousel style="cursor:pointer">
                <v-carousel-item
                  v-for="meetup in meetups"
                  :src="meetup.imageUrl"
                  :key="meetup.id"
                  @click="onLoadMeetup(meetup.id)">
                  <div class="title">
                    {{ meetup.title }}
                  </div>
                </v-carousel-item>
            </v-carousel>
        </v-flex>
    </v-layout>

    <v-layout row class="mt-4 mb-4">
      <v-flex xs12 class="text-xs-center">
         <v-progress-circular
          indeterminate
          color="primary"
          :width='7'
          :size='120'
          v-if="loading">
        </v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap >
        <v-flex xs12 sm6 class="text-sm-right text-xs-center">
            <v-btn class="info" large router to="/meetups">Explore Meetups</v-btn>
        </v-flex>
        <v-flex xs12 sm6 class="text-sm-left text-xs-center">
            <v-btn class="info" large router to="/meetup/new">Organize Meetup</v-btn>
        </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-3">
      <v-flex class="text-xs-center" xs12>
        <p>
          Join our meetups!
        </p>
      </v-flex>
    </v-layout>


</v-container>

</template>

<script>
export default {
  computed: {
    meetups () {
      return this.$store.getters.featuredMeetups
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadMeetup (id) {
      this.$router.push('/meetups/' + id)
    }
  },
  created () {
  }
}
</script>

<style scoped>
  .title{
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 3em;
    padding: 15px;
  }

</style>
