<template>
  <div class="loan-deal">
    <mt-header fixed class="header" title="借款"></mt-header>

    <div class="deal-banner">
      <div class="status" v-show="status === 0">提交成功</div>
      <div class="status" v-show="status === 1">银行处理中</div>
      <div class="status" v-show="status === 2">借款成功</div>
      <div class="loan-amount">
        <span class="icon-money"></span>{{payAmtInt}}.<span class="decimals">{{payAmtFlo}}</span>
      </div>
    </div>

    <deal-step :status="status" :dealInfo="dealInfo"></deal-step>

    <p class="friendly-tip" style="margin: 62px 0;">
      <b>友情提示：</b>贷款用户需在到期还款日前还款，逾期不还将依法报送人民银行征信系统，未来可能会对您找工作、办理签证、车贷、房贷造成影响。
    </p>

    <div class="common-btn" v-show="status > 1">
      <mt-button class="btn" disabled>{{restTime}}s后返回</mt-button>
    </div>

    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      :modal="true"
      :closeOnClickModal="false">
      <div class="deal-success">
        <img class="deal-success-loan-gif" src="../../assets/img/deal-success-loan.gif" alt="">
        <div class="deal-success-txt">您的借款正在处理哦~请耐心等待</div>
      </div>
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import dealStep from '../components/dealStep'

  export default {
    components: {
      dealStep
    },
    data() {
      return {
        popupVisible: false,
        // 借款处理状态 0提交成功 1银行处理中 2借款成功 3借款失败
        status: 1,
        // 是否刷新接口
        isRefresh: true,
        restTime: 5,
        payAmtInt: 10000,
        payAmtFlo: '00',
        // 处理进度文本信息
        dealInfo: {
          step1: '提交成功',
          step2: '银行处理中',
          step3: '借款成功'
        }
      }
    },
    created() {
      let that = this
      this.popupVisible = true
      setTimeout(() => {
        that.popupVisible = false
        that.status = 2
        that.toast({
          message: '借款成功'
        })

        let timer = setInterval(() => {
          that.restTime --
          if (that.restTime === 0) {
            clearInterval(timer)
            that.restTime = 5
            that.$router.replace({name: 'repay'})
          }
        }, 1000)
      }, 3000)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/base.styl'
  @import '../../assets/css/loanRepayDeal.styl'

  .loan-deal
    width: 100%
    height: 100%
</style>
