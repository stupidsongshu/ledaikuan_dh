<template>
  <div class="livingBody">
		<mt-header fixed class="header" title="乐贷款">
			<div slot="left" @click="back">
				<mt-button icon="back"></mt-button>
			</div>
		</mt-header>

		<div class="pic-wrapper" v-if="checkStatus === 0">
			<h1>为确保本人操作，刷个脸吧~</h1>
			<div class="pic-wrapper-outer" @click="shot">
				<div class="pic-wrapper-inner"></div>
				<div class="pic-wrapper-inner"></div>
				<div class="pic-wrapper-inner"></div>
				<div class="pic-wrapper-inner"></div>
				<img src="../../../assets/img/icon-shot.png" alt="">
			</div>
			<p>点击开始测试</p>
			<p>（请正面对准手机，确保光线充足！）</p>
		</div>

		<div class="pic-wrapper-result" v-if="checkStatus === 1">
			<h1>检测结果</h1>
			<h2>成功</h2>
			<img src="" alt="">
		</div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			checkStatus: 0
		}
	},
  methods: {
		back() {
			this.goBack()
		},
		shot() {}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/base'

.livingBody
	margin: 12px 0 48px 0
	padding-top: 30px
	text-align: center
	.pic-wrapper
		width: 100%
		background-color: #fff
		h1
			color: rgb(153,153,153)
			font-size: 17px
		p
			margin-bottom: 17px
			color: rgb(102,102,102)
			font-size: 17px
		.pic-wrapper-outer
			position: relative
			width: 80%
			height: 206px
			margin: 66px auto 84px auto
			border: 1px solid main-color
			border-radius: 10px
			img
				position: absolute
				top: 0
				left: 0
				right: 0
				bottom: 0
				margin: auto
				width: 140px
				height: 140px
			.pic-wrapper-inner
				position: absolute
				width: 20px
				height: 20px
				&:nth-child(1)
					top: 10px
					left: 10px
					border-top: 2px solid main-color
					border-left: 2px solid main-color
				&:nth-child(2)
					top: 10px
					right: 10px
					border-top: 2px solid main-color
					border-right: 2px solid main-color
				&:nth-child(3)
					bottom: 10px
					right: 10px
					border-bottom: 2px solid main-color
					border-right: 2px solid main-color
				&:nth-child(4)
					bottom: 10px
					left: 10px
					border-bottom: 2px solid main-color
					border-left: 2px solid main-color
	.pic-wrapper-result
		font-size: 17px
		h1
			color: rgb(102,102,102)
		h2
			margin: 24px 0 38px
			color: rgb(70,174,70)
		img
			display: block
			width: 285px
			height: 296px
			margin: 0 auto
			background-color #ccc
</style>
