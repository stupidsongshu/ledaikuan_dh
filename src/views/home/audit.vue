<template>
  <div class="audit no-header">
		<div class="audit-title">
			<span class="icon-audit"></span> 资料已提交，请等待审核
		</div>
		<p>您的资料已经被加密保存，审核期间暂时不可修改。</p>
		<p>一经审核通过，我们将会立即通知您，敬请留意手机短信通知，或者登录乐贷款APP查看审核结果。</p>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="stylus" scoped>
	.audit
		padding: 30px 15px
		.audit-title
			display: flex
			justify-content: center
			font-size: 18px
			.icon-audit
				display: inline-block
				margin-right: 6px
				width: 29px
				height: 25px
				background: url(../../assets/img/icon_audit.png) no-repeat center / 29px 25px
		p
			padding: 20px 0
			font-size: 14px
</style>
