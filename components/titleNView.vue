<template name="titleNView">
	<view class="titleNView">
		<view class="block"></view>
		<image class="back-icon" src="/static/icon_back.png" @click="goBack"></image>
		<image class="titleNView-icon" :src="titleIcon"></image>
		<view class="title-text">{{title}}</view>
	</view>
</template>
<script>
	export default {
		name: "titleNView",
		data() {
			return {

			};
		},
		// 此处定义传入的数据
		props: {
			titleIcon: {
				type: String,
				value: null
			},
			title: {
				type: String,
				value: null
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>
<style>
	.titleNView {
		width: 100vw;
		height: 65px;
		padding-top: 25px;
		background: linear-gradient(327deg, #2F60E5 0%, #3984F5 100%);
		display: flex;
		align-items: center;
		justify-content: center;

		font-family: Source Han Sans CN;
		font-weight: 500;
		color: #FFFFFF;
		position: fixed;
		left: 0;
		top: 0;
	}

	.titleNView-icon {
		width: 20px;
		height: 20px;
		margin-right: 8px;

	}

	.back-icon {
		width: 20px;
		height: 20px;
		position: absolute;
		top: 50%;
		left: 10px;
		transform: translate(0, -50%);
		margin-top: 12.5px;
	}

	.title-text {
		font-size: 15px;
	}
</style>
