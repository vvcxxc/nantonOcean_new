<template>
	<view class="nodata">
		<image class="nodata-img" src="../static/pic_nodata.png"></image>
		<text class="nodata-text">暂无数据</text>
	</view>
</template>

<script>
	export default {
		name: "noData",
		data() {
			return {

			};
		}
	}
</script>

<style>
	.nodata {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.nodata-img {
		width: 170px;
		height: 170px;
	}

	.nodata-text {
		margin-top: 12px;
		color: #B5C5E5;
	}
</style>
