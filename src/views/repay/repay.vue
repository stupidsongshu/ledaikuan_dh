<template>
  <div class="repay" :class="{'has-footer': footer}">
    <mt-header fixed class="header" title="还款"></mt-header>

    <div v-if="hasRepay">
      <div class="banner">
        <div class="title">未还本金</div>
        <div class="amount" v-if="transTime">
          <span class="icon-money"></span> {{remainAmtInt}}.<span class="decimals">{{remainAmtFlo}}</span>
        </div>
        <div class="time" v-if="transTime">申请时间：{{transTime | dateFormat}}</div>
        <div class="time" v-if="!transTime" @click="getCashExtractDetail">获取数据失败，点击重试</div>
      </div>

      <div class="card-wrapper">
        <div class="card" v-if="!overdue" @click="onTimeRepay">
          <div class="card-l">
            <div class="card-l-t">按期还款</div>
            <div class="card-l-b">还款日将自动还款</div>
          </div>
          <!--<div class="card-m">
            <div class="card-m-t">691.14元</div>
            <div class="card-m-b">2017年08月27日</div>
          </div>-->
          <div class="card-r">
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>

      <div class="card-wrapper">
        <div class="card" v-if="overdue" @click="overdueTimeRepay">
          <div class="card-l">
            <div class="card-l-t">按期还款</div>
            <div class="card-l-b">还款日将自动还款</div>
          </div>
          <div class="card-m">
            <div class="txt">已逾期</div>
          </div>
          <div class="card-r">
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>

      <div class="card-wrapper">
        <div class="card" @click="inAdvanceRepay">
          <div class="card-l">
            <div class="card-l-t">提前还款</div>
            <div class="card-l-b">可提前结清所有借款</div>
          </div>
          <div class="card-r">
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>

      <div class="friendly-tip" style="margin-top: 62px;">
        <b>友情提示：</b>请您在到期还款日前还款，逾期不还将依法报送人民银行征信系统，未来可能会对您找工作，办理签证、车贷、房贷造成影响。
      </div>
    </div>

    <!--<div class="no-repay" v-if="!hasRepay">
      <img class="no-repay-img" src="../../assets/img/no-repay.png" alt="">
      <div class="no-repay-txt">暂无账单</div>
    </div>-->


    <!--<mt-tabbar fixed v-if="deviceType === 'android'">
      <mt-tab-item>
        <div class="self-tab-item">
          <img slot="icon" src="../../assets/img/bottom_icon_02_click.png">
          <span class="isSelected">还款</span>
        </div>
      </mt-tab-item>
      <mt-tab-item>
        <div class="self-tab-item" @click="toMy">
          <img slot="icon" src="../../assets/img/bottom_icon_03_nor.png">
          <span>我的</span>
        </div>
      </mt-tab-item>
    </mt-tabbar>-->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        // 是否有贷款
        hasRepay: true,
        // 还款是否逾期
        overdue: false,
        transTime: '',
        // 未还本金整数部分
        remainAmtInt: 0,
        // 未还本金小数部分
        remainAmtFlo: 0
      }
    },
    computed: {
      // 设备类型
      deviceType() {
        return this.$store.state.common.deviceType
      },
      footer() {
        return this.$store.state.common.deviceType === 'android'
      }
    },
    created() {
      this.getCashExtractDetail()
    },
    methods: {
      getCashExtractDetail() {
        let that = this

        let loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        if (loanAcctInfo) {
          // 逾期状态 1逾期 2正常
          if (loanAcctInfo.overdueStatus === 1) {
            this.overdue = true
          } else if (loanAcctInfo.overdueStatus === 2) {
            this.overdue = false
          }
        }

        // 单笔用款明细查询
        let common_params = this.$store.state.common.common_params
        let ua = common_params.ua
        let call = 'Loan.cashExtractDetail'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

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
        that.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          let data = res.data
          if (data.returnCode === '000000') {
            // 未还本金
            let remainAmt = data.response.remainAmt.toString()
            that.remainAmtInt = remainAmt.substring(0, remainAmt.length - 2)
            that.remainAmtFlo = remainAmt.substring(remainAmt.length - 2)
            // 申请时间
            that.transTime = data.response.transTime
            that.$store.commit('common_cashExtractDetail_save', data.response)
          } else {
            that.toast({
              message: data.returnMsg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onTimeRepay() {
        if (this.transTime) {
          this.$router.push('/repay/onTime')
        } else {
          this.getCashExtractDetail()
        }
      },
      overdueTimeRepay() {
        if (this.transTime) {
          this.$router.push('/repay/overdue')
        } else {
          this.getCashExtractDetail()
        }
      },
      inAdvanceRepay() {
        if (this.transTime) {
          this.$router.push('/repay/inAdvance')
        } else {
          this.getCashExtractDetail()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/base.styl'

  .repay
    .banner
      display: flex
      flex-direction: column
      justify-content: space-around
      align-items: center
      width: 100%
      height: 166px
      padding: 10px 0
      color: #fff
      background-image: url("../../assets/img/icon_banner.png")
      background-size: 100% 166px
      .title
        font-size: 17px
      .amount
        font-size: 48px
        .icon-money
          display: inline-block
          width: 19px
          height: 25px
          background-image: url('../../assets/img/icon_money.png')
          background-size: 19px 25px
        .decimals
          font-size: 31px
      .time
        font-size: 13px

    .card-wrapper
      padding: 0 15px
      .card
        display: flex
        justify-content: space-between
        align-items: center
        width: 100%
        height: 79px
        margin-top: 15px
        padding-left: 23px
        padding-right: 21px
        border-radius: 5px
        background-color: #fff
        .card-l
          flex-grow: 2
          .card-l-t
            margin-bottom: 13px
            color: #333
            font-size: 17px
          .card-l-b
            color: #999
            font-size: 13px
        /*.card-m
          flex-grow: 2
          text-align: right
          .card-m-t
            margin-bottom: 13px
            color: main-color
            font-size: 17px
          .card-m-b
            color: #999
            font-size: 11px
          .overdue
            color: #f00
            font-size: 11px*/
        .card-m
          .txt
            color: #f00
            font-size: 17px

        .card-r
          text-align: right
          flex-grow: 1
          color: #999
          font-size: 30px

    .no-repay
      text-align: center
      .no-repay-img
        width: 73px
        height: 90px
        margin-top: 186px
      .no-repay-txt
        margin-top: 21px
        color: #999
        font-size: 15px

    .mint-tabbar
      height: 54px
      color: #d2d1d1
      background-color: #fff !important
      background-image: none
      border-top: 1px solid #d9d9d9
      .mint-tab-item
        &.is-selected
          color: #d2d1d1
          background-color: #fff !important
      .self-tab-item
        display: flex
        flex-direction: column
        color: #d2d1d1
        .isSelected
          color: #daab5b !important
        img
          width: 24px
          height: 24px
          margin: 0 auto 5px auto
</style>
