<template>
	<view class="messagePop">
		<view class="message-box">
			<view class="message-title">提示
				<image class="close-icon" src="/static/nav_close.png" @click="close"></image>
			</view>
			<view class="message-content">
				<view class="pop-msg">{{tipword}}</view>
				<view class="pop-btn" @click="sumbit">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "messagePop",
		props: {
			tipword: {
				type: String
			}
		},
		methods: {
			close() {
				this.$emit('close')
			},
			sumbit() {
				this.$emit('callBack');
				this.$emit('close');
			}
		}
	}
</script>

<style>
	.messagePop {
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, .7);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9999;
		color: #fff;
	}

	.message-box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 220px;
		height: 150px;
		border-radius: 2px;
		overflow: hidden;
	}

	.message-title {
		width: 100%;
		height: 26px;
		background: #6E7B91;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		font-size: 14px;
	}

	.close-icon {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translate(0, -50%);
		width: 15px;
		height: 15px;
	}

	.message-content {
		width: 100%;
		height: calc(100% - 26px);
		width: 100%;
		background: #495365;
		font-size: 15px;
		padding: 10px;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.pop-msg {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 14px;
	}

	.pop-btn {
		width: 70px;
		height: 32px;
		background: #3882F4;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}
</style>
