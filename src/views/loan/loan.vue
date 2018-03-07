<template>
  <div class="loan">
    <mt-header fixed class="header" title="立即借款">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>

    <div class="banner-wrapper">
      <div class="banner-container">
        <div class="title"><i class="icon-rate"></i><span>借款金额</span></div>
        <div>
          <span class="icon-money"></span><span class="loan-amount">{{loanLimit}}</span>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="loan-purpose-wrapper">
        <span class="loan-purpose-name color999">贷款用途：</span>
        <div class="loan-purpose-select" @click="selectPurpose">
          <input type="text" placeholder="请选择" v-model="purpose" readonly onfocus="this.blur()">
          <i class="fa fa-angle-right color999"></i>
        </div>
      </div>

      <div class="loan-item">
        <div class="item-l">
          <span class="name">贷款期数：</span>
          <span class="value">{{loanDuration}}期</span>
        </div>
        <div class="item-r">
          <span class="name">日利率：</span>
          <span class="value">{{dayRate}}%</span>
        </div>
      </div>

      <div class="loan-item">
        <span class="name">收款银行：</span>
        <span class="value" v-if="openBank">
          {{openBank}}（尾号{{creditcardNo}}）
        </span>
        <!--<div class="calc-rate-wrapper">
          <router-link to="/rate" class="calc-rate"></router-link>
        </div>-->
      </div>

      <div class="loan-item">
        <div class="agreement-wrapper">
          <input type="checkbox" id="agreementInput" :checked="checked" @click="toggleAgree">
          <label class="agreement-label" for="agreementInput">我同意并知晓</label>
          <a v-if="deviceType === 'android'" class="agreement" href="http://xfjr.ledaikuan.cn/ledaikuan/agreement/loan_protocol_additional.html">《借款协议》</a>
          <a v-if="deviceType === 'iphone'" class="agreement" @click="loanAgreementPage">《借款补充协议》</a>
        </div>
      </div>

      <div class="loan-code">
        <span class="code-name">验证码：</span>
        <div class="code-input-wrapper">
          <!--<input class="code-input" type="number" placeholder="请输入短信验证码" v-model="vcode" oninput=" if(value.length>6){value = value.slice(0,6)}">-->
          <input class="code-input" type="text" placeholder="请输入短信验证码" v-model="vcode" :keyup="write(vcode)">
          <!--<input class="code-input" type="text" placeholder="请输入短信验证码" v-model="vcode" @keyup="write1($event, vcode)">-->
          <button class="code-btn" v-show="!hasGetCode" @click="getCode">发送验证码</button>
          <button class="code-btn" v-show="hasGetCode">{{time}}s后重新获取</button>
        </div>
      </div>
    </div>

    <div class="common-btn" style="margin: 15px 0;padding: 0 15px;">
      <mt-button class="btn" @click="loanBtn" :disabled="!checked">立即借款</mt-button>
    </div>

    <loan-plan v-if="loanPlanListStatus" :overflowScroll="false" :loanPlanList="loanPlanList"></loan-plan>
    <div v-if="!loanPlanListStatus" class="get-data-fail" @click="reGetLoanPlan">获取数据失败，点击重试</div>

    <mt-popup
      v-model="hasPopup"
      popup-transition="popup-fade"
      position="bottom"
      :modal="true"
      :closeOnClickModal="false"
      id="loanPlanPopup">
      <div class="picker-nav">
        <div class="picker-btn picker-btn-l color999">请选择用途</div>
        <div class="picker-btn picker-btn-r" @click="ensure">确定</div>
      </div>
      <mt-picker :slots="loanPurposeSlot" @change="onChange" value-key="loanPurpose" :visible-item-count="5" :item-height="40"></mt-picker>
    </mt-popup>

  </div>
</template>

<script type="text/ecmascript-6">
  import loanPlan from '../components/loanPlan'

  export default {
    components: {
      loanPlan
    },
    data() {
      return {
        purpose: '',
        loanPurposeSlot: [{
          flex: 1,
          values: [],
          className: 'slot'
        }],
        loanPurposeValues: [],
        vcode: '',
        loanUseId: '',
        hasGetCode: false,
        time: 60,
        loanPlanList: [],
        checked: true,
        // 获取还款计划数据是否成功(默认成功)
        loanPlanListStatus: true
      }
    },
    computed: {
      dayRate() {
        return this.$store.state.common.common_loanAcctInfo.nowDayRate
      },
      openBank() {
        return this.$store.state.common.common_loanAcctInfo.decardCardIssuerName
      },
      creditcardNo() {
        return this.$store.state.common.common_loanAcctInfo.debitCardNo.substr(-4)
      },
      // 设备类型
      deviceType() {
        return this.$store.state.common.common_deviceType
      },
      loanLimit() {
        return this.$store.state.loan.loan_limit / 100
      },
      loanDuration() {
        return this.$store.state.loan.loan_duration
      },
      // hasPopup() {
      //   return this.$store.state.common.common_hasPopup
      // },
      hasPopup: {
        get() {
          return this.$store.state.common.common_hasPopup
        },
        set() {
          
        }
      }
    },
    created() {
      // 还款试算
      this.getRepayPlan()
      // 借款用途随机排序
      this.randomSortLoanPurpose()
    },
    methods: {
      toggleAgree() {
        this.checked = !this.checked
      },
      write(val) {
        if (val.length > 6) {
          this.vcode = this.vcode.substr(0, 6)
        }

        if (!/^\d+$/g.test(val)) {
          this.vcode = ''
        }
      },
      write1(e, val) {
        if (val.length > 6) {
          console.log(this.vcode)
          this.vcode = this.vcode.substr(0, 6)
        }
        // let keyCode = e.keyCode
        // console.log(keyCode)
        // if ((keyCode >= 48 && keyCode <= 57) || keyCode === ) {}

        // console.log(e.key)
        // let keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'backsapce', 'enter']
        // let bool = keys.some(val => {
        //   return e.key.toLowerCase() === val
        // })
        // if (!bool) {
        // }
      },
      // ios 交互加载外链
      loanAgreementPage() {
        if (window.webkit !== undefined && window.webkit.messageHandlers !== undefined) {
          try {
            window.webkit.messageHandlers.loanAgreementPage.postMessage('')
          } catch (err) {
            console.log(err)
          }
        } else {
          console.log('调用ios接口失败！')
        }
      },
      selectPurpose() {
        this.$store.commit('common_hasPopup_save', true)

        // 借款用途随机排序
        this.randomSortLoanPurpose()

        // fix 弹窗滑动的时候底层页面跟随滚动
        document.getElementById('loanPlanPopup').addEventListener('touchmove', function(event) {
          event.preventDefault()
        }, false)

        // fix 不打开popup借款用途默认无值,打开后必须选值
        if (this.loanPurposeValues.length > 10) {
          // delete the first blank value
          this.loanPurposeValues.shift()
          this.loanPurposeSlot[0].values = this.loanPurposeValues
        }
      },
      ensure() {
        this.$store.commit('common_hasPopup_save', false)
      },
      // change 事件有两个参数，分别为当前 picker 的 vue 实例和各 slot 被选中的值组成的数组
      onChange(picker, values) {
        let info = values[0]
        if (info !== undefined) {
          this.purpose = info.loanPurpose
          this.loanUseId = info.id
          if (info.loanPurpose === ' ') {
            this.purpose = ''
          }
        }
      },
      // 借款用途随机排序
      randomSortLoanPurpose() {
        this.loanPurposeValues = [
          {
            id: '1',
            loanPurpose: '装修'
          },
          {
            id: '2',
            loanPurpose: '婚庆'
          },
          {
            id: '3',
            loanPurpose: '旅游'
          },
          {
            id: '4',
            loanPurpose: '教育'
          },
          {
            id: '5',
            loanPurpose: '租房'
          },
          {
            id: '6',
            loanPurpose: '汽车周边'
          },
          {
            id: '7',
            loanPurpose: '电子数码产品'
          },
          {
            id: '8',
            loanPurpose: '医疗'
          },
          {
            id: 'A',
            loanPurpose: '家用电器'
          },
          {
            id: 'B',
            loanPurpose: '家具家居'
          }
        ]
        function randomSort() {
          return Math.random() > 0.5 ? -1 : 1
        }
        this.loanPurposeValues.sort(randomSort)
        this.loanPurposeValues.unshift({
          id: '0',
          loanPurpose: ' '
        })
        this.loanPurposeSlot[0].values = this.loanPurposeValues
      },
      // 还款试算
      getRepayPlan() {
        let that = this

        let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        let common_params = this.$store.state.common.common_params

        let ua = common_params.ua
        let call = 'Loan.repayPlan'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

        let paramString = JSON.stringify({
          ua: ua,
          call: call,
          args: {
            customerId: common_params.customerId,
            acctNo: common_loanAcctInfo.loanAcctNo,
            queryBegNum: 1,
            queryCnt: this.loanDuration,
            dealFlg: 'A',
            paymentAmount: this.loanLimit * 100,
            installPeriod: this.loanDuration
          },
          sign: sign,
          timestamp: timestamp
        })

        this.loading()
        this.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          let data = res.data
          if (data.returnCode === '000000') {
            this.loanPlanListStatus = true
            this.loanPlanList = data.response.list.splice(0, this.loanDuration)
          } else {
            this.toast({
              message: data.returnMsg
            })
            this.this.loanPlanListStatus = false
          }
        }).catch(err => {
          console.log(err)
          this.loanPlanListStatus = false
        })
      },
      reGetLoanPlan() {
        this.loanPlanListStatus = true
        this.getRepayPlan()
      },
      // 获取验证码
      getCode() {
        let that = this

        let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        let common_params = this.$store.state.common.common_params
        let ua = common_params.ua
        let call = 'Boccfc.dyanmicPwd'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

        let paramString = JSON.stringify({
          ua: ua,
          call: call,
          args: {
            customerId: common_params.customerId,
            mobileNo: common_loanAcctInfo.mobileNo,
            acctNo: common_loanAcctInfo.loanAcctNo
          },
          sign: sign,
          timestamp: timestamp
        })

        this.loading()
        this.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          if (res.data.response === '000000') {
            that.hasGetCode = true
            let timer = setInterval(() => {
              that.time --
              if (that.time === 0) {
                that.hasGetCode = false
                that.time = 60
                clearInterval(timer)
              }
            }, 1000)
          } else {
            that.toast({
              message: res.data.returnMsg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 借款
      loanBtn() {
        let that = this

        if (this.purpose === '') {
          this.toast({
            message: '请选择贷款用途'
          })
          return
        }
        if (this.vcode.trim() === '') {
          this.toast({
            message: '请先获取验证码'
          })
          return
        }

        let common_loanAcctInfo = this.$store.state.common.common_loanAcctInfo
        let common_params = this.$store.state.common.common_params
        let ua = common_params.ua
        let call = 'Loan.cashExtract'
        let timestamp = new Date().getTime()
        let sign = this.getSign(call, timestamp)

        let paramString = JSON.stringify({
          ua: ua,
          call: call,
          args: {
            customerId: common_params.customerId,
            loanAcctNo: common_loanAcctInfo.loanAcctNo,
            amount: this.loanLimit * 100,
            instalPeriod: this.loanDuration,
            comUseType: this.loanUseId,
            dynamicPwd: this.vcode
          },
          sign: sign,
          timestamp: timestamp
        })

        that.loading()
        that.$http.post(this.$store.state.common.common_api, paramString).then(res => {
          let data = res.data
          if (data.returnCode === '000000') {
            let dataS = data.response
            // 更新汇总信息
            that.$store.commit('common_loanAcctInfo_save', dataS.loanAcctInfo)
            that.$store.commit('common_cashExtract_save', dataS.cashExtract)
            that.checkLoanAcctInfo()
          } else {
            that.toast({
              message: data.returnMsg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/base.styl'

  #agreementInput
    display: none
  .agreement-label:before
    content: ''
    display: inline-block
    position: relative
    top: 2px
    margin-right: 4px
    width: 12px
    height: 12px
    border: 1px solid #ccc; /*no*/
  #agreementInput:checked + .agreement-label:before
    background: url('../../assets/img/icon_checked.png') no-repeat center / 12px 12px

  .loan
    .banner-wrapper
      width: 100%
      height: 132px
      padding: 12px 15px
      .banner-container
        display: flex
        flex-direction: column
        justify-content: center
        width: 100%
        height: 108px
        padding-right: 15px
        text-align: right
        color: main-color
        background-image: url("../../assets/img/loan-banner.png")
        background-size: 100% 100%
        .title
          .icon-rate
            display: inline-block
            width: 14px
            height: 16px
            margin-right: 8px
            background-image: url("../../assets/img/icon_calc.png")
            background-size: 100% 100%
          span
            font-size: 15px
            vertical-align: 2px
        .icon-money
          display: inline-block
          width: 19px
          height: 25px
          background-image: url('../../assets/img/icon_money.png')
          background-size: 19px 25px
        .loan-amount
          font-size: 42px


    .content-wrapper
      font-size: 14px
      background-color: #fff
      .loan-purpose-wrapper
        display: flex
        height: 54px
        padding: 0 15px
        border-bottom: 1px solid #e3e3e3; /*no*/
        .loan-purpose-name
          flex-basis: 80px
          width: 80px
          display: flex
          align-items: center
          // fix 相对右边偏高
          padding-top: 2px
        .loan-purpose-select
          flex: 1
          display: flex
          justify-content: space-between
          align-items: center
          height: 100%
          input
            flex-grow: 2
            height: 100%
            color: color999
            border: none
            background-color: transparent
          i
            flex-grow: 1
            text-align: right
            font-size: 30px

      .loan-item
        display: flex
        padding: 0 15px
        line-height: 40px
        border-bottom: 1px solid #e3e3e3; /*no*/
        .item-l
          display: flex
          width: 50%
        .item-r
          display: flex
          width: 50%

        .name
          width: 80px
          flex-basis: 80px
          color: #999
        .value
          color: #333
        /*.calc-rate-wrapper
          flex: 1
          text-align: center
          .calc-rate
            display: inline-block
            width: 14px
            height: 16px
            margin-left: 4px
            vertical-align: -3px
            background-image: url("../../assets/img/icon_rate.png")
            background-size: 100% 100%*/
        .agreement-wrapper
          font-size: 13px
          input
            width: 14px
            height: 14px
            outline: none
            border: 1px solid main-color; /*no*/
          .agreement
            color: main-color

      .loan-code
        display: flex
        padding: 0 15px
        line-height: 40px
        border-bottom: 1px solid #e3e3e3; /*no*/
        .code-name
          flex-basis: 80px
          width: 80px
          color: #999
        .code-input-wrapper
          position: relative
          flex: 1
          .code-input
            border: none
          .code-btn
            position: absolute
            top: 50%
            right: 0
            transform: translateY(-50%)
            padding-left: 6px
            white-space: nowrap
            color: main-color
            font-size: 13px
            border: none
            border-left: 1px solid main-color; /*no*/
            background-color: transparent

    .picker-nav
      display: flex
      justify-content: space-between
      padding: 5px 15px
      font-size: 14px
      .picker-btn
        line-height: 25px
        text-align: center
        &.picker-btn-r
          width: 56px
          height: 25px
          border-radius: 4px
          color: #fff
          font-size: 12px
          background-color: main-color
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .mint-popup
    width: 100%
  .picker-item
    color: #ccc
</style>

