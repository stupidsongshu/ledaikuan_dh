<template>
  <div class="rate">
    <mt-header fixed class="header" title="费用说明">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

    <div class="">
      <h1 class="rate-title color333">一、贷款费用说明</h1>
      <p class="indent color666">乐贷款的到账金额即是申请金额，不收取信审费、管理费、平台费等额外费用。贷款费用按实际贷款天数收取，日息因客户资质差异分为0.3‰、0.4‰、0.5‰、0.6‰、0.98‰五档。贷款期限可分为3个月、6个月和12个月，也可提前一次性还清欠款，需另外收取全部贷款金额的2%作为提前还款违约金。</p>
    </div>
    <div>
      <h1 class="rate-title color333">二、逾期费用说明</h1>
      <p class="indent color666">当您贷款未按期还款时，我们将根据贷款金额的不同，按日收取逾期综合费用。收取规则如下：</p>
      <ul class="overdue-fee-list color666">
        <li>
          <div class="color333">本金金额</div>
          <div class="color333">逾期综合费用/天</div>
        </li>
        <li>
          <div>0~5000元（含）</div>
          <div>5元</div>
        </li>
        <li>
          <div>5000元~10000元（含）</div>
          <div>10元</div>
        </li>
        <li>
          <div>10000元~15000元（含）</div>
          <div>15元</div>
        </li>
        <li>
          <div>15000元~20000元（含）</div>
          <div>20元</div>
        </li>
      </ul>
      <div class="color666">逾期后，应还金额为：</div>
      <h1 class="overdue-total-fee color333">贷款金额+利息(贷款金额*日息*借款天数)+逾期综合费用</h1>
    </div>

    <div class="">
      <h1 class="rate-title color333">三、友情提示</h1>
      <p class="indent color666">请保持良好的还款习惯，否则将影响您在乐贷款的信用额度、贷款申请通过率及人行征信的信用评分。</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      back() {
        this.goBack()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .rate
    padding: 0 15px
    padding-bottom: 15px
    font-size: 12px
    .rate-title
      line-height: 50px
      font-size: 14px
      font-weight: bold
    .indent
      text-indent: 2em
      font-size: 12px
      line-height: 20px
    .overdue-fee-list
      width: 100%
      margin: 20px 0
      padding: 10px 0
      line-height: 24px
      border: 1px solid #d9d9d9
      background-color: #fff
      li
        display: flex
        justify-content: space-around
        div
          width: 100%
          text-align: center
    .overdue-total-fee
      margin-top: 10px
      font-size: 12px
      font-weight: bold
</style>
