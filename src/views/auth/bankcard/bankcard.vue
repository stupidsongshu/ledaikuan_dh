<template>
  <div class="bankcard">
    <mt-header fixed class="header" title="绑定银行卡">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
			<div slot="right">第2/4步</div>
    </mt-header>

		<p class="hint-item">必须使用本人名义办理的银行卡，否则无法完成绑定！</p>
		<div class="input-left-item">
			<span>银行卡号</span>
			<input type="number" placeholder="请输入你的银行卡号">
		</div>
		<div class="input-left-item border-none">
			<span>开户银行</span>
			<span>请选择开户银行</span>
			<i class="iconfont icon-54"></i>
		</div>
		<div class="input-left-item border-none">
			<span>开户城市</span>
			<span>请选择开户城市</span>
			<i class="iconfont icon-54"></i>
		</div>

		<div class="input-right-item">
			<input type="text" placeholder="请输入验证码">
			<span class="get-code" v-if="!hasGetCode" @click="getCode">获取验证码</span>
			<span class="get-code" v-if="hasGetCode">{{time}}s后重新获取</span>
		</div>

		<!-- <p class="hint-item">填写信用卡信息将提高你的贷款成功率</p>
		<div class="input-left-item">
			<span>银行卡号</span>
			<input type="number" placeholder="请输入你的信用卡号（可选）">
		</div> -->

		<div class="common-btn" style="margin: 30px 0 46px 0;">
      <mt-button class="btn" @click="submitBankcard">提 交</mt-button>
    </div>

		<div class="bank-support-list-wrapper" style="font-size: 12px;color: #999;">
			<div class="prompt" style="margin-bottom: 9px;">
				<span class="icon-prompt"></span> 目前可支持的银行有：
			</div>
			<ul class="bank-support-list">
				<li class="item">1.中国银行</li>
				<li class="item">2.平安银行</li>
				<li class="item">3.农业银行</li>
				<li class="item">4.中信银行</li>
				<li class="item">5.工商银行</li>
				<li class="item">6.光大银行</li>
				<li class="item">7.建设银行</li>
				<li class="item">8.兴业银行</li>
				<li class="item">9.邮储银行</li>
				<li class="item">10.民生银行</li>
				<li class="item">11.招商银行</li>
				<li class="item">12.宁波银行</li>
			</ul>
			<span style="padding: 0 15px;">其他银行暂未支持，敬请谅解。</span>
		</div>
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
		},
		submitBankcard() {
			this.$router.push({name: 'baseInfo'})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/base'
@import '../../../assets/css/auth'

.bankcard
	padding: 0 15px
	.hint-item
		padding: 15px 0
		color: main-color
		font-size: 12px
	.get-code
		color: main-color
		font-size: 14px
.bank-support-list-wrapper
	position: absolute
	left: 15px
	bottom: 20px
.bank-support-list
	display: flex
	flex-wrap: wrap
	width: 100%
	padding: 0 15px
	.item
		flex-grow: 1
		flex-shrink: 0
		flex-basis: 25%
		width: 25%
		line-height: 26px
</style>
