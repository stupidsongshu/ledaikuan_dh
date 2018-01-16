<template>
  <div class="loanRepayDesc">
    <mt-header fixed class="header" title="按期还款">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

    <loan-plan v-if="loanPlanListStatus" :overflowScroll="false" :loanPlanList="loanPlanList"></loan-plan>

    <div v-if="!loanPlanListStatus" class="get-data-fail" @click="">获取数据失败，点击重试</div>

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
      this.loanPlanList = [
        {
          paymentPeriod: 1,
          preAmt: 47916.666666666664,
          preFee: 6250,
          prePayDay: '20180214',
          prePrin: 41666.666666666664
        },
        {
          paymentPeriod: 2,
          preAmt: 47916.666666666664,
          preFee: 6250,
          prePayDay: '20180214',
          prePrin: 41666.666666666664
        },
        {
          paymentPeriod: 3,
          preAmt: 47916.666666666664,
          preFee: 6250,
          prePayDay: '20180214',
          prePrin: 41666.666666666664
        }
      ]
    },
    methods: {
      back() {
        this.goBack()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loanRepayDesc
    height: 100%
    padding-top: 12px
</style>
