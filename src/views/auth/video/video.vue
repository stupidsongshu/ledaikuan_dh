<template>
  <div class="video">
		<mt-header fixed class="header" title="视频认证">
			<div slot="left" @click="back">
				<mt-button icon="back"></mt-button>
			</div>
			<div slot="right">第4/4步</div>
		</mt-header>

		<h1 class="video-hint-title">请按照界面提示，读一段文字，完成认证视频录制</h1>

		<div class="video-wrapper">
			<div class="video-container">
				<img src="../../../assets/img/icon-camera.png" alt="">
				<span>认证视频</span>
			</div>
		</div>

		<div class="common-btn" style="margin-top: 50px;padding: 0 15px;">
			<mt-button class="btn" @click="submitVideo">提 交</mt-button>
		</div>
  </div>
</template>

<script>
export default {
  data() {
		return {

		}
	},
	methods: {
		back() {
			this.goBack()
		},
		submitVideo() {
			this.$router.push({name: 'summary'})
		}
	}
}
</script>

<style lang="stylus" scoped>
.video
	.video-hint-title
		margin: 20px 0
		font-size: 14px
		text-align: center
	.video-wrapper
		width: 240px
		height: 172px
		padding: 12px 20px 26px 20px
		margin: 0 auto
		border-radius: 6px
		background-color: #e8e8e8
		.video-container
			display: flex
			flex-direction: column
			align-items: center
			justify-content: center
			width: 100%
			height: 100%
			border-radius: 6px
			background-color: #b1b1b1
			img
				width: 60px
				height: 60px
			span
				margin-top: 10px
				color: #fff
				font-size: 16px
</style>
