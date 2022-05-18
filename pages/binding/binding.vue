<template>
	<view class="page-container binding">
		<titleNView title="库口绑定" titleIcon="/static/nav_warehouse.png"></titleNView>
		<view class="text-area">
			<view class="binding-area">
				<view class="input-item" @click="changeUlShow">
					<view class="uni-input">{{array.length?array[index].Description:''}}</view>
					<image class="pull-icon" src="/static/icon_xiala.png"></image>
				</view>

				<view :class="!ulShow?'input-ul visibility':'input-ul '">
					<view v-for="(item,idx) in array" :class="
			item.Description == array[index].Description?'input-li cur-li':'input-li'
						" @click="bindPickerChange(idx)">{{ item.Description}}
						></view>
				</view>
				<view class="btn-box">
					<view class="btn1" @click="beforeBindingNum(true)">绑定</view>
					<view class="btn2" @click="beforeBindingNum(false)">解绑</view>
				</view>

				<view class="input-item2">
					<view :class="stroageKuta=='未绑定'?'circle-icon grey':'circle-icon green'"></view>
					{{stroageKuta}}
				</view>

			</view>
			<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
		</view>
	</view>
</template>

<script>
	import {
		PDA_KutaiList
	} from "@/api/api.js";
	export default {
		data() {
			return {
				tipchange: false,
				tipword: "",
				array: [],
				index: 0,
				stroageKuta: '',
				ulShow: false,
				callBackType: 0
			};
		},
		methods: {
			callBack() {
				if (this.callBackType == 1) {
					this.bindingNum(false);
				}
				this.callBackType = 0;
			},
			changeUlShow() {
				this.ulShow = !this.ulShow;
			},
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
			},
			bindPickerChange: function(idx) {
				this.index = idx
			},
			getStroageKuta() {
				let that = this;
				uni.getStorage({
					key: "kutai",
					success: function(res) {
						if (res.data) {
							let data = Number(res.data);
							that.index = 0;
							that.stroageKuta = '未绑定';
							that.array.map((item, idx) => {
								if (item.Kutai == data) {
									that.index = idx;
									that.stroageKuta = `已绑定：${that.array[that.index].Description} `;
								}
							})
						} else {
							that.index = 0;
							that.stroageKuta = '未绑定';
						}
					},
					fail: function() {
						that.index = 0;
						that.stroageKuta = '未绑定';
					}
				})
			},
			getKutaiList() {
				PDA_KutaiList()
					.then((res) => {
						if (res.responseCode == 0) {
							this.array = res.KutaiInfos;
							this.getStroageKuta()
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					}).catch(res=>{
						this.tipchange = true;
						this.tipword = err.responseMessage || err.Message;
					})

			},
			beforeBindingNum(bool) {
				// if (!this.ulShow && bool) {
				// 	return
				// }
				let str = this.stroageKuta.split("已绑定：")[1];
				if (bool) {
					if (this.stroageKuta != '未绑定') {
						this.tipchange = true;
						this.tipword = `已绑定${str}，请先解绑！`;
						return
					} else {
						this.bindingNum(true)
					}
				} else {
					if (this.stroageKuta != '未绑定') {
						this.tipchange = true;
						this.tipword = `是否解绑${str}？`;
						this.callBackType = 1;
						return
					} else {
						this.tipchange = true;
						this.tipword = `未绑定库口！`;
						return
					}
				}
			},
			bindingNum(bool) {
				let that = this;
				if (bool) {
					let data = this.array[this.index].Kutai;
					console.log(data, this.index)
					uni.setStorage({
						key: "kutai",
						data: String(data),
						success: function(res) {
							that.tipchange = true;
							that.tipword = '绑定成功';
							that.ulShow = false;
						},
						fail: function() {
							that.tipchange = true;
							that.tipword = '绑定失败';
						}
					});
				} else {
					uni.setStorage({
						key: "kutai",
						data: '',
						success: function(res) {
							that.tipchange = true;
							that.tipword = '解绑成功';
						},
						fail: function() {
							that.tipchange = true;
							that.tipword = '解绑失败';
						}
					});
				}
				this.getStroageKuta()
			}
		},
		onShow: function() {
			this.getKutaiList();
		}
	};
</script>

<style>
	.binding {
		padding-top: 65px;
		padding-bottom: 25px;
	}

	.binding /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.binding /deep/ .uniui-clear {
		width: 28px;
		height: 28px;
		color: #446fb4 !important;
		font-size: 28px !important;
		line-height: 28px !important;
		padding: 0;
		margin-right: 5px;
	}

	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.binding-area {
		margin-top: 10px;
		padding: 10px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
		padding-top: 29px;

	}

	.input-item {
		width: 100%;
		height: 32px;
		line-height: 30px;
		padding-left: 10px;
		position: relative;
		margin-bottom: 30px;
		background: rgba(47, 64, 96, 0.39);
		border: 1px solid #446fb4;
		border-radius: 4px;
		color: #FFFFFF;
		position: relative;
		padding-left: 7px;
	}

	.input-ul {
		width: 100%;
		height: 202px;
		background: rgba(47, 64, 96, 0.39);
		border: 1px solid #446FB4;
		opacity: 1;
		border-radius: 2px;
		padding: 5px 0;
		overflow-y: scroll;
	}

	.visibility {
		visibility: hidden;
		overflow-y: hidden;
	}

	.input-li {
		width: 100%;
		height: 32px;
		color: #FFFFFF;
		padding-left: 7px;
		line-height: 32px;

	}

	.cur-li {
		background-color: #3F619F;
	}

	.btn-box {
		margin-top: 42px;
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn1 {
		width: 70px;
		height: 34px;
		background: linear-gradient(180deg, #22DC85 0%, #1E9E51 100%);
		border-radius: 4px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 14px;
	}

	.btn2 {
		width: 70px;
		height: 34px;
		background: linear-gradient(180deg, #F49638 0%, #EC7220 100%);
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #2b6aef;
		margin-left: 20px;
		color: #fff;
		font-size: 14px;
	}

	.pull-icon {
		width: 30px;
		height: 30px;
		position: absolute;
		right: 0px;
		top: 50%;
		transform: translate(0, -50%);
	}

	.input-item2 {
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding-left: 5px;
		margin: 20px 0;
		border-top: 1px solid #446fb4;
		color: #FFFFFF;
		display: flex;
		align-items: center;
	}

	.circle-icon {
		display: inline-block;
		width: 15px;
		height: 15px;
		margin-right: 10px;
		border-radius: 8px;
	}

	.grey {
		background-color: #ACACAC;
	}

	.green {
		background-color: #329B55;
	}
</style>
