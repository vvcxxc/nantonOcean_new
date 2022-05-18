<template>
	<view class="login-page">
		<view class="cn-title">登录</view>
		<view class="en-title">LOGIN</view>

		<view class="login-input-content">
			<image class="input-icon-l" src="/static/login_account.png"></image>
			<input class="login-input" v-model="userName" type="text" />
		</view>
		<view class="login-input-content box2">
			<image class="input-icon-l" src="/static/login_key.png"></image>
			<input class="login-input" v-model="password" v-if="showPassWord" type="text" />
			<input class="login-input" v-model="password" v-else type="password" />
			<image class="input-icon-r" v-if="!showPassWord" src="/static/login_biyan.png" @click="showPass"></image>
			<image class="input-icon-r" v-else src="/static/login_zhengyan.png" @click="showPass"></image>
		</view>
		<view class="forget" @click="showTips('请联系管理员重置密码！')">忘记密码？</view>
		<view class="btn1" @click="loginFn">登录</view>
		<view class="btn2" @click="exit">退出</view>
	</view>
</template>

<script>
	import {
		PDA_Login
	} from "@/api/api.js";
	export default {
		data() {
			return {
				showPassWord: false,
				userName: "",
				password: "",
			};
		},
		methods: {
			exit() {
				plus.runtime.quit();
			},
			showPass() {
				this.showPassWord = !this.showPassWord;
			},
			showTips(msg) {
				uni.showToast({
					title: msg,
					icon: "none",
					duration: 2500,
					mask: true,
				});
			},
			loginFn() {
				let that = this;
				PDA_Login({
						Username: that.userName,
						Password: that.password,
					})
					.then((res) => {
						if (res.responseCode == 0) {
							that.showTips("登录成功！");
							setTimeout(() => {
								uni.navigateTo({
									url: "/pages/index/index",
								});
							}, 2500);
						} else {
							that.showTips(res.responseMessage);
						}
					})
					.catch((err) => {
						that.showTips(err.responseMessage);
					});
			},
		},
		onShow: function() {
			this.tipchange = false;
			this.tipword = "";
		},
	};
</script>

<style>
	.login-page {
		background-color: #0f223d;
		padding: 0 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		overflow-y: scroll;
	}

	.cn-title {
		font-size: 32px;
		font-family: Source Han Sans CN;
		font-weight: bold;
		color: #387ef3;
		margin-bottom: 8px;
	}

	.en-title {
		font-size: 20px;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #387ef3;
		margin-bottom: 45px;
	}

	.login-input-content {
		width: 100%;
		height: 36px;
		background: rgba(47, 64, 96, 0.39);
		border: 1px solid #446fb4;
		border-radius: 4px;
		position: relative;
		padding-left: 30px;
	}

	.box2 {
		margin: 26px 0 14px;
		padding-right: 30px;
	}

	.input-icon-l {
		width: 20px;
		height: 20px;
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translate(0, -50%);
	}

	.input-icon-r {
		width: 20px;
		height: 20px;
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translate(0, -50%);
	}

	.login-input {
		width: 100%;
		height: 100%;
		border: none;
		color: #fff;
		padding-left: 10px;
	}

	.forget {
		width: 100%;
		height: auto;
		font-family: Source Han Sans CN;
		font-weight: 400;
		line-height: 1;
		color: #6581b5;
		text-align: right;
		margin-bottom: 45px;
	}

	.btn1 {
		width: 152px;
		height: 30px;
		background: linear-gradient(180deg, #3882f4 0%, #2057ec 100%);
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 14px;
	}

	.btn2 {
		width: 152px;
		height: 30px;
		border: 1px solid #2b6aef;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #2b6aef;
		margin-top: 20px;
		font-size: 14px;
	}

	.msg {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(10, 20, 39, 0.8);
		color: #fff;
		padding: 13px 15px;
		border-radius: 4px;
		width: fit-content;
		max-width: 250px;
		line-height: 1.8;
	}
</style>
