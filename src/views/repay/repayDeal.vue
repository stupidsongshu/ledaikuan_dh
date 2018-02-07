<template>
  <div class="loan-deal">
    <mt-header fixed class="header" title="还款"></mt-header>

    <div class="deal-banner">
      <div class="status" v-show="status === 0">提交成功</div>
      <div class="status" v-show="status === 1">银行处理中</div>
      <div class="status" v-show="status === 2">还款成功</div>
      <div class="loan-amount">
        <span class="icon-money"></span>{{remainAmtInt}}.<span class="decimals">{{remainAmtFlo}}</span>
      </div>
    </div>

    <deal-step :status="status" :dealInfo="dealInfo"></deal-step>

    <!-- animation -->
    <div id="self-indicator-wrapper" class="self-indicator-wrapper" v-show="popupVisible">
      <span class="self-indicator-spin">
        <div class="self-spinner-fading-circle" style="width: 32px;height: 32px;">
          <div class="self-spinner-fading-circle-circle is-circle2"></div>
          <div class="self-spinner-fading-circle-circle is-circle3"></div>
          <div class="self-spinner-fading-circle-circle is-circle4"></div>
          <div class="self-spinner-fading-circle-circle is-circle5"></div>
          <div class="self-spinner-fading-circle-circle is-circle6"></div>
          <div class="self-spinner-fading-circle-circle is-circle7"></div>
          <div class="self-spinner-fading-circle-circle is-circle8"></div>
          <div class="self-spinner-fading-circle-circle is-circle9"></div>
          <div class="self-spinner-fading-circle-circle is-circle10"></div>
          <div class="self-spinner-fading-circle-circle is-circle11"></div>
          <div class="self-spinner-fading-circle-circle is-circle12"></div>
          <div class="self-spinner-fading-circle-circle is-circle13"></div>
        </div>
      </span>
    </div>

    <loan-plan v-if="loanPlanListStatus" :overflowScroll="false" :loanPlanList="loanPlanList" style="margin-top: 10px;"></loan-plan>
    <div v-if="!loanPlanListStatus" class="get-data-fail" @click="reGetRepayPlan">获取数据失败，点击重试</div>

    <p class="friendly-tip" style="margin: 20px 0;">
      <b>友情提示：</b>贷款用户需在到期还款日前还款，逾期不还将依法报送人民银行征信系统，未来可能会对您找工作、办理签证、车贷、房贷造成影响。
    </p>

    <div class="common-btn" v-show="status > 1">
      <mt-button class="btn" disabled>{{restTime}}s后返回</mt-button>
    </div>

    <!-- <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      :modal="true"
      :closeOnClickModal="false">
      <div class="deal-success">
        <img class="deal-success-loan-gif" src="../../assets/img/deal-success-loan.gif" alt="">
        <div class="deal-success-txt">您的还款正在处理哦~请耐心等待</div>
      </div>
    </mt-popup> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import dealStep from '../components/dealStep'
  import loanPlan from '../components/loanPlan'

  export default {
    components: {
      dealStep,
      loanPlan
    },
    data() {
      return {
        popupVisible: false,
        // 借款处理状态 0提交成功 1银行处理中 2借款成功 3借款失败
        status: 0,
        // 是否刷新接口
        isRefresh: true,
        restTime: 5,
        payAmtInt: '',
        payAmtFlo: '',
        // 未还本金整数部分
        remainAmtInt: 0,
        // 未还本金小数部分
        remainAmtFlo: 0,
        // 处理进度文本信息
        dealInfo: {
          step1: '提交成功',
          step2: '银行处理中',
          step3: '还款成功'
        },
        // 还款计划
        loanPlanList: [],
        // 获取还款计划数据是否成功(默认成功)
        loanPlanListStatus: true
      }
    },
    created() {
      this.getRepayPlan()

      this.checkRepayDeal()

      let that = this
      let timer = setInterval(function() {
        that.checkRepayDeal()

        if (!that.isRefresh) {
          clearInterval(timer)
        }
      }, 3000)

      window.onresize = function() {
        console.log('onresize')
      }
    },
    methods: {
      // 更新还款处理结果状态
      updateRepayDealStatus() {
        let that = this

        let cashRepay = this.$store.state.common.common_cashRepay
        let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        let common_params = this.$store.state.common.common_params
        let ua = common_params.ua
        let call = 'Loan.singleTrans'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

        let paramString = JSON.stringify({
          ua: ua,
          call: call,
          args: {
            customerId: common_params.customerId,
            loanAcctNo: common_loanAcctInfo.loanAcctNo,
            // 单笔交易金额(交易后服务器返回)
            returnAmt: cashRepay.amount,
            // 单笔交易订单号(交易后服务器返回)
            oriMerchantOrderId: cashRepay.merchantOrderId
            // 单笔交易交易时间(交易后服务器返回)
            // oriPayTime:
          },
          sign: sign,
          timestamp: timestamp
        })

        this.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          // fix ios 底部tab空白
          setTimeout(function() {
            that.popupVisible = true
          }, 100)
          let data = res.data
          if (data.returnCode === '000000') {
            let res = data.response
            // this.transTime = res.transTime
            // transStus 0成功 1失败 2处理中 9订单不存在
            if (res.transStus === 0) {
              that.status = 2
              that.toast({
                message: '还款成功'
              })
              // this.transTimeS = res.transTime
            } else if (res.transStus === 1) {
              that.status = 3
              that.toast({
                message: '还款失败，请稍后重试'
              })
            } else if (res.transStus === 2) {
              that.status = 1
            } else if (res.transStus === 9) {
              that.status = 3
              that.toast({
                message: '订单不存在'
              })
            }

            // 返回处理结果后
            if (res.transStus !== 2) {
              that.popupVisible = false
              that.isRefresh = false
              that.updateLoanAcctInfo()
            }
          } else {
            that.popupVisible = false
            that.toast({
              message: data.returnMsg,
              duration: 1000
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 更新账户汇总信息
      updateLoanAcctInfo() {
        let that = this

        let cashRepay = this.$store.state.common.common_cashRepay
        // 账户汇总信息查询
        let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        let common_params = this.$store.state.common.common_params
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

        this.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          let data = res.data
          if (data.returnCode === '000000') {
            let loanAcctInfo = data.response
            // 更新汇总信息
            that.$store.commit('common_loanAcctInfo_save', loanAcctInfo)

            if (cashRepay.amount && cashRepay.merchantOrderId) { // 正常情况(有单笔交易信息)
              // 5秒倒计时
              let timer = setInterval(function() {
                that.restTime --
                if (that.restTime <= 1) {
                  clearInterval(timer)
                  that.checkLoanAcctInfo()
                  that.restTime = 5
                }
              }, 1000)
            } else { // 异常情况(借款处理中未出结果重新进入，无单笔交易信息)
              // 账户还款中冻结状态为0时，停止请求并关闭动画
              if (loanAcctInfo.payFrozenStus === '0') {
                that.isRefresh = false
                that.popupVisible = false
              }
              that.checkLoanAcctInfo()
            }
          } else {
            that.toast({
              message: data.returnMsg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      checkRepayDeal() {
        let that = this
        let cashRepay = this.$store.state.common.common_cashRepay
        console.log(cashRepay.amount, cashRepay.merchantOrderId)
        if (cashRepay.amount && cashRepay.merchantOrderId) {
          // 正常情况(有单笔交易信息): 不断更新单笔交易结果接口(Loan.singleTrans)
          this.updateRepayDealStatus()
        } else {
          // 异常情况(无单笔交易信息): 不断更新账户汇总信息(Loan.loanAcctInfo)
          this.popupVisible = true
          // fix ios 底部tab空白
          setTimeout(function() {
            that.popupVisible = true
          }, 100)
          this.updateLoanAcctInfo()
        }
      },
      // 还款计划表
      getRepayPlan() {
        let that = this
        let common_cashExtractDetail = this.$store.state.common.common_cashExtractDetail
        console.log(common_cashExtractDetail)
        let common_params = this.$store.state.common.common_params
        let loanAcctInfo = this.$store.state.common.common_loanAcctInfo

        // 单笔用款明细查询
        function cashExtractDetail() {
          return new Promise((resolve, reject) => {
            let ua = common_params.ua
            let call = 'Loan.cashExtractDetail'
            let timestamp = new Date().getTime()
            let sign = that.getSign(call, timestamp)

            let paramString = JSON.stringify({
              ua: ua,
              call: call,
              args: {
                customerId: common_params.customerId,
                loanAcctNo: loanAcctInfo.loanAcctNo
              },
              sign: sign,
              timestamp: timestamp
            })

            that.loading()
            that.$http.post(that.$store.state.common.common_api, paramString).then(res => {
              let data = res.data
              if (data.returnCode === '000000') {
                resolve(data.response)
                // 未还本金
                let remainAmt = data.response.remainAmt.toString()
                that.remainAmtInt = remainAmt.substring(0, remainAmt.length - 2)
                that.remainAmtFlo = remainAmt.substring(remainAmt.length - 2)
              } else {
                that.toast({
                  message: data.returnMsg
                })
                reject(data)
              }
            }).catch(err => {
              console.log(err)
              reject(err)
            })
          })
        }

        // 还款计划查询
        function getrepayPlan(cashExtractDetailData) {
          if (common_cashExtractDetail) {
            cashExtractDetailData = common_cashExtractDetail
          }
          return new Promise((resolve, reject) => {
            let ua = common_params.ua
            let call = 'Loan.repayPlan'
            let timestamp = new Date().getTime()
            let sign = that.getSign(call, timestamp)

            let paramString = JSON.stringify({
              ua: ua,
              call: call,
              args: {
                customerId: common_params.customerId,
                acctNo: loanAcctInfo.loanAcctNo,
                queryBegNum: 1,
                queryCnt: cashExtractDetailData.realInstalPeriod,
                dealFlg: 'B',
                paymentAmount: cashExtractDetailData.payOffAmt,
                installPeriod: cashExtractDetailData.realInstalPeriod,
                paygateOrderId: cashExtractDetailData.payGateOrderId
              },
              sign: sign,
              timestamp: timestamp
            })

            that.loading()
            that.$http.post(that.$store.state.common.common_api, paramString).then(res => {
              let data = res.data
              if (data.returnCode === '000000') {
                that.loanPlanList = data.response.list.splice(0, cashExtractDetailData.realInstalPeriod)
                resolve(data.response)
              } else {
                that.toast({
                  message: data.returnMsg
                })
                reject(data)
              }
            }).catch(err => {
              console.log(err)
              reject(err)
            })
          })
        }

        if (common_cashExtractDetail) { // common_cashExtractDetail单笔用款明细 缓存若存在优先使用缓存
          getrepayPlan().then(data => {
            that.loanPlanListStatus = true
          }).catch(err => {
            that.loanPlanListStatus = false
          })
        } else { // common_cashExtractDetail单笔用款明细 缓存若不存在(用户退出重进),重新获取一遍单笔用款明细
          cashExtractDetail().then(data => {
            return getrepayPlan(data)
          }).then(data => {
            that.loanPlanListStatus = true
          }).catch(err => {
            console.log(err)
            that.loanPlanListStatus = false
          })
        }
      },
      reGetRepayPlan() {
        this.loanPlanListStatus = true
        this.getRepayPlan()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/base.styl'
  @import '../../assets/css/loanRepayDeal.styl'

  .loan-deal
    width: 100%
    height: 100%

  .self-indicator-wrapper {
    margin: 0 auto;
    padding: 10px;
    color: #fff;
    box-sizing: border-box;
    text-align: center;
  }
  .self-indicator-spin {
    display: inline-block;
    text-align: center;
  }

  .self-spinner-fading-circle {
    position: relative;
  }
  .self-spinner-fading-circle > div::before {
    background-color: #000;
  }
  .self-spinner-fading-circle-circle {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
  .self-spinner-fading-circle-circle::before {
    content: " ";
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    -webkit-animation: self-fading-circle 1.2s infinite ease-in-out both;
    animation: self-fading-circle 1.2s infinite ease-in-out both
  }
  .self-spinner-fading-circle-circle.is-circle2 {
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg)
  }
  .self-spinner-fading-circle-circle.is-circle2::before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s
  }
  .self-spinner-fading-circle-circle.is-circle3 {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg)
  }
  .self-spinner-fading-circle-circle.is-circle3::before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s
  }
  .self-spinner-fading-circle-circle.is-circle4 {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg)
  }
  .self-spinner-fading-circle-circle.is-circle4::before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s
  }
  .self-spinner-fading-circle-circle.is-circle5 {
    -webkit-transform: rotate(120deg);
    transform: rotate(120deg)
  }
  .self-spinner-fading-circle-circle.is-circle5::before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s
  }
  .self-spinner-fading-circle-circle.is-circle6 {
    -webkit-transform: rotate(150deg);
    transform: rotate(150deg)
  }
  .self-spinner-fading-circle-circle.is-circle6::before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s
  }
  .self-spinner-fading-circle-circle.is-circle7 {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
  }
  .self-spinner-fading-circle-circle.is-circle7::before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s
  }
  .self-spinner-fading-circle-circle.is-circle8 {
    -webkit-transform: rotate(210deg);
    transform: rotate(210deg)
  }
  .self-spinner-fading-circle-circle.is-circle8::before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s
  }
  .self-spinner-fading-circle-circle.is-circle9 {
    -webkit-transform: rotate(240deg);
    transform: rotate(240deg)
  }
  .self-spinner-fading-circle-circle.is-circle9::before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s
  }
  .self-spinner-fading-circle-circle.is-circle10 {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg)
  }
  .self-spinner-fading-circle-circle.is-circle10::before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s
  }
  .self-spinner-fading-circle-circle.is-circle11 {
    -webkit-transform: rotate(300deg);
    transform: rotate(300deg)
  }
  .self-spinner-fading-circle-circle.is-circle11::before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s
  }
  .self-spinner-fading-circle-circle.is-circle12 {
    -webkit-transform: rotate(330deg);
    transform: rotate(330deg)
  }
  .self-spinner-fading-circle-circle.is-circle12::before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s
  }
  @-webkit-keyframes self-fading-circle {
    0%, 39%, 100% {
      opacity: 0
    }
    40% {
      opacity: 1
    }
  }
  @keyframes self-fading-circle {
    0%, 39%, 100% {
      opacity: 0
    }
    40% {
      opacity: 1
    }
  }
</style>
