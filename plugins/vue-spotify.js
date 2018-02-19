import Vue from 'vue'
import {SPOTIFY_KEYS} from "../store/constants.js"
import * as axios from "axios"


let stateKey = 'spotify_auth_state' //state key index name in sessionStorage
let accesstokenKey ='access_token' //access key index name in sessionStorage
let storedKey =  '' //stored key that generated from plugin itself
let trialsKey ='number_of_trials'
let storedtrial = 3
let timeout_ = null



const VueSpotify  = {
    install: function (Vue, options) {
        VueSpotify.getHashParams = function () {
            if (process.browser) {
                let hashParams = {}
                let e, r = /([^&;=]+)=?([^&;]*)/g,
                    q = window.location.hash.substring(1)

                while (e = r.exec(q)) {
                    hashParams[e[1]] = decodeURIComponent(e[2])
                }
                return hashParams
            } else return false

        },
        VueSpotify.generateRandomString = function (length) {
              if(  Number.isInteger(length)) {
                  let text = '';
                  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                  for (let i = 0; i < length; i++) {
                      text += possible.charAt(Math.floor(Math.random() * possible.length));
                  }
                  return text;
              } else return false
            }
        VueSpotify.authenticate = function () {
           if(process.browser) {
               if (sessionStorage.getItem(trialsKey) === null) {
                   sessionStorage.setItem(trialsKey, storedtrial)
               } else if (sessionStorage.getItem(trialsKey) > 0) {
                   storedtrial = sessionStorage.getItem(trialsKey) - 1
                   sessionStorage.setItem(trialsKey, storedtrial)

               }
               if (sessionStorage.getItem(stateKey) !== null && sessionStorage.getItem(accesstokenKey) !== null) {
                   sessionStorage.removeItem(stateKey)
                   sessionStorage.removeItem(accesstokenKey)
               }

               let client_id = SPOTIFY_KEYS.client_id; // Your client id
               let redirect_uri = SPOTIFY_KEYS.redirect_url; // Your redirect uri

               let state = this.generateRandomString(16);
               sessionStorage.setItem(stateKey, storedKey)
               let scope = 'user-read-private user-read-email user-library-read user-library-modify'

               let url = 'https://accounts.spotify.com/authorize'
               url += '?response_type=token'
               url += '&client_id=' + encodeURIComponent(client_id)
               url += '&scope=' + encodeURIComponent(scope)
               url += '&redirect_uri=' + encodeURIComponent(redirect_uri)
               url += '&state=' + encodeURIComponent(state)
               if (sessionStorage.getItem(trialsKey) > 0) {
                   window.location = url
                   console.log('--Authenticating--')
                   return true
               } else {
                   console.log('--you have exceeded trial times--')
                   return false
               }
           }else {
               console.log('--Unable to get information--')
               return false
           }

        }
        Vue.unauthenticate = function (){
           if(process.browser){
               if(sessionStorage.getItem(accesstokenKey)!==null){
                   sessionStorage.removeItem(accesstokenKey)
                   sessionStorage.removeItem(stateKey)

                   clearTimeout(timeout_)
                   console.log('-- Unauthenticated success--')
                   return true
               } else {
                   console.log('--Not Authenticated yet--')
                   return false
               }
           } else{
               console.log('--unable to get information--')
               return false
           }
        }
        Vue.authorization = function () {
            if(process.browser) {
                let params = VueSpotify.getHashParams()
                let access_token = null
                let state = null
                let expires_in = null

                if (sessionStorage.getItem(accesstokenKey) === null || sessionStorage.getItem(stateKey) === null) {
                    if ((params.access_token !== null && params.state !== null) && (params.access_token !== undefined && params.state !== undefined)) {
                        access_token = params.access_token
                        state = params.state
                        expires_in = params.expires_in
                        sessionStorage.setItem(accesstokenKey, access_token)
                        sessionStorage.setItem(stateKey, state)

                        timeout_ = setTimeout(function () {
                            if (sessionStorage.getItem(trialsKey) !== null) sessionStorage.removeItem(trialsKey)
                            console.log('--Session Expired--')
                            Vue.authorization()
                        }, expires_in * 1000)


                    }
                } else if ((sessionStorage.getItem(accesstokenKey) !== null && sessionStorage.getItem(stateKey) !== null)) {
                    access_token = sessionStorage.getItem(accesstokenKey)
                    state = sessionStorage.getItem(stateKey)

                }

                if (access_token !== undefined && access_token !== null) {
                    if (state === null || state === undefined) {
                        console.log('%c Re-authenticating...', 'color: #F00;')
                        VueSpotify.authenticate()
                        return false
                    } else {
                        console.log('--Authorized--' + access_token)
                        console.log('\n trial times:' + sessionStorage.getItem(trialsKey))
                        return true
                    }
                } else {
                    console.log('--Not Authorized--')
                    VueSpotify.authenticate()

                    return false
                }
            } else {
                console.log('--Unable to get information--')
                return false;
            }

        }
        Vue.isAuthorized= function() {
             if(process.browser){
                 let isauth = (sessionStorage.getItem(accesstokenKey)!==null && sessionStorage.getItem(stateKey)!=null)?true:false
                 console.log('--Is Auth:'+ isauth +'--')
                 return isauth
             }
            else {
                 console.log('--Unable to get information--')
                 return false
             }
        }
        Vue.getMusicLibrary=function(limit=20,offset=0) {
            let list = []
            if (Number.isInteger(limit) && Number.isInteger(offset) && process.browser && Vue.isAuthorized()) {
                if (limit <= 50 ){
                    axios.get('https://api.spotify.com/v1/me/tracks', {
                        params: {
                            limit: limit,
                            offset: offset
                        },
                        headers: {'Authorization': 'Bearer ' + sessionStorage.getItem(accesstokenKey)},
                        responseType: 'json',
                    })
                        .then(function (response) {
                            //console.log(response.data.map(list => ({ id:1 , name: list.items.track.name })));
                            //return response.data.map(list => ({ id:1 , name: list.items.track.name }))
                            let data = []
                            let dataMapped = []

                               data = response.data.items
                                dataMapped= data.map((list,i)=>({ id: i, name: list.track.name}))
                            return dataMapped

                        })
                        .catch(function (error) {

                            console.log(error)

                            return false
                        });
                }


            }
        }
    }

};

Vue.use(VueSpotify);
export default VueSpotify;

