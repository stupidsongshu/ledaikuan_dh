// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import axios from 'axios'
import config from './config'
import md5 from 'blueimp-md5'

import { Header, Button, Popup, Picker, Indicator, Toast, Range } from 'mint-ui'

import './assets/css/common.css'
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.component(Range.name, Range)

// var VConsole = require('vconsole/dist/vconsole.min')
// var vConsole = new VConsole()

if (process.env.NODE_ENV === 'development') {
  store.commit('common_api_save', config.api.dev)
} else if (process.env.NODE_ENV === 'production') {
  store.commit('common_api_save', config.api.pro)
}
console.log(store.state.common.common_api)

Vue.prototype.$http = axios
Vue.prototype.loading = function(txt) {
  Indicator.open({
    text: txt | '',
    spinnerType: 'fading-circle'
  })
  // store.commit('common_isLoading_save', true)
}
Vue.prototype.closeLoading = function() {
  Indicator.close()
  // store.commit('common_isLoading_save', false)
}

Vue.prototype.toast = function(options) {
  var obj = {
    // 文本内容
    message: '',
    // Toast 的位置
    position: 'middle',
    // 持续时间（毫秒），若为 -1 则不会自动关闭
    duration: 1200
  }
  obj = Object.assign(obj, options)

  Toast(obj)
}

Vue.prototype.goBack = function() {
  let common_isLoading = store.state.common.common_isLoading
  if (common_isLoading) {
    return
  }

  router.go(-1)
}

Vue.prototype.getSign = function(call, timestamp) {
  let ua = store.state.common.common_params.ua
  let signKey = store.state.common.common_params.signKey
  return md5(ua + '&' + call + '&' + timestamp + '&' + signKey)
}

function parseUrl() {
  let ledaikuanMainSite = config.api.ldkMainSite
  if (window.location.href.indexOf('?') === -1) {
    window.location.href = ledaikuanMainSite
    return
  }

  var urlparam = decodeURIComponent(window.location.href.split('?')[1])

  if (urlparam.indexOf('ua') === -1
      || urlparam.indexOf('call') === -1
      || urlparam.indexOf('args') === -1
      || urlparam.indexOf('sign') === -1
      || urlparam.indexOf('timestamp') === -1)
  {
    window.location.href = ledaikuanMainSite
    return
  }

  var obj = {
    ua: '',
    call: '',
    args: null,
    sign: '',
    timestamp: ''
  }

  var arr = urlparam.split('&')
  arr.forEach(item => {
    if (item.indexOf('ua') !== -1) {
      obj.ua = item.split('=')[1]
    } else if (item.indexOf('call') !== -1) {
      obj.call = item.split('=')[1]
    }  else if (item.indexOf('args') !== -1) {
      obj.args = JSON.parse(item.split('=')[1])
    }  else if (item.indexOf('sign') !== -1) {
      var index = item.indexOf('=')
      obj.sign = item.substr(index + 1).replace(/\s/g, '+')
    }  else if (item.indexOf('timestamp') !== -1) {
      obj.timestamp = item.split('=')[1]
    }
  })

  return obj
}

Vue.prototype.signCheck = function() {
  var obj = parseUrl()

  let paramString = {
    'ua': obj.ua,
    'call': obj.call,
    'args': obj.args,
    'sign': obj.sign,
    'timestamp': obj.timestamp
  }

  let call = 'Account.signCheck'
  let timestamp = new Date().getTime()
  let sign = this.getSign(call, timestamp)
  let paramString2 = JSON.stringify({
    'ua': 'hello', // 此处ua值不为空即可
    'call': call,
    'args': paramString,
    'sign': sign,
    'timestamp': timestamp
  })
  console.log(paramString2)

  this.loading()
  return new Promise((resolve, reject)=> {
    this.$http.post(store.state.common.common_api, paramString2).then(res => {
      if (res.data.returnCode === '000000') {
        let signKey = res.data.response
  
        // 保存公共参数
        store.commit('common_params_save', {
          ua: 'LDK_H5_SIGN',
          customerId: obj.args.customerId,
          signKey: signKey
        })
  
        resolve(signKey)
      } else {
        reject(res)
      }
    }).catch(err=> {
      reject(err)
    })
  })
}

// 根据账户汇总信息控制跳转逻辑
Vue.prototype.checkLoanAcctInfo = function() {
  /**
   * @param: overdueStatus 逾期状态
   * @param: minReturnAmount 解除逾期状态所需偿还金额
   * @param: totalLoanAmt 实际欠款合计
   * @param: tempFrozenAmt 临时冻结额度
   * @param: payFrozenStus 账户还款中冻结状态
   * @return:
   */
  /**
   * 用户借还款状态
   * common_loan_status: 0借款 1还款
   */
  let loanAcctInfo = this.$store.state.common.common_loanAcctInfo
  let deviceType = this.$store.state.common.common_deviceType

  // 账户还款中冻结状态
  if (loanAcctInfo.payFrozenStus !== '0') {
    // 还款处理中
    if (deviceType === 'android') {
      // setLoanStatus(int) 借还款状态: 0借款 1还款
      // app.setLoanStatus(1)
    }
    this.$store.commit('common_loan_status_save', 1)
    this.$router.replace('/repay/repayDeal')
    return
  }

  // 临时冻结额度
  if (loanAcctInfo.tempFrozenAmt > 0) {
    // 借款处理中
    if (deviceType === 'android') {
      // setLoanStatus(int) 借还款状态: 0借款 1还款
      // app.setLoanStatus(0)
    }
    this.$store.commit('common_loan_status_save', 0)
    this.$router.replace('/loan/loanDeal')
    return
  }

  // 逾期状态 1逾期 2正常
  if (loanAcctInfo.overdueStatus === 1) {
    if (deviceType === 'android') {
      // setLoanStatus(int) 借还款状态: 0借款 1还款
      // app.setLoanStatus(1)
    }
    this.$store.commit('common_loan_status_save', 1)
    this.$router.replace('/repay/overdue')
    return
  }

  // 实际欠款合计
  if (loanAcctInfo.totalLoanAmt > 0) {
    if (deviceType === 'android') {
      // setLoanStatus(int) 借还款状态: 0借款 1还款
      // app.setLoanStatus(1)
    }
    this.$store.commit('common_loan_status_save', 1)
    this.$router.replace('/repay')
    return
  }

  // 额度状态
  if (loanAcctInfo.creLineStus === '90') {
    if (deviceType === 'android') {
      // setLoanStatus(int) 借还款状态: 0借款 1还款
      // app.setLoanStatus(0)
    }
    this.$store.commit('common_loan_status_save', 0)
    this.$router.replace('/inactivated')
    return
  }

  if (deviceType === 'android') {
    // setLoanStatus(int) 借还款状态: 0借款 1还款
    // app.setLoanStatus(0)
  }
  this.$store.commit('common_loan_status_save', 0)
  this.$router.replace('/')
}

// 获取账户汇总信息
let getLoanInfoNum = 0
Vue.prototype.getLoanInfo = function() {
  let that = this
  getLoanInfoNum++
  console.log('获取账户汇总信息第 ' + getLoanInfoNum + ' 次')

  let common_params = store.state.common.common_params
  let call = 'Loan.loanAcctInfo'
  let timestamp = new Date().getTime()
  let sign = this.getSign(call, timestamp)
  let paramString = JSON.stringify({
    ua: common_params.ua,
    call: call,
    args: {
      customerId: common_params.customerId
    },
    sign: sign,
    timestamp: timestamp
  })

  this.loading()
  this.$http.post(store.state.common.common_api, paramString).then(res => {
    let data = res.data
    if (data.returnCode === '000000') {
      let loanAcctInfo = data.response
      that.$store.commit('loan_max_save', loanAcctInfo.baseTotCreLine)
      that.$store.commit('loan_limit_save', loanAcctInfo.baseTotCreLine)
      // 缓存汇总信息
      that.$store.commit('common_loanAcctInfo_save', loanAcctInfo)
      that.checkLoanAcctInfo()
    } else {
      that.toast({
        message: data.returnMsg
      })
      if (getLoanInfoNum < 10) {
        that.getLoanInfo()
      }
    }
  }).catch(err => {
    console.log(err)

    if (getLoanInfoNum < 10) {
      that.getLoanInfo()
    }
  })
}

// 重新获取账户汇总信息
Vue.prototype.reGetLoanAcctInfo = function() {
  let that = this
  let common_params = store.state.common.common_params
  let common_loanAcctInfo = store.state.common.common_loanAcctInfo
  let ua = common_params.ua
  let call = 'Loan.loanAcctInfo'
  let timestamp = new Date().getTime()
  let sign = this.getSign(call, timestamp)

  let paramString = JSON.stringify({
    ua: ua,
    call: call,
    args: {
      customerId: common_params.customerId,
      loanAcctNo: common_loanAcctInfo.loanAcctNo
    },
    sign: sign,
    timestamp: timestamp
  })

  this.loading()
  this.$http.post(store.state.common.common_api, paramString).then(res => {
    let data = res.data
    if (data.returnCode === '000000') {
      let loanAcctInfo = data.response
      that.$store.commit('loan_max_save', loanAcctInfo.baseTotCreLine)
      that.$store.commit('loan_limit_save', loanAcctInfo.baseTotCreLine)
      // 缓存汇总信息
      that.$store.commit('common_loanAcctInfo_save', loanAcctInfo)
      that.checkLoanAcctInfo()
    } else {
      that.toast({
        message: data.returnMsg
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

Vue.prototype.init = function() {
  let that = this
  this.signCheck().then(res => {
    let common_params = store.state.common.common_params
    let call = 'Account.acctStatus'
    let timestamp = new Date().getTime()
    let sign = that.getSign(call, timestamp)
    let paramString = JSON.stringify({
      ua: common_params.ua,
      call: call,
      args: {
        customerId: common_params.customerId
      },
      sign: sign,
      timestamp: timestamp
    })
  
    that.loading()
    that.$http.post(store.state.common.common_api, paramString).then(res => {
      let data = res.data
      if (data.returnCode === '000000') {
        if (data.response.resultStatus === '102') {
          // 正常开户
          console.log(data.response.resultStatus, '正常开户')
          that.getLoanInfo()
        } else if (data.response.resultStatus === '55' || data.response.resultStatus === '101') {
          // 审核中
          console.log(data.response.resultStatus, '审核中')
          router.replace({name: 'audit'})
        } else if (data.response.resultStatus === '109') {
          // 审核拒绝
          console.log(data.response.resultStatus, '审核拒绝')
          router.replace({name: 'refuse'})
        } else if (data.response.resultStatus === '121') {
          // 调查问卷
          console.log(data.response.resultStatus, '调查问卷')
          router.replace({name: 'survey'})
        } else {
          that.toast({
            message: data.returnMsg
          })
        }
      } else {
        that.toast({
          message: data.returnMsg
        })
      }
    }).catch(err => {
      console.log(err)
    })
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)，如果请求超过 `timeout` 的时间，请求将被中断
    axios.defaults.timeout = 20000

    // axios.defaults.transformRequest = [function(data) {
    //   if (data) {
    //     data = JSON.stringify(data)
    //   }
    //   return data
    // }]
    axios.interceptors.request.use((config) => {
      // if (config.method.toLowerCase() === 'post') {
      //   config.data = qs.stringify(config.data)
      // }

      store.commit('common_isLoading_save', true)
      return config
    }, function(error) {
      store.commit('common_isLoading_save', true)
      return Promise.reject(error)
    })
    axios.interceptors.response.use(function(response) {
      Indicator.close()
      store.commit('common_isLoading_save', false)
      return response
    }, function(error) {
      Indicator.close()
      store.commit('common_isLoading_save', false)

      Toast({
        message: '获取数据失败，请稍后重试',
        duration: 1500
      })
      return Promise.reject(error)
    })

    // this.init()
  }
})

Vue.filter('dateFormat', function(value) {
  return value.toString().replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3')
})
