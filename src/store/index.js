import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      { imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Krak%C3%B3w_-_Sukiennice_1.jpg',
        id: 'asdasd2',
        title: 'Meetup in Cracow',
        date: new Date(),
        location: 'Cracow',
        description: 'Pierogi in Craow'
      },
      { imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Sosnowiec-Zag%C3%B3rze.Ulica_Stefana_Kisielewskiego..JPG',
        id: 'asdasd3',
        title: 'Meetup in Sosnowiec',
        date: new Date(),
        location: 'Sosnowiec',
        description: 'Cool meetup in Sosnowiec'
      }
    ],
    user: {
      id: 'asdkjhaskj',
      registeredMeetups: ['asdasd2']
    }
  },
  mutations: {
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    }
  },
  actions: {
    createMeetup ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: 'ndasjskjdnk2'
      }
      // Reach out to firebase and store it
      commit('createMeetup', meetup)
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    }
  }
})
