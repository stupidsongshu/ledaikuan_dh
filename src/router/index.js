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

// 贷前
import AuthLogin from '@/views/home/authLogin'
import LivingBody from '@/views/auth/livingBody/livingBody'
import Idcard from '@/views/auth/idcard/idcard'
import Bankcard from '@/views/auth/bankcard/bankcard'
import BaseInfo from '@/views/auth/baseInfo/baseInfo'
import Video from '@/views/auth/video/video'
import Summary from '@/views/auth/summary/summary'
import WaitAudit from '@/views/auth/waitAudit/waitAudit'

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
  },
  // 贷前
  {
    path: '/authLogin',
    name: 'authLogin',
    component: AuthLogin
  },
  {
    path: '/livingBody',
    name: 'livingBody',
    component: LivingBody
  },
  {
    path: '/idcard',
    name: 'idcard',
    component: Idcard
  },
  {
    path: '/bankcard',
    name: 'bankcard',
    component: Bankcard
  },
  {
    path: '/baseInfo',
    name: 'baseInfo',
    component: BaseInfo
  },
  {
    path: '/video',
    name: 'video',
    component: Video
  },
  {
    path: '/summary',
    name: 'summary',
    component: Summary
  },
  {
    path: '/waitAudit',
    name: 'waitAudit',
    component: WaitAudit
  }
]

export default new Router({
  routes
})
