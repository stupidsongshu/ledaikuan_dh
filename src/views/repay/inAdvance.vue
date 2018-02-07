<template>
  <div class="loanRepayDesc">
    <mt-header fixed class="header" title="提前还款">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

    <div class="banner">
      <div class="title">当前应还</div>
      <div class="amount">
        <span class="icon-money"></span> {{realTotalAmountInt}}.<span class="decimals">{{realTotalAmountFlo}}</span>
      </div>
      <div class="time">申请时间：{{transTime | dateFormat}}</div>
    </div>

    <ul class="two-col clearfix">
      <li>
        <div class="num">{{payAmt / 100}}元</div>
        <div class="txt">本金</div>
      </li>
      <li>
        <div class="num">{{intTot / 100}}元</div>
        <div class="txt">
          当前利息<router-link to="/rate" class="calc-rate"></router-link>
        </div>
      </li>
    </ul>

    <div class="desc">
      <div class="item">
        <div class="name">还款借记卡：</div>
        <div class="value">尾号{{debitCardNo}}</div>
        <div class="right-btn">修改</div>
      </div>
      <div class="item">
        <div class="name">开户银行：</div>
        <div class="value">{{decardOpenBank}}</div>
      </div>
      <div class="item">
        <div class="name">提前还款违约金：</div>
        <div class="value">{{realLiquidatedDamages / 100}}元</div>
      </div>
    </div>

    <div class="common-btn" style="margin-top: 20px;">
      <mt-button class="btn" @click="inAdvanceRepay" :disabled="disabledBtn">立即还款</mt-button>
    </div>

    <ul class="friendly-tip" style="margin-top: 20px;">
      <li><b>特别提示：</b></li>
      <li>1.提前还款请保证还款卡内余额充足</li>
      <li>2.还款日自动还款，请注意还款卡内的余额是否足额</li>
      <li>3.扣款一旦成功，不可申请撤销</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 单笔结清还款金额
        realTotalAmountInt: 0,
        realTotalAmountFlo: 0,
        transTime: '',
        // 本金
        payAmt: 0,
        // 利息
        intTot: 0,
        // 当前欠款
        totalLoanAmt: 0,
        // 借记卡卡号
        debitCardNo: '',
        // 开户行
        decardOpenBank: '',
        // 全额结清实际应还违约金（提前还款手续费）
        realLiquidatedDamages: 0,
        disabledBtn: false
      }
    },
    created() {
      let common_cashExtractDetail = this.$store.state.common.common_cashExtractDetail
      this.transTime = common_cashExtractDetail.transTime

      let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
      this.payAmt = common_loanAcctInfo.baseUsedCreLine
      this.intTot = common_loanAcctInfo.intTot
      this.totalLoanAmt = common_loanAcctInfo.totalLoanAmt
      this.debitCardNo = common_loanAcctInfo.debitCardNo.substring(common_loanAcctInfo.debitCardNo.length - 4)
      this.decardOpenBank = common_loanAcctInfo.decardOpenBank
      this.realLiquidatedDamages = common_loanAcctInfo.realLiquidatedDamages
      // 当前应还 = 本金 + 当前欠款 + 提前还款违约金 (注意:若逾期还需加上滞纳费)
      let realTotalAmount = common_loanAcctInfo.realTotalAmount.toString()
      this.realTotalAmountInt = realTotalAmount.substring(0, realTotalAmount.length - 2)
      this.realTotalAmountFlo = realTotalAmount.substring(realTotalAmount.length - 2)
    },
    methods: {
      back() {
        this.goBack()
      },
      inAdvanceRepay() {
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
            // 还款类别 2逾期转正常还款 4全部结清还款
            returnType: 4,
            // 还款金额
            amount: common_loanAcctInfo.realTotalAmount
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
              messahe: data.returnMsg
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
</style>
