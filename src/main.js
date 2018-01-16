// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'

import { Header, Button, Popup, Picker, Indicator, Toast } from 'mint-ui'

import './assets/css/common.css'

Vue.config.productionTip = false

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)

Vue.prototype.loading = function(txt) {
  Indicator.open({
    text: txt | '',
    spinnerType: 'fading-circle'
  })
  // store.commit('isLoadingSave', true)
}
Vue.prototype.closeLoading = function() {
  Indicator.close()
  // store.commit('isLoadingSave', false)
}
Vue.prototype.toast = function(setting) {
  // 文本内容
  var message = ''
  // Toast 的位置
  var position = 'middle'
  // 持续时间（毫秒），若为 -1 则不会自动关闭
  var duration = 1200

  if (setting) {
    if (setting.message) {
      message = setting.message
    }
    if (setting.position) {
      position = setting.position
    }
    if (setting.duration) {
      duration = setting.duration
    }
  }

  var toastInstance = Toast({
    message: message,
    position: position,
    duration: duration
  })

  // if (toastInstance) {
  //   toastInstance.close()
  // }
  // console.log(toastInstance.timer)
}

Vue.prototype.goBack = function() {
  router.go(-1)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

Vue.filter('dateFormat', function(value) {
  return value.toString().replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3')
})
