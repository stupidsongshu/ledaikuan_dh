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
        <div class="num">500.0</div>
        <div class="txt">本金</div>
      </li>
      <li>
        <div class="num">0.09元</div>
        <div class="txt">
          当前利息<router-link to="/rate" class="calc-rate"></router-link>
        </div>
      </li>
    </ul>

    <div class="desc">
      <div class="item">
        <div class="name">还款借记卡：</div>
        <div class="value">尾号3225</div>
        <div class="right-btn">修改</div>
      </div>
      <div class="item">
        <div class="name">开户银行：</div>
        <div class="value">招商银行</div>
      </div>
      <div class="item">
        <div class="name">提前还款违约金：</div>
        <div class="value">{{realLiquidatedDamages / 100}}元</div>
      </div>
    </div>

    <div class="common-btn">
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
        transTime: '20180115',
        // 本金
        payAmt: 0,
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
    methods: {
      back() {
        this.goBack()
      },
      inAdvanceRepay() {
        this.$router.push({name: 'repayDeal'})
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/loanRepay.styl'
</style>
