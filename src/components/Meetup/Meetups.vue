

<template>

<v-container>
    <v-layout row wrap>
        <v-flex xs12 sm10 offset-sm1>
            <v-card>
                <v-container fluid>
                    <v-layout row>
                        <v-flex xs5>
                            <v-card-media src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Krak%C3%B3w_-_Sukiennice_1.jpg" height="130px"></v-card-media>
                        </v-flex>
                        <v-flex xs7>
                            <v-card-title class="pb-2 pt-1">
                                <div>
                                    <h5>My Meetup</h5>
                                    <div>17th July 2017</div>
                                </div>
                            </v-card-title>
                            <v-card-actions  class="mt-0">
                              <v-spacer></v-spacer>
                              <v-btn   to="/meetups/1">
                                <v-icon left >arrow_forward</v-icon>
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
