<template>
	<view class="left-list">
		<view class="left-list-item"  v-for="(item,idx) in dataList" :key="idx">
			<view class="left-list-key">{{item.key}}</view>
			<view class="left-list-value">{{item.value}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "leftList",
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
	.left-list {
		width: 100%;
		height: auto;
	}

	.left-list-item {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		margin-bottom: 12px;
		line-height: 20px;
	}

	.left-list-item:last-child {
		margin-bottom: 0;
	}

	.left-list-key {
		width: 68px;
		color: #B5C5E5
	}

	.left-list-value {
		flex: 1;
		color: #FFFFFF;
	}
</style>
