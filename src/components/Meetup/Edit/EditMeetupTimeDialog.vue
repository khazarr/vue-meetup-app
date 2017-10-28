<template>

<v-dialog width="350px" persistent v-model="editDialog">
    <v-btn  accent slot="activator">
        Edit Time
    </v-btn>
    <v-card>
        <v-container>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card-title class="primary--text" >
                      <h5>Edit Meetup Time</h5>
                    </v-card-title>
                </v-flex>
                  <v-divider></v-divider>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12>
                  <v-time-picker v-model="editableTime" style="width: 100%" actions format="24hr">
                    <template slot-scope="{save, cancel}">
                      <v-btn @click="editDialog = false">Close</v-btn>
                      <v-btn @click="onSaveChanges">Save</v-btn>
                    </template>
                  </v-time-picker>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</v-dialog>

</template>

<script>
 export default {
   props: ['meetup'],
   data () {
     return {
       editDialog: false,
       editableTime: null
     }
   },
   methods: {
     onSaveChanges () {
       const newDate = new Date(this.meetup.date)
       const hours = this.editableTime.match(/^(\d+)/)[1]
       const minutes = this.editableTime.match(/:(\d+)/)[1]
       newDate.setHours(hours)
       newDate.setMinutes(minutes)
       this.$store.dispatch('uptadeMeetupData', {
         id: this.meetup.id,
         date: newDate
       })
     }
   },
   created () {
     this.editableTime = new Date(this.meetup.date).toTimeString()
   }
 }
</script>
