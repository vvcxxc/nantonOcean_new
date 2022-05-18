<template>
	<view class="side-list">
		<view class="side-list-item" v-for="(item,idx) in dataList" :key="idx">
			<view class="side-list-key">{{item.key}}</view>
			<view class="side-list-value">{{item.value}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "sideList",
		data() {
			return {

			};
		},
		props: {
			dataList: {
				type: Array[{
					key: String,
					value: String,
				}]
			}
		}
	}
</script>

<style>
	.side-list {
		width: 100%;
		height: auto;
	}

	.side-list-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
		line-height: 20px;
	}

	.side-list-item:last-child {
		margin-bottom: 0;
	}

	.side-list-key {
		width: 90px;
		color: #B5C5E5
	}

	.side-list-value {
		flex: auto;
		color: #FFFFFF;
		word-break: break-all;
		text-align: right;
	}
</style>
