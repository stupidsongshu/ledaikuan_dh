const state = {
  /*
   * common_deviceType 设备类型
  */
  common_deviceType: '',
  /**
   * common_isLoading 是否正在请求(默认false,请求期间屏蔽后退功能)
   */
  common_isLoading: false,
  /**
   * common_hasPopup 是否有popup组件显示(若有显示，点击后退先消失而不是直接返回上一页)
   */
  common_hasPopup: false,
  /*
   * common_api 公共请求接口地址
  */
  common_api: '',
  /**
   * 公共参数包裹对象
   */
  common_params: {},
   /**
   * 用户汇总信息
   */
  common_loanAcctInfo: {},
  /**
   * 用款
   */
  common_cashExtract: {},
  /**
   * 还款
   */
  common_cashRepay: {},
  /**
   * 用户借还款状态
   * common_loan_status: 0借款 1还款
   */
  common_loan_status: 0,
  // 单笔用款明细
  common_cashExtractDetail: null
}

const getters = {}

const mutations = {
  common_deviceType_save(state, payload) {
    state.common_deviceType = payload
  },
  common_isLoading_save(state, payload) {
    state.common_isLoading = payload
  },
  common_hasPopup_save(state, payload) {
    state.common_hasPopup = payload
  },
  common_api_save(state, payload) {
    state.common_api = payload
  },
  common_params_save(state, payload) {
    state.common_params = payload
  },
  common_loanAcctInfo_save(state, payload) {
    state.common_loanAcctInfo = payload
  },
  common_cashExtract_save(state, payload) {
    state.common_cashExtract = payload
  },
  common_cashRepay_save(state, payload) {
    state.common_cashRepay = payload
  },
  common_loan_status_save(state, payload) {
    state.common_loan_status = payload
  },
  common_cashExtractDetail_save(state, payload) {
    state.common_cashExtractDetail = payload
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
