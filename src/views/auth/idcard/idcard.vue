<template>
  <div class="idcard">
		<mt-header fixed class="header" title="身份证认证">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
			<div slot="right">第1/4步</div>
    </mt-header>

		<div class="idcard-pic">
			<div class="idcard-pic-face">
				<p>身份证正面</p>
				<div class="pic-wrapper" @click="idcardFrontPrompt">
					<img src="../../../assets/img/icon-camera.png" alt="">
					<span>点击拍摄</span>
				</div>
			</div>
			<div class="idcard-pic-back">
				<p>身份证反面</p>
				<div class="pic-wrapper" @click="idcardBackPrompt">
					<img src="../../../assets/img/icon-camera.png" alt="">
					<span>点击拍摄</span>
				</div>
			</div>
		</div>

		<div class="prompt" style="margin-bottom: 9px;">
			<span class="icon-prompt"></span> 请填写本人真实身份证信息，以便通过公安部审核
		</div>

		<input type="text" class="input-item" style="margin-bottom: 14px;" placeholder="真实姓名">
		<input type="text" class="input-item" placeholder="身份证号码">

		<div class="common-btn" style="margin-top: 38px;">
      <mt-button class="btn" @click="submitIdcard">提 交</mt-button>
    </div>

		<mt-popup v-model="popupVisibleL" popup-transition="popup-fade" closeOnClickModal="true">
      <div class="sample-correct">
        <span class="title">正确示例</span>
        <img class="correct-img" src="../../../assets/img/idcard_front_correct.png" alt="">
      </div>
      <div class="sample-error">
        <span class="title">错误示例</span>
        <div class="error-img-wrapper">
          <div class="error-img-wrapper-l">
            <img class="error-img" src="../../../assets/img/idcard_front_wrong_1.png" alt="">
            <div class="txt">图像模糊</div>
          </div>
          <div class="error-img-wrapper-r">
            <img class="error-img" src="../../../assets/img/idcard_front_wrong_2.png" alt="">
            <div class="txt">图像不全</div>
          </div>
        </div>
      </div>
      <div class="to-shoot" @click="idcardFront">前往拍摄>></div>
    </mt-popup>
		<mt-popup v-model="popupVisibleR" popup-transition="popup-fade" closeOnClickModal="true">
      <div class="sample-correct">
        <span class="title">正确示例</span>
        <img class="correct-img" src="../../../assets/img/idcard_back_correct.png" alt="">
      </div>
      <div class="sample-error">
        <span class="title">错误示例</span>
        <div class="error-img-wrapper">
          <div class="error-img-wrapper-l">
            <img class="error-img" src="../../../assets/img/idcard_back_wrong_1.png" alt="">
            <div class="txt">图像模糊</div>
          </div>
          <div class="error-img-wrapper-r">
            <img class="error-img" src="../../../assets/img/idcard_back_wrong_2.png" alt="">
            <div class="txt">图像不全</div>
          </div>
        </div>
      </div>
      <div class="to-shoot" @click="idcardBack">前往拍摄>></div>
    </mt-popup>
	</div>
</template>

<script>
export default {
	data() {
		return {
			popupVisibleL: false,
			popupVisibleR: false
		}
	},
	methods: {
		back() {
			this.goBack()
		},
		idcardFrontPrompt() {
			this.popupVisibleL = true
		},
		idcardBackPrompt() {
			this.popupVisibleR = true
		},
		idcardFront() {},
		idcardBack() {},
		submitIdcard() {
			this.$router.push({name: 'bankcard'})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/auth'

.idcard
	padding: 0 15px
	.idcard-pic
		display: flex
		justify-content: space-around
		margin-bottom: 38px
		p
			padding: 33px 0 13px 0
			font-size: 15px
			color: rgb(51, 51, 51)
			text-align: center
		.pic-wrapper
			display: flex
			flex-direction: column
			align-items: center
			justify-content: space-around
			height: 100px
			border: 1px dotted rgb(70, 174, 70)
			border-radius: 6px
			img
				width: 49px
				height: 49px
			span
				color: rgb(70, 174, 70)
				font-size: 16px
		.idcard-pic-face
			flex: 1
			margin-right: 30px
		.idcard-pic-back
			flex: 1

.mint-popup
	width: 88.8%
	padding: 10px 20px
	text-align: center
	border-radius: 10px
	.title
		position: relative
		display: inline-block
		margin: 22px 0 11px 0
		text-align: center
		color: #333
		font-size: 14px
		&:before
			position: absolute
			content: ''
			left: -20px
			top: 50%
			width: 10px
			border-bottom: 1px solid #666
		&:after
			position: absolute
			content: ''
			right: -20px
			top: 50%
			width: 10px
			border-bottom: 1px solid #666
	.sample-correct
		.correct-img
			display: block
			width: 180px
			height: 115px
			margin: 0 auto
	.sample-error
		.error-img-wrapper
			display: flex
			justify-content: space-between
			.error-img
				width: 139px
				height: 88px
			.txt
				margin-top: 9px
				color: #999
				font-size: 11px
	.to-shoot
		margin: 50px 0 30px 0
		// color: main-color
		font-size: 17px
</style>
