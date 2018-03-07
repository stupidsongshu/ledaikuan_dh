<template>
  <div class="waitAudit">
		<mt-header fixed class="header" title="等待审核">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

		<div class="audit-title">
			<span class="icon-audit"></span> 资料已提交，请等待审核
		</div>
		<p>您的资料已经被加密保存，请保持您的单位电话和个人电话畅通。</p>
		<p>一经审核通过，我们将会立即通知您，敬请留意手机短信通知，或者登录乐贷款APP查看审核结果。</p>
		<div class="info-container">
			<h1>您填写的基本信息如下：</h1>
			<h2>紧急联系人：</h2>
			<ul>
				<li class="info-item">
					<span class="info-item-name">家人：</span><span>阿争 13913900248</span>
				</li>
				<li class="info-item">
					<span class="info-item-name">朋友：</span><span>阿争 13913900248</span>
				</li>
				<li class="info-item">
					<span class="info-item-name">同事：</span><span>阿争 13913900248</span>
				</li>
			</ul>

			<h2>基本信息：</h2>
			<ul>
				<li class="info-item">居住地址： 上海 上海市 虹口区 黄山路131路603室</li>
				<li class="info-item">单位名称： 麦广网络科技有限公司</li>
				<li class="info-item">单位地址： 上海 上海市 浦东新区 亮秀路9号307室</li>
				<li class="info-item">单位电话： 021 62568887</li>
			</ul>

			<div class="common-btn" style="margin-top: 24px;">
				<mt-button class="btn">邀请好友，月入万元</mt-button>
			</div>

			<div class="prompt" style="margin-top: 22px;display: flex;justify-content: center;">
				<span class="icon-prompt"></span> 向下滑动屏幕可刷新审核状态
			</div>
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
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/auth'

.waitAudit
	padding: 30px 15px
	font-size: 14px
	.audit-title
		display: flex
		justify-content: center
		font-size: 18px
		color: rgb(51, 51, 51)
		.icon-audit
			display: inline-block
			margin-right: 6px
			width: 29px
			height: 25px
			background: url(../../../assets/img/icon_audit.png) no-repeat center / 29px 25px
	p
		padding: 10px 0
		font-size: 14px
	.info-container
		h1
			margin-top: 10px
			font-size: 18px
		h2
			margin: 5px 0
		.info-item
			margin-bottom: 5px
			.info-item-name
				margin-right: 30px
</style>
