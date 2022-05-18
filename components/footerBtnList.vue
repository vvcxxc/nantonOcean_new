<template>
	<view class="footer-list">
		<view v-if="btnList.length" v-for="(item,idx) in btnList" :key="idx" class="btn"
			:style="{color:item.color,background:item.background}" @click="item.callback">{{item.title}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "footerBtnList",
		props: {
			btnList: {
				type: Array[{
					title: String,
					background: String,
					color: String,
					callback: Function
				}]
			}
		}
	}
</script>

<style>
	.footer-list {
		width: 100%;
		height: 55px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn {
		width: 120px;
		height: 32px;
		background: linear-gradient(180deg, #3882F4 0%, #2057EC 100%);
		opacity: 1;
		border-radius: 4px;
		margin-right: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn:last-child {
		margin-right: 0;
	}
</style>
