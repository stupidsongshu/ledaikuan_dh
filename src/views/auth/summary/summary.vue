<template>
  <div class="summary">
    <mt-header fixed class="header" title="申请信息汇总">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

		<div class="idcard">
			<img src="" alt="">
			<div class="idcard-container">
				<div class="name">
					<span>姓名：某某某</span>
					<mt-button class="idcard-modify-btn">修改</mt-button>
				</div>
				<div>身份证： 420822198103127706</div>
			</div>
		</div>

		<div class="bankcard">
			<div class="bankcard-banner">
				<img src="" alt="">
				<div>
					<p>平安银行储蓄卡</p>
					<p>62207001217410029906</p>
				</div>
			</div>
			<mt-button class="idcard-modify-btn">修改</mt-button>
		</div>

		<div class="baseInfo">
			<ul>
				<li class="baseInfo-item">
					<span class="baseInfo-item-name">详细地址：</span>
					<span class="baseInfo-item-value">通州区运河西大街玉桥西里1号楼</span>
				</li>
				<li class="baseInfo-item">
					<span class="baseInfo-item-name">单位名称：</span>
					<span class="baseInfo-item-value">救护及联合国目录库看见看见了</span>
				</li>
				<li class="baseInfo-item">
					<span class="baseInfo-item-name">单位所在城市：</span>
					<span class="baseInfo-item-value">北京 北京 通州</span>
				</li>
				<li class="baseInfo-item">
					<span class="baseInfo-item-name">单位详细地址：</span>
					<span class="baseInfo-item-value">南京路1101号科技创业大厦A幢701室</span>
				</li>
				<li class="baseInfo-item">
					<span class="baseInfo-item-name">单位电话：</span>
					<span class="baseInfo-item-value">021 56615669</span>
				</li>
			</ul>
		</div>

		<div class="linkman">
			<ul>
				<li class="linkman-item">
					<span class="linkman-item-name">家人：何以林</span>
					<span class="linkman-item-tel">电话：13661661718</span>
				</li>
				<li class="linkman-item">
					<span class="linkman-item-name">家人：何以林</span>
					<span class="linkman-item-tel">电话：13661661718</span>
				</li>
				<li class="linkman-item">
					<span class="linkman-item-name">家人：何以林</span>
					<span class="linkman-item-tel">电话：13661661718</span>
				</li>
			</ul>
			<mt-button class="idcard-modify-btn linkman-modify-btn">修改</mt-button>
		</div>

		<div class="video">
			<div class="video-wrapper">
				<div class="video-container">
					<img src="../../../assets/img/icon-video.png" alt="">
				</div>
				<div>认证视频</div>
			</div>
			<mt-button class="idcard-modify-btn video-modify-btn">修改</mt-button>
		</div>

		<div class="agreements">
			<input type="checkbox" id="checkboxLabel" :checked="checked" @click="toggleChecked">
			<label class="agreements-label" for="checkboxLabel">同意</label><router-link to="">《借款协议》</router-link>、<router-link to="">《个人征信查询授权书》</router-link>
		</div>

		<div class="common-btn" style="margin-top: 20px;">
			<mt-button class="btn" :disabled="!checked" @click="submitSummary">申请开户</mt-button>
		</div>
  </div>
</template>

<script>
export default {
  data() {
		return {
			checked: true
		}
	},
	methods: {
		back() {
			this.goBack()
		},
		toggleChecked() {
			this.checked = !this.checked
		},
		submitSummary() {
			this.$router.push({name: 'waitAudit'})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/base'

.summary
	padding: 24px 15px
	font-size: 12px
	.idcard-modify-btn
		width: 64px
		height: 30px
		color: #fff
		border-radius: 4px
		font-size: 16px
		background-color: main-color
	.idcard
		display: flex
		img
			display: inline-block
			width: 74px
			height: 48px
			margin-right: 10px
			background-color: #eee
		.idcard-container
			flex: 1
			font-size: 14px
			.name
				display: flex
				justify-content: space-between
				color: rgb(51, 51, 51)
	.bankcard
		margin-top: 20px
		display: flex
		justify-content: space-between
		align-items: center
		.bankcard-banner
			display: flex
			align-items: center
			width: 245px
			height: 54px
			padding-left: 13px
			border-radius: 4px
			background-color: rgb(251, 123, 85)
			img
				display: inline-block
				width: 44px
				height: 44px
				margin-right: 14px
				border-radius: 50%
				background-color: #fff
			p
				font-size: 14px
				color: #fff
	.baseInfo
		margin-top: 20px
		.baseInfo-item
			display: flex
			margin-bottom: 12px
			.baseInfo-item-name
				width: 100px
	.linkman
		margin-top: 20px
		position: relative
		.linkman-item
			display: flex
			margin-bottom: 10px
			.linkman-item-name
				width: 100px
		.linkman-modify-btn
			position: absolute
			bottom: 0
			right: 0
	.video
		position: relative
		margin-top: 30px
		.video-wrapper
			width: 144px
			margin-left: 60px
			text-align: center
			.video-container
				display: flex
				justify-content: center
				align-items: center
				width: 144px
				height: 75px
				margin-bottom: 8px
				border: 1px dotted rgb(70, 174, 70)
				border-radius: 6px
				img
					width: 40px
					height: 40px
		.video-modify-btn
			position: absolute
			bottom: 40px
			right: 0
	.agreements
		margin-top: 20px
		color: main-color
		a
			color: main-color
		input[type="checkbox"]
			display: none
			&:checked + .agreements-label:before
				background: url('../../../assets/img/icon_checked.png') no-repeat center/12px 12px
		.agreements-label:before
			content: ''
			display: inline-block
			width: 12px
			height: 12px
			margin-right: 4px
			vertical-align: -2px			
			border: 1px solid main-color
</style>
