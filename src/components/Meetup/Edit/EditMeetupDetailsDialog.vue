<!-- TO DO - force reload -->

<template>

<v-dialog width="350px" persistent v-model="editDialog">
    <v-btn fab accent slot="activator">
        <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
        <v-container>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card-title class="primary--text" >
                      <h5>Edit Meetup</h5>
                    </v-card-title>
                </v-flex>
                  <v-divider></v-divider>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-text-field name="title" label="Title" id="title" v-model="editedTitle" required></v-text-field>
                    <v-text-field
                      name="description"
                      label="Description"
                      id="description"
                      v-model="editedDescription"
                      multi-line
                      required></v-text-field>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat class="primary--text" @click="editDialog = false">Close</v-btn>
                        <v-btn flat class="primary--text" @click="onSaveChanges">Save</v-btn>
                    </v-card-actions>
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
        editedTitle: this.meetup.title,
        editedDescription: this.meetup.description
      }
    },
    methods: {
      onSaveChanges () {
        if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '') {
          return
        }
        this.editDialog = false
        const payload = {
          id: this.meetup.id,
          title: this.editedTitle,
          description: this.editedDescription
        }
        this.$store.dispatch('uptadeMeetupData', payload)
      }
    }
  }
</script>
