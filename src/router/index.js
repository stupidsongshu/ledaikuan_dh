import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/views/home/home'
import Loan from '@/views/loan/loan'
import LoanDeal from '@/views/loan/loanDeal'
import Repay from '@/views/repay/repay'
import OnTime from '@/views/repay/onTime'
import InAdvance from '@/views/repay/inAdvance'
import Overdue from '@/views/repay/Overdue'
import RepayDeal from '@/views/repay/repayDeal'
import Rate from '@/views/other/rate'

Vue.use(Router)

/**
 * 检测设备类型
 */
let ua = window.navigator.userAgent
if (/iphone/gi.test(ua)) {
  console.log('iphone')
  store.commit('common_deviceType_save', 'iphone')
} else if (/android/gi.test(ua)) {
  console.log('android')
  store.commit('common_deviceType_save', 'android')
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/loan',
    name: 'loan',
    component: Loan
  },
  {
    path: '/loan/loanDeal',
    name: 'loanDeal',
    component: LoanDeal
  },
  {
    path: '/repay',
    name: 'repay',
    component: Repay
  },
  {
    path: '/repay/onTime',
    name: 'onTime',
    component: OnTime
  },
  {
    path: '/repay/inAdvance',
    name: 'inAdvance',
    component: InAdvance
  },
  {
    path: '/repay/overdue',
    name: 'overdue',
    component: Overdue
  },
  {
    path: '/repay/repayDeal',
    name: 'repayDeal',
    component: RepayDeal
  },
  {
    path: '/rate',
    name: 'rate',
    component: Rate
  }
]

export default new Router({
  routes
})
