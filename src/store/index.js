import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import common from './modules/common.js'
import loan from './modules/loan.js'
import survey from './modules/survey.js'

Vue.use(Vuex)

const vuexSession = new VuexPersist({
  storage: window.sessionStorage
})

export default new Vuex.Store({
  modules: {
    common,
    loan,
    survey
  },
  plugins: [vuexSession.plugin]
})
