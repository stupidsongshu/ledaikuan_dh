import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import common from './modules/common.js'

Vue.use(Vuex)

const vuexSession = new VuexPersist({
  storage: window.sessionStorage
})

export default new Vuex.Store({
  modules: {
    common
  },
  plugins: [vuexSession.plugin]
})
