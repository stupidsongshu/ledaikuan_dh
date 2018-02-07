<template>
  <div class="loanRepayDesc">
    <mt-header fixed class="header" title="按期还款">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

    <loan-plan v-if="loanPlanListStatus" :overflowScroll="false" :loanPlanList="loanPlanList"></loan-plan>
    <div v-if="!loanPlanListStatus" class="get-data-fail" @click="reGetRepayPlan">获取数据失败，点击重试</div>

    <ul class="friendly-tip" style="margin-top: 14px;">
      <li><b>特别提示：</b></li>
      <li>1.还款日自动还款，请注意还款卡内的余额是否足额</li>
      <li>2.扣款一旦成功，不可申请撤销</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import loanPlan from './../components/loanPlan'

  export default {
    components: {
      loanPlan
    },
    data() {
      return {
        // 还款计划
        loanPlanList: [],
        // 获取还款计划数据是否成功(默认成功)
        loanPlanListStatus: true
      }
    },
    created() {
      this.getRepayPlan()
    },
    methods: {
      back() {
        this.goBack()
      },
      // 还款计划表
      getRepayPlan() {
        let that = this

        let common_cashExtractDetail = this.$store.state.common.common_cashExtractDetail
        let common_params = this.$store.state.common.common_params
        let loanAcctInfo = this.$store.state.common.common_loanAcctInfo

        let ua = common_params.ua
        let call = 'Loan.repayPlan'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

        let paramString = JSON.stringify({
          ua: ua,
          call: call,
          args: {
            customerId: common_params.customerId,
            acctNo: loanAcctInfo.loanAcctNo,
            queryBegNum: 1,
            queryCnt: common_cashExtractDetail.realInstalPeriod,
            dealFlg: 'B',
            paymentAmount: common_cashExtractDetail.payOffAmt,
            installPeriod: common_cashExtractDetail.realInstalPeriod,
            paygateOrderId: common_cashExtractDetail.payGateOrderId
          },
          sign: sign,
          timestamp: timestamp
        })

        that.loading()
        that.$http.post(that.$store.state.common.common_api, paramString).then(res => {
          let data = res.data
          if (data.returnCode === '000000') {
            that.loanPlanListStatus = true
            that.loanPlanList = data.response.list.splice(0, common_cashExtractDetail.realInstalPeriod)
          } else {
            that.loanPlanListStatus = false
            that.toast({
              message: data.returnMsg
            })
          }
        }).catch(err => {
          console.log(err)
          that.loanPlanListStatus = false
        })
      },
      reGetRepayPlan() {
        this.loanPlanListStatus = true
        this.getRepayPlan()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loanRepayDesc
    height: 100%
    padding-top: 12px
</style>
