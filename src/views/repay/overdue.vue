<template>
  <div class="loanRepayDesc">
    <mt-header fixed class="header" title="逾期还款">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

    <div class="banner">
      <div class="title">逾期应还</div>
      <div class="amount">
        <!--<span class="icon-money"></span> 691.<span class="decimals">14</span>-->
        <span class="icon-money"></span> {{minReturnAmountInt}}.<span class="decimals">{{minReturnAmountFlo}}</span>
      </div>
      <div class="overdue-time">已逾期{{ovdDayCnt}}天</div>
    </div>

    <div class="desc">
      <div class="item">
        <div class="name">本金：</div>
        <div class="value">{{baseUsedCreLine}}</div>
      </div>
      <div class="item">
        <div class="name">当前利息：</div>
        <div class="value">0.69元 <router-link to="/rate" class="calc-rate"></router-link></div>
      </div>
      <div class="item">
        <div class="name">还款借记卡：</div>
        <div class="value">尾号{{debitCardNo}}</div>
      </div>
      <div class="item">
        <div class="name">开卡银行：</div>
        <div class="value">{{decardOpenBank}}</div>
      </div>
      <div class="item">
        <div class="name">逾期滞纳金：</div>
        <div class="value">{{ovdFine}}元（3天内还款可免除）</div>
      </div>
    </div>

    <div class="common-btn" style="padding: 0 15px;margin-top: 20px;">
      <mt-button class="btn" :disabled="disabledBtn" @click="overdueRepayConfirm">立即还款</mt-button>
    </div>

    <ul class="friendly-tip" style="margin-top: 20px;">
      <li>特别提示：</li>
      <li>1.还款日自动还款，请注意还款卡内的余额是否足额</li>
      <li>2.扣款一旦成功，不可申请撤诉</li>
      <li>3.在逾期的宽限期3天内还款可免除滞纳费</li>
    </ul>

    <mt-popup
      v-model="hasPopup"
      popup-transition="popup-fade"
      position="center"
      :modal="true"
      :closeOnClickModal="false">
      <div class="popup-self-container">
        <div class="popup-self-wrapper">
          <h2 class="popup-self-title">请确保卡内余额充足！</h2>
          <div class="popup-self-btn-group">
            <span @click="cancel">取消</span>
            <span @click="confirm">确定</span>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 解除逾期状态所需偿还金额
        minReturnAmount: 0,
        minReturnAmountInt: 0,
        minReturnAmountFlo: 0,
        // 逾期天数
        ovdDayCnt: 0,
        // 本金
        baseUsedCreLine: 0,
        // 当前利息
        curInterest: 0,
        // 借记卡卡号
        debitCardNo: '',
        // 开户行
        decardOpenBank: '',
        // 逾期滞纳金
        ovdFine: 0,
        disabledBtn: false
      }
    },
    computed: {
      hasPopup: {
        get() {
          return this.$store.state.common.common_hasPopup
        },
        set() {}
      }
    },
    created() {
      let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
      this.minReturnAmount = common_loanAcctInfo.minReturnAmount
      let minReturnAmountStr = this.minReturnAmount.toString()
      if (minReturnAmountStr.length >= 3) {
        this.minReturnAmountInt = minReturnAmountStr.substring(0, minReturnAmountStr.length - 2)
        this.minReturnAmountFlo = minReturnAmountStr.substring(minReturnAmountStr.length - 2)
      } else {
        this.minReturnAmountInt = 0
        this.minReturnAmountFlo = this.minReturnAmount
      }
      this.ovdDayCnt = common_loanAcctInfo.ovdDayCnt
      this.baseUsedCreLine = common_loanAcctInfo.baseUsedCreLine / 100
      this.debitCardNo = common_loanAcctInfo.debitCardNo.substring(common_loanAcctInfo.debitCardNo.length - 4)
      this.decardOpenBank = common_loanAcctInfo.decardOpenBank

      // 逾期滞纳金
      if (this.baseUsedCreLine >= 0 && this.baseUsedCreLine <= 5000) {
        this.ovdFine = 5
      } else if (this.baseUsedCreLine > 5000 && this.baseUsedCreLine <= 10000) {
        this.ovdFine = 10
      } else if (this.baseUsedCreLine > 10000 && this.baseUsedCreLine <= 15000) {
        this.ovdFine = 15
      } else if (this.baseUsedCreLine > 15000 && this.baseUsedCreLine <= 20000) {
        this.ovdFine = 20
      }
    },
    methods: {
      back() {
        this.goBack()
      },
      overdueRepayConfirm() {
        this.$store.commit('common_hasPopup_save', true)
      },
      cancel() {
        this.$store.commit('common_hasPopup_save', false)
      },
      confirm() {
        this.$store.commit('common_hasPopup_save', false)
        this.overdueRepay()
      },
      overdueRepay() {
        let that = this

        this.disabledBtn = true

        let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        let common_params = this.$store.state.common.common_params
        let ua = common_params.ua
        let call = 'Loan.cashRepay'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

        let paramString = JSON.stringify({
          ua: ua,
          call: call,
          args: {
            customerId: common_params.customerId,
            loanAcctNo: common_loanAcctInfo.loanAcctNo,
            // 还款类别 1单笔结清还款 2逾期转正常还款(minReturnAmount) 3提前还当期还款(returnAmt) 4全部结清还款(realTotalAmount)
            returnType: 2,
            // 解除逾期状态所需偿还金额(客户逾期后欲解除逾期状时所需偿还的金额。还款金额为上期未还足的最低还款额其所剩余应还金额与余其其间所产生的滞纳费总和)
            amount: common_loanAcctInfo.minReturnAmount
          },
          sign: sign,
          timestamp: timestamp
        })

        this.loading()
        this.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          let data = res.data
          if (data.returnCode === '000000') {
            // 更新汇总信息
            that.$store.commit('common_loanAcctInfo_save', data.response.loanAcctInfo)
            that.$store.commit('common_cashRepay_save', data.response.cashRepay)
            that.checkLoanAcctInfo()
          } else {
            that.disabledBtn = false
            that.toast({
              message: data.returnMsg
            })

            // 重新获取账户汇总信息
            that.reGetLoanAcctInfo()
          }
        }).catch(err => {
          that.disabledBtn = false
          console.log(err)

          // 重新获取账户汇总信息
          that.reGetLoanAcctInfo()
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/css/loanRepay.styl'

.mint-popup
  width: 60%
  border-radius: 4px
.popup-self-container
  .popup-self-wrapper
    .popup-self-title
      padding: 20px 0
      font-size: 16px
      text-align: center
    .popup-self-btn-group
      display: flex
      border-top: 1px solid #999; /*no*/
      span
        flex: 1
        padding: 10px
        font-size: 14px
        text-align: center
        &:first-child
          margin-right: 4px
          border-right: 1px solid #999; /*no*/
</style>
