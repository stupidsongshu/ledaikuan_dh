<template>
  <div class="step">
    <ul class="step-progress">
      <li class="step-content" :class="{active: status >= 0}">
        <div class="step-icon"></div>
      </li>
      <li class="step-content" :class="{active: status >= 1}">
        <div class="step-icon"></div>
      </li>
      <li class="step-content" :class="{active: status >= 2}">
        <div class="step-icon"></div>
      </li>
    </ul>

    <ul class="step-progress-txt">
      <li class="step-progress-txt-item" :class="{active: status >= 0}">{{dealInfo.step1}}</li>
      <li class="step-progress-txt-item" :class="{active: status >= 1}">{{dealInfo.step2}}</li>
      <li class="step-progress-txt-item" :class="{active: status >= 2}">{{dealInfo.step3}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      status: {
        type: Number,
        default: 0
      },
      dealInfo: {
        type: Object
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/css/base.styl'

  .step
    padding: 15px 0
    background-color: #fff
    .step-progress
      display: flex
      height: 27px
      .step-content
        position: relative
        flex-grow: 1
        text-align: center
        font-size: 14px
        .step-icon
          position: absolute
          width: 27px
          height: 27px
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
          background-image: url('../../assets/img/icon_deal_not.png')
          background-size: 100% 100%
          z-index: 10
        .step-desc
          margin-top: 11px
          color: #666
        &:before
          position: absolute
          content: ''
          top: 50%
          left: -50%
          width: 100%
          transform: translateY(-50%)
          border: 3px solid #dcdcdc
          z-index: 9
        &:first-child:before
          border: none
        &.active
          .step-icon
            background-image: url('../../assets/img/icon_deal_active.png')
          .step-desc
            color: main-color
          &:before
            border: 3px solid main-color
            z-index: 11
          &:first-child:before
            border: none
    .step-progress-txt
      display: flex
      margin-top: 14px
      font-size: 14px
      .step-progress-txt-item
        flex-grow: 1
        text-align: center
        &.active
          color: main-color
</style>
