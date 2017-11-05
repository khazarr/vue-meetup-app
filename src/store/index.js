import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import axios from 'axios'
import FbKey from './secrets.js'

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
    chatMessages: [],
    user: null,
    loading: false,
    error: null,
    skatePictures: [],
    skateDataObtained: false
  },
  mutations: {
    setLoadedChatMessages (state, payload) {
      state.chatMessages = payload
    },
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setSkatePictures (state, payload) {
      state.skatePictures = payload
    },
    skateDataObtainedSucessfully (state) {
      state.skateDataObtained = true
    }
  },
  actions: {
    addNewChatMessage ({commit}, payload) {
      commit('setLoading', true)
      const message = {
        text: payload.text,
        user: payload.user,
        date: payload.date.toISOString()
      }
      firebase.database().ref('/chat')
        .push(message)
        .then(data => {
          commit('setLoading', false)
          console.log(data)
        })
    },
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', { id: payload, fbKey: data.key })
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations').child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    loadMeetups ({commit, getters, dispatch}) {
      // firebase.database().ref('meetups').on('value') on realtime change
      commit('setLoading', true)
      const meetups = []
      firebase.database().ref('meetups').once('value')
      .then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              location: obj[key].location,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
        }
      )
      .then(
        (resp) => {
          if (!getters.getSkateDataObtainedStatus) {
            commit('setLoading', true)
            axios.get('http://localhost:8081/scrape')
              .then(res => {
                const arrayPictures = getters.getSkatePicturesArray
                res.data.map((event, i) => {
                  const year = event.date.split('.')[2]
                  const month = event.date.split('.')[1] - 1
                  const day = event.date.split('.')[0]
                  const hour = event.hours[0].split('.')[0]
                  let minutes = event.hours[0].split('.')[1]
                  let meetupDate
                  if (hour && minutes) {
                    minutes.indexOf('*') !== -1 ? minutes = minutes.slice(0, -1) : minutes
                    meetupDate = new Date(
                      year,
                      month,
                      day,
                      hour,
                      minutes,
                      0,
                      0
                    )
                  } else {
                    meetupDate = new Date(
                      year,
                      month,
                      day,
                      0,
                      0,
                      0,
                      0
                    )
                  }
                  // console.log(arrayPictures[i])
                  const SkateMeetup = {
                    title: event.day + ' - dawaj na łyżwy!',
                    description: 'Godziny ślizgawek: ' + event.hours.toString(),
                    date: meetupDate,
                    imageUrl: arrayPictures[i]
                  }
                  // check if this event already exist in current meetups
                  // console.log(SkateMeetup)

                  let alreadyExists = false
                  meetups.map(meetup => {
                    if (meetup.date === meetupDate.toISOString()) {
                      alreadyExists = true
                    }
                  })

                  if (!alreadyExists) {
                    dispatch('createMeetupWithRandomImage', SkateMeetup)
                  }
                })
                commit('setLoading', false)
                commit('skateDataObtainedSucessfully')
              })
              .catch(err => {
                commit('setLoading', false)
                console.log(err)
              })
          }
        }
      )
      .catch(
        (error) => {
          console.log(error)
          commit('setLoading', false)
        }
      )
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    createMeetupWithRandomImage ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: 'Lodowisko Cracovia',
        description: payload.description,
        date: payload.date.toISOString(),
        imageUrl: payload.imageUrl
      }
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          const key = data.key
          commit('createMeetup', {
            ...meetup,
            id: key
          })
          /* eslint-disable no-undef */
          const shareURL = 'localhost:8080/meetups/' + key
          const shareMessage = meetup.title + ' ' + meetup.description
          const link = 'tu-bedzie-super-link.com/meetups/' + key
          console.log(shareURL)
          FB.api(
            '/190422544836963/feed',
            'POST',
            {
              message: shareMessage,
              link: link,
              access_token: FbKey.FbKey
            },
            function (response) {
              console.log(response)
            }
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    uptadeMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.title) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            commit('clearError')
            const newUser = {
              id: user.uid,
              email: user.email,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            commit('clearError')
            const newUser = {
              id: user.uid,
              email: user.email,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        email: payload.email,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchICeSkatePicturesFromPixbay ({commit}) {
      axios.get('https://pixabay.com/api/?key=6932745-a00e3da6a9e2cc1f584da7044&q=hockey&image_type=photo%3Fper_page&pretty=true')
        .then(response => {
          // console.log(response.data.hits)
          const arrayPictures = []
          response.data.hits.map(picture => {
            arrayPictures.push(picture.webformatURL)
          })
          commit('setSkatePictures', arrayPictures)
        })
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = {}
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            email: getters.user.email,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError ({commit}) {
      commit('clearError')
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
    },
    chatMessages (state) {
      return state.chatMessages
    },
    user (state) {
      return state.user
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    },
    getSkatePicturesArray (state) {
      return state.skatePictures
    },
    getSkateDataObtainedStatus (state) {
      return state.skateDataObtained
    }
  }
})
