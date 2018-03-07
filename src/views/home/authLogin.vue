<template>
  <div class="authLogin">
		<mt-header fixed class="header" title="授权登录">
			<div slot="left" @click="back">
				<mt-button icon="back"></mt-button>
			</div>
		</mt-header>

		<div class="item">
			<span class="icon-phone"></span>
			<span>182******57</span>
		</div>
		<div class="item">
			<span class="icon-message"></span>
			<input class="code" type="text" placeholder="请输入验证码">
			<span class="get-code" v-if="!hasGetCode" @click="getCode">获取验证码</span>
			<span class="get-code" v-if="hasGetCode">{{time}}s后重新获取</span>
		</div>

		<div class="common-btn" style="margin-top: 90px;padding: 0 15px;">
			<mt-button class="btn">授权登录</mt-button>
		</div>
		<div class="auditLogin-prompt">请确保授权手机号为实名认证手机号</div>
  </div>
</template>

<script>
export default {
  data() {
		return {
			time: 60,
			hasGetCode: false
		}
	},
	methods: {
		back() {
			this.goBack()
		},
		getCode() {
			this.hasGetCode = true
			let timer = setInterval(() => {
				this.time--
				if (this.time === 0) {
					clearInterval(timer)
					this.hasGetCode = false
					this.time = 60
				}
			}, 1000)
		}
	}
}
</script>

<style lang="stylus" scoped>
.authLogin
	padding-top: 56px
	font-size: 14px
	.item
		display: flex
		align-items: center
		width: 100%
		height: 30px
		padding: 0 27px
		margin-bottom: 36px
		.icon-phone
			width: 25px
			height: 25px
			margin-right: 15px
			background: url(../../assets/img/icon_phone.png) no-repeat center/25px 25px
		.icon-message
			width: 25px
			height: 25px
			margin-right: 15px
			background: url(../../assets/img/icon_message.png) no-repeat center/25px 25px
		.code
			flex: 1
			height: 100%
			appearance: none
			border: none
		.get-code
			font-size: 14px
			color: rgb(70, 174, 70)
	.auditLogin-prompt
		margin-top: 18px
		text-align: center
		color: rgb(153, 153, 153)
</style>
