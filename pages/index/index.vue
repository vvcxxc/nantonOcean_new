<template>
	<view class="page-container homepage">
		<view class="home-page-nav">
			<view class="nav-l">
				<image class="nav-home-icon" src="/static/nav_home.png"></image>
				<text>主页</text>
			</view>
			<image class="nav-close-icon" src="/static/nav_close.png" @click="exit"></image>
		</view>

		<view class="btn-area">
			<image class="btn" src="/static/home_pic_bind.png" mode="widthFix" @click="navigateToPage('binding')">
			</image>
			<image class="btn" src="/static/home_pic_warehouse.png" mode="widthFix"
				@click="beforeNavigateToPage('wareHousing')"></image>
			<image class="btn" src="/static/home_pic_pick.png" mode="widthFix"
				@click="beforeNavigateToPage('pickingOut')">
			</image>
			<image class="btn" src="/static/home_pic_stocktaking.png" mode="widthFix"
				@click="beforeNavigateToPage('inventory')"></image>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg"></messagePop>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tipchange: false,
				tipword: ""
			};
		},
		methods: {
			exit() {
				plus.runtime.quit();
			},
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
			},
			beforeNavigateToPage(type) {
				let that = this;
				uni.getStorage({
					key: "kutai",
					success: function(res) {
						if (res.data) {
							that.navigateToPage(type)
						} else {
							that.tipchange = true;
							that.tipword = "请先绑定库台";
						}
					},
					fail: function() {
						that.tipchange = true;
						that.tipword = "请先绑定库台";
					}
				})
			},
			navigateToPage(type) {

				switch (type) {
					case 'binding':
						uni.navigateTo({
							url: '/pages/binding/binding'
						});
						break;
					case 'wareHousing':
						uni.navigateTo({
							url: '/pages/wareHousing/wareHousing'
						});
						break;
					case 'pickingOut':
						uni.navigateTo({
							url: '/pages/pickingOut/pickingOut'
						});
						break;
					case 'inventory':
						uni.navigateTo({
							url: '/pages/inventory/inventory'
						});
						break;
				}


			},
		}
	}
</script>

<style>
	.homepage {
		padding: 65px 36px 10px;
	}

	.home-page-nav {
		padding-top: 25px;
		width: 100vw;
		height: 65px;
		background: linear-gradient(327deg, #2F60E5 0%, #3984F5 100%);
		font-size: 15px;
		color: #FFFFFF;
		position: fixed;
		left: 0;
		top: 0;
	}

	.nav-l {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translate(0, -50%);
		display: flex;
		align-items: center;
		margin-top: 12.5px;
	}

	.nav-home-icon {
		width: 20px;
		height: 20px;
		margin-right: 8px;
	}

	.nav-close-icon {
		width: 15px;
		height: 15px;
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translate(0, -50%);
		display: flex;
		align-items: center;
		margin-top: 12.5px;
	}

	.btn-area {
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}

	.btn {
		width: 100%;
		margin-bottom: 23px;
	}

	.btn:first-child {
		margin-top: 40px;
	}

	.btn:last-child {
		margin-bottom: 0;
	}
</style>
