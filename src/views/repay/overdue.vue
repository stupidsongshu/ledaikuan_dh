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
        <span class="icon-money"></span> {{minReturnAmount}}
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

    <div class="common-btn">
      <mt-button class="btn" :disabled="disabledBtn" @click="">立即还款</mt-button>
    </div>

    <ul class="friendly-tip" style="margin-top: 20px;">
      <li>特别提示：</li>
      <li>1.还款日自动还款，请注意还款卡内的余额是否足额</li>
      <li>2.扣款一旦成功，不可申请撤诉</li>
      <li>3.在逾期的宽限期3天内还款可免除滞纳费</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 解除逾期状态所需偿还金额
        minReturnAmount: 0,
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
    methods: {
      back() {
        this.goBack()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/loanRepay.styl'
</style>
