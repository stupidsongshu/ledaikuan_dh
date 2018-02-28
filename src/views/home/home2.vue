<template>
  <div class="index no-header" :class="{'has-footer': footer}">
    <div class="banner-wrapper">
      <div class="my"></div>
      <div class="kefu"></div>

      <div class="swiper-container banner-swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide banner-item" v-for="(item, index) in bannerList" :key="index">
            <a :href="item.imgDetailUrl" @click="bannerItemLink($event, item.imgDetailUrl)">
              <img :src="item.imgUrl" :alt="item.imgDesc" style="width: 100%;height: 100%;">
            </a>
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-white"></div>
      </div>
    </div>

    <div class="notice-wrapper">
      <div class="notice">
        <div class="icon"></div>
        <notice></notice>
      </div>
    </div>

    <div class="range">
      <div class="range-title">申请消费借款金额（元）</div>
      <div>
        <span class="icon-rmb"></span> <span class="loan-limit">{{loanLimit}}</span>
      </div>
      <div class="home-rate">
        费率说明 <router-link to="/rate" class="icon-rate"></router-link>
      </div>

      <mt-range v-model="loanLimit" :min="loanMin" :max="loanMax" :step="100" :bar-height="3"></mt-range>

      <div class="clearfix range-num">
        <span class="pull-left">{{loanMin}}</span>
        <span class="pull-right">{{loanMax}}</span>
      </div>

      <div class="select-month">
        <mt-button :class="{active: loanDuration === 3}" @click="selectLoanDuration(3)">3个月</mt-button>
        <mt-button :class="{active: loanDuration === 6}" @click="selectLoanDuration(6)">6个月</mt-button>
        <mt-button :class="{active: loanDuration === 12}" @click="selectLoanDuration(12)">12个月</mt-button>
      </div>
    </div>

    <div class="forbidden-wrapper">
      <span class="icon-forbidden"></span> 不向学生提供服务
    </div>

    <mt-button class="loan-btn" @click="loan">立即借款</mt-button>

    <div class="footer-txt">"乐贷款"由麦广互娱与中银消费金融联合打造</div>

    <!-- <mt-tabbar fixed v-if="deviceType === 'android'">
      <mt-tab-item id="loan">
        <div class="self-tab-item">
          <span class="isSelected">借款</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="my">
        <div class="self-tab-item">
          <span>我的</span>
        </div>
      </mt-tab-item>
    </mt-tabbar> -->
  </div>
</template>

<script>
import notice from "./../components/notice";
import Swiper from '../../../static/swiper/js/swiper.min'

export default {
  name: "home",
  components: {
    notice
  },
  data() {
    return {
      bannerList: []
    };
  },
  mounted() {
    // setTimeout(() => {
      var bannerSwiper = new Swiper(".banner-swiper-container", {
        pagination: ".swiper-pagination",
        paginationClickable: true,
        loop: true,
        speed: 600,
        autoplay: 3000,
        autoplayDisableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay，默认为true：停止。如果设置为false，用户操作(包括触碰，拖动，点击pagination等)swiper之后自动切换不会停止，每次都会重新启动autoplay。
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      });
      this.$http.get("http://ledaikuan.cn:8080/activity/Index/banner").then(res => {
        this.bannerList = res.data;
        this.$nextTick(() => {
        console.log(bannerSwiper);
        bannerSwiper.startAutoplay(); // 重新开始轮播
        bannerSwiper.reLoop(); // 重新计算slides个数
        });
			});
    // }, 0);
  },
  computed: {
    // 设备类型
    deviceType() {
      return this.$store.state.common.common_deviceType;
    },
    footer() {
      return this.$store.state.common.deviceType === "android";
    },
    // 最小额度
    loanMin() {
      return this.$store.state.loan.loan_min / 100;
    },
    // 最大额度
    loanMax() {
      return this.$store.state.loan.loan_max / 100;
    },
    // 申请额度(默认显示最大额度)
    loanLimit: {
      // getter
      get: function() {
        return this.$store.state.loan.loan_limit / 100;
      },
      // setter
      set: function(newValue) {
        this.$store.commit("loan_limit_save", newValue * 100);
      }
    },
    loanDuration() {
      return this.$store.state.loan.loan_duration;
    },
    activeTabIndex() {
      return this.$store.state.common.activeTabIndex;
    }
  },
  methods: {
    bannerItemLink(e, imgUrl) {
      if (imgUrl === "") e.preventDefault();
    },
    selectLoanDuration(time) {
      this.$store.commit("loan_duration_save", time);
    },
    loan() {
      let loanAcctInfo = this.$store.state.common.common_loanAcctInfo;

      // 判断应用初始化获取账户汇总信息是否成功(通过中银贷款账号是否存在进行判断)，获取失败后点击按钮重新获取账户汇总信息
      if (loanAcctInfo.loanAcctNo) {
        if (loanAcctInfo.creLineStus === "90") {
          this.$router.push("/inactivated");
        } else {
          this.$router.push({name: 'loan'});
        }
      } else {
        // 重新获取账户汇总信息
        // this.reGetLoanAcctInfo()

        // 重新初始化 防止第一步获取开户状态接口失败
        this.init();
      }
    },
    // 进入贷前'我的'
    // toMy() {
    //   /* eslint-disable no-undef */
    //   app.setLoanStatus(0);
    //   this.app.toMy1();
    // }
  }
};
</script>

<style lang="stylus">
  .swiper-container
    width: 100%
    height: 100%
    .swiper-pagination
        height: 16px
        padding-right: 15px
        text-align: right
  .my-bullet-active
    opacity: 1
    background-color: #fff

  .mt-range-runway
    border: 3px solid #b9e7b6 !important
    border-radius: 3px

  .mt-range-progress
    border: 3px solid #46ae46
    border-top-left-radius: 3px
    border-bottom-left-radius: 3px

  .mt-range-thumb
    width: 33px !important
    height: 33px !important
    background-image: url("../../assets/img/slider_money.png")
    background-size: 33px 33px
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '../../../static/swiper/css/swiper.min.css';

.index
  width: 100%
  height: 100%

  .banner-wrapper
    position: relative
    width: 100%
    height: 162px
    .my
      position: absolute
      top: 20px
      left: 15px
      width: 32px
      height: 32px
      background: url(../../assets/img/icon_my.png) no-repeat center/32px 32px
      z-index: 9
    .kefu
      position: absolute
      top: 20px
      right: 15px
      width: 32px
      height: 32px
      background: url(../../assets/img/icon_kefu.png) no-repeat center/32px 32px
      z-index: 9
      img
        width: 100%
        height: 162px

  .range
    width: 100%
    padding: 26px 15px 16px 15px
    text-align: center
    background-color #e7fee1
    box-shadow: 0 2px 5px #999
    .range-title
      color: #666
      font-size: 14px
    .icon-rmb
      display: inline-block
      width: 24px
      height: 32px
      background: url(../../assets/img/icon_money.png) no-repeat center / 24px 32px
    .loan-limit
      color: #46ae46
      font-size: 60px
    .home-rate
      display: flex
      justify-content: center
      align-items: center
      margin: 10px 0 20px 0
      color: #666
      font-size: 15px
      .icon-rate
        display: inline-block
        width: 15px
        height: 15px
        margin-left: 4px
        background: url(../../assets/img/icon_calc_circle.png) no-repeat center / 15px 15px

    .range-num
      width: 100%
      margin-top: 14px
      color: #999
      font-size: 16px
    .select-month
      display: flex
      justify-content: space-between
      width: 100%
      margin-top: 20px
      button
        flex: 1
        height: 36px
        color: #666
        border: 1px solid #46ae46
        border-top-left-radius: 18px
        border-bottom-left-radius: 18px
        border-top-right-radius: 18px
        border-bottom-right-radius: 18px
        background-color: transparent
        &:nth-child(2)
          margin: 0 6px
        &.active
          color: #fff
          border: none
          background-color: #46ae46

  .forbidden-wrapper
    margin: 10px 0
    color: #46ae46
    font-size: 14px
    text-align: center
    .icon-forbidden
      display: inline-block
      width: 14px
      height: 14px
      background: url(../../assets/img/icon_forbidden.png) no-repeat center/14px 14px

  .loan-btn
    display: block
    width: 300px
    height: 54px
    margin: 0 auto
    border-top-left-radius: 27px
    border-bottom-left-radius: 27px
    border-top-right-radius: 27px
    border-bottom-right-radius: 27px
    color: #fff
    font-size: 18px
    background-color: #ff6f00

  .footer-txt
    // position: absolute
    // left: 0
    // bottom: 54px
    // bottom: 0px
    width: 100%
    line-height: 44px
    text-align: center
    color: #999
    font-size: 12px

  .mint-tabbar
    height: 54px
    color: #d2d1d1
    background-color: #fff !important
    background-image: none
    border-top: 1px solid #d9d9d9; /*no*/
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

