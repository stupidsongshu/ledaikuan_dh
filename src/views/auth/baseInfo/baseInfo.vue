<template>
  <div class="baseInfo">
    <mt-header fixed class="header" title="基本信息">
      <div slot="left" @click="back">
        <mt-button icon="back"></mt-button>
      </div>
			<div slot="right">第3/4步</div>
    </mt-header>

		<div class="notice-prompt">
			<div>
				<span class="icon-prompt-green"></span> 详细、真实的信息可加快审核，提高额度
			</div>
			<div>
				填写规范 <i class="iconfont icon-arrow"></i>
			</div>
		</div>

		<div class="baseInfo-content">
			<!-- 居住地址 -->
			<div class="baseInfo-title">
				居住地址 <span>（地址不完整可能导致审核失败）</span>
			</div>
			<div class="baseInfo-address">
				<div class="address-select">
					<span>北京</span>
					<span>北京</span>
					<span>通州</span>
				</div>
				<i class="iconfont icon-54"></i>
			</div>
			<input type="text" class="input-item" placeholder="请填写详细地址">

			<!-- 单位信息 -->
			<div class="baseInfo-title">
				单位信息 <span>（请填写真实信息，我们将人工核查）</span>
			</div>
			<input type="text" class="input-item" placeholder="请填写详细地址">
			<div class="baseInfo-address">
				<div class="address-select">
					<span>上海</span>
					<span>上海</span>
					<span>普陀</span>
				</div>
				<i class="iconfont icon-54"></i>
			</div>
			<input type="text" class="input-item" placeholder="请填写详细地址 例：创业路8号创业大厦8楼801">
			<div class="baseInfo-company-phone">
				<input type="number" placeholder="区号">
				<input type="number" placeholder="单位电话">
				<input type="number" placeholder="分机（可选）">
			</div>

			<!-- 紧急联系人 -->
			<div class="baseInfo-title">
				三位紧急联系人 <span>（请填写真实姓名，不要填写昵称外号等）</span>
			</div>
			<ul>
				<li class="baseInfo-linkman-item">
					<span class="icon-linkman icon-linkman-family"></span>
					<input type="text" class="linkman-name" placeholder="家人名" readonly>
					<span class="linkman-tel">13900000000</span>
					<mt-button class="linkman-add-btn">添加</mt-button>
				</li>
				<li class="baseInfo-linkman-item">
					<span class="icon-linkman icon-linkman-friend"></span>
					<input type="text" class="linkman-name" placeholder="朋友" readonly>
					<span class="linkman-tel">13900000000</span>
					<mt-button class="linkman-add-btn">添加</mt-button>
				</li>
				<li class="baseInfo-linkman-item">
					<span class="icon-linkman icon-linkman-colleague"></span>
					<input type="text" class="linkman-name" placeholder="同事" readonly>
					<span class="linkman-tel">13900000000</span>
					<mt-button class="linkman-add-btn">添加</mt-button>
				</li>
			</ul>

			<div class="common-btn" style="margin: 20px 0;">
				<mt-button class="btn" @click="submitBaseInfo">提 交</mt-button>
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
		},
		submitBaseInfo() {
			this.$router.push({name: 'video'})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/base'
@import '../../../assets/css/auth'

.baseInfo
	.notice-prompt
		display: flex
		justify-content: space-between
		padding: 5px 15px
		font-size: 12px
		color: main-color
		background-color: rgba(70, 174, 70, .1)
		.icon-prompt-green
			display: inline-block
			width: 10px
			height: 10px
			margin-right: 4px
			background: url('../../../assets/img/icon-prompt-green.png') no-repeat center/100%
	.baseInfo-content
		padding: 0 15px
		font-size: 16px
		.baseInfo-title
			margin: 10px 0
			span
				color: #999
				font-size: 12px
		.baseInfo-address
			display: flex
			justify-content: space-between
			align-items: center
			.address-select
				margin: 10px 0
		.baseInfo-company-phone
			display: flex
			width: 100%
			height: 50px
			margin: 10px 0
			padding: 0 20px
			border: 1px solid rgb(153, 153, 153)
			border-radius: 6px
			font-size: 16px
			input
				flex: 1
				width: 33.33%
				border: none
		.baseInfo-linkman-item
			display: flex
			align-items: center
			justify-content: space-around
			height: 35px
			margin-bottom: 10px
			.icon-linkman
				width: 30px
				height: 100%
			.icon-linkman-family
				background: url('../../../assets/img/icon-linkman-family.png') no-repeat center/100%
			.icon-linkman-friend
				background: url('../../../assets/img/icon-linkman-friend.png') no-repeat center/100%
			.icon-linkman-colleague
				background: url('../../../assets/img/icon-linkman-colleague.png') no-repeat center/100%
			.linkman-name
				width: 114px
				height: 100%
				text-align: center
				border: 1px solid #999
				border-radius: 4px
			.linkman-add-btn
				display: flex
				justify-content: center
				align-items: center
				width: 64px
				height: 33px
				color: #fff
				border-radius: 6px
				background-color: main-color
</style>
