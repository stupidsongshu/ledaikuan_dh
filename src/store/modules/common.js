const state = {
  /*
   * 设备类型
  */
  common_deviceType: '',
  /**
   * hasPopup 是否有popup组件显示(若有显示，点击后退先消失而不是直接返回上一页)
   */
  common_hasPopup: false
}

const getters = {}

const mutations = {
  common_deviceType_save(state, payload) {
    state.common_deviceType = payload
  },
  common_hasPopup_save(state, payload) {
    state.common_hasPopup = payload
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
