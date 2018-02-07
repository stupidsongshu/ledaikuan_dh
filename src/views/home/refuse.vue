<template>
  <div class="refuse no-header">
      <div class="refuse-title">
        <span class="icon-audit"></span> 审核已拒绝
    </div>
    <p>很遗憾，您的资料没有通过审核</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
.refuse {
	padding: 30px 15px;

	.refuse-title {
		display: flex;
		justify-content: center;
		font-size: 18px;

		.icon-audit {
			display: inline-block;
			margin-right: 6px;
			width: 29px;
			height: 25px;
			background: url('../../assets/img/icon_audit.png') no-repeat center / 29px 25px;
		}
	}

	p {
		padding: 20px 0;
		font-size: 14px;
	}
}
</style>
