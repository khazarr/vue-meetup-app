<template>

<v-dialog width="350px" persistent v-model="editDialog">
    <v-btn  accent slot="activator">
        Edit Date
    </v-btn>
    <v-card>
        <v-container>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card-title class="primary--text" >
                      <h5>Edit Meetup Date</h5>
                    </v-card-title>
                </v-flex>
                  <v-divider></v-divider>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12>
                  <v-date-picker v-model="editableDate" style="width: 100%" actions>
                    <template slot-scope="{save, cancel}">
                      <v-btn @click="editDialog = false">Close</v-btn>
                      <v-btn @click="onSaveChanges">Save</v-btn>
                    </template>
                  </v-date-picker>
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
       editableDate: null
     }
   },
   methods: {
     onSaveChanges () {
       const newDate = new Date(this.meetup.date)
       const newDay = new Date(this.editableDate).getUTCDate()
       const newMonth = new Date(this.editableDate).getUTCMonth()
       const newYear = new Date(this.editableDate).getUTCFullYear()
       newDate.setUTCDate(newDay)
       newDate.setUTCMonth(newMonth)
       newDate.setUTCFullYear(newYear)
       console.log(newDay)
       console.log(newMonth)
       console.log(newYear)
       this.$store.dispatch('uptadeMeetupData', {
         id: this.meetup.id,
         date: newDate
       })
     }
   },
   created () {
     this.editableDate = new Date(this.meetup.date)
   }
 }
</script>
