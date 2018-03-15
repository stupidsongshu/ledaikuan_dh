import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// 贷后
import Home from '@/views/home/home'
import Audit from '@/views/home/audit'
import Refuse from '@/views/home/refuse'
import Loan from '@/views/loan/loan'
import LoanDeal from '@/views/loan/loanDeal'
import Repay from '@/views/repay/repay'
import OnTime from '@/views/repay/onTime'
import InAdvance from '@/views/repay/inAdvance'
import Overdue from '@/views/repay/Overdue'
import RepayDeal from '@/views/repay/repayDeal'
import Rate from '@/views/other/rate'
import Survey from '@/views/survey/index'

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
    component: Home,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/audit',
    name: 'audit',
    component: Audit
  },
  {
    path: '/refuse',
    name: 'refuse',
    component: Refuse
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
  },
  {
    path: '/survey',
    name: 'survey',
    component: Survey
  }
]

export default new Router({
  routes
})
