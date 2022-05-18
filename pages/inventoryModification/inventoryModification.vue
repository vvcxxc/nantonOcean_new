<template>
	<view class="page-container inventoryModification">
		<titleNView title="盘点修改" titleIcon="/static/nav_stocktaking.png"></titleNView>
		<view class="text-area">
			<view class="search-bar">
				<uni-easyinput v-model="value" type="text" :styles="{ color: '#fff', borderColor: '#385A91' }"
					confirmType="done" @confirm="searchTraybarcode">
				</uni-easyinput>
				<image class="search-icon" src="/static/icon_search.png" @click="searchTraybarcode"></image>
			</view>
			<view class="inventoryModification-content" v-show="hasInventory">
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">原始值</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.SaleNum
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单行号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.SaleLineNum
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">工单号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.WorkOrderNum
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">重量</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.WeightY
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">长度</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.LengthY
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">支号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.RollNumY
            }}</text>
					</view>
				</view>
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">修改值</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单号</text>
						<text class="inventoryModification-list-value">{{
							itemInfo.SaleNum
						}}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单行号</text>
						<text class="inventoryModification-list-value">{{
						  itemInfo.SaleLineNum
						}}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">工单号</text>
						<text class="inventoryModification-list-value">{{
							itemInfo.WorkOrderNum
						}}</text>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">重量</text>
						<uni-easyinput v-model="itemInfo.Weight" type="number" :focus="isFocus" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">长度</text>
						<uni-easyinput v-model="itemInfo.Length" type="number" :clearable="true" :styles="{
							color: '#fff', borderColor: '#385A91', textAlign: 'right'}">
						</uni-easyinput>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">支号</text>
						<uni-easyinput v-model="itemInfo.RollNum" type="number" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
				</view>
			</view>
			<footerBtnList :btnList="footerBtn" v-show="hasInventory"></footerBtnList>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_InventoryTaskDetail,
	} from "@/api/api.js";
	export default {
		data() {
			return {
				isFocus: false,
				_tasknumber: "",
				_Traybarcode: "",
				tipchange: false,
				tipword: "",
				ptype: false,
				value: "",
				itemInfo: {
					Length: 0,
					LengthY: 0,
					Oid: "",
					RollNum: 0,
					RollNumY: 0,
					SaleLineNum: "",
					SaleNum: "",
					TrayInfoDetailId: "",
					Weight: 0,
					WeightY: 0,
					WorkOrderNum: ""
				},
				ResTaskInventoryDetails: [],
				footerBtn: [{
					title: "修改",
					background: "linear-gradient(180deg, #F49638 0%, #EC7220 100%)",
					color: "#fff",
					callback: () => this.openType(),
				}, ],
				hasInventory: false,
				timer: null
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ptype = false;
				clearTimeout(this.timer)
			},
			openType() {
				this.tipchange = true;
				this.tipword = "是否确认修改？";
				this.ptype = true;
			},
			callBack() {
				if (this.ptype) {
					this.setDataStroage();
					// this.value = '';
				}
			},
			searchTraybarcode() {
				let itemId = this.value.split(',')[1];
				let that = this;
				uni.getStorage({
					key: "inventoryModification",
					success: function(res) {
						if (res.data) {
							let list = JSON.parse(res.data)
							if (list && list.length) {
								let item = list.find(_ => _.Oid == itemId)
								if (!item || !item.Oid) {
									that.tipchange = true;
									that.tipword = "条码校验失败！请重新扫描条码";
									that.hasInventory = false
								} else {
									that.itemInfo = {
										...item,
									}
									that.tipchange = true;
									that.tipword = "条码校验成功！";
									that.hasInventory = true
								}
							} else {
								that.setItemInfo(itemId, true)
							}
						} else {
							that.setItemInfo(itemId, true)
						}
					},
					fail: function() {
						that.setItemInfo(itemId, true)
					}
				})
			},
			setItemInfo(itemId, bool) {
				let item = this.ResTaskInventoryDetails.find(_ => _.Oid == itemId);
				if (!item || !item.Oid) {
					this.tipchange = true;
					this.tipword = "条码校验失败！";
					this.hasInventory = false
				} else {
					this.itemInfo = {
						...item
					}
					if (bool) {
						this.tipchange = true;
						this.tipword = "条码校验成功！";
					}
				}
			},
			//记一下列表
			getData(_id, itemId) {
				let that = this;
				PDA_InventoryTaskDetail(_id)
					.then((res) => {
						if (res.responseCode == 0) {
							this.ResTaskInventoryDetails = res.ResTaskInventoryDetails;
							uni.getStorage({
								key: "inventoryModification",
								success: function(res) {
									if (res.data) {
										let list = JSON.parse(res.data)
										if (list && list.length) {
											let item = list.find(_ => _.Oid == itemId);
											if (item) {
												that.itemInfo = {
													...item
												}
											} else {
												that.setItemInfo(itemId)
											}
										} else {
											that.setItemInfo(itemId)
										}
									} else {
										that.setItemInfo(itemId)
									}
								},
								fail: function() {
									that.setItemInfo(itemId)
								}
							})

						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
					.catch((err) => {
						this.tipchange = true;
						this.tipword = err.responseMessage || err.Message;
					});
			},
			setDataStroage() {
				let that = this;
				console.log(Number(this.itemInfo.Weight), Number(this.itemInfo.Weight)< 0)
				if(Number(this.itemInfo.Length) < 0){
					this.$nextTick(()=>{
						this.tipchange = true;
						this.tipword = '长度请输入不小于0的数值';
					})
					return
				}else if(Number(this.itemInfo.Weight) < 0){
					console.log('--------')
					this.$nextTick(()=>{
						this.tipchange = true;
						this.tipword = '重量请输入不小于0的数值';
					})
					return
				}
				uni.getStorage({
					key: "inventoryModification",
					success: (res)=> {
						let newData = [...JSON.parse(res.data)]
						let idx = newData.findIndex(_=> _.Oid === this.itemInfo.Oid)
						newData[idx] = {...that.itemInfo}
						uni.setStorage({
							key: 'inventoryModification',
							data: JSON.stringify(newData),
							success: function() {
								that.$nextTick(function() {
									that.tipchange = true;
									that.tipword = '修改成功';
									this.timer = setTimeout(()=>{
										that.tipchange = false;
										that.tipword = '';
										clearTimeout(this.timer)
									}, 3000)
								})
							},
							fail: function() {
								that.$nextTick(function() {
									that.tipchange = true;
									that.tipword = '设置缓存失败';
								})
							}
						})
					},
				})
			}
		},
		onLoad: function(option) {
			this._tasknumber = option.tasknumber
			// 条码数大于1，需手动输条码
			if(option.ShowList === 'false'){
				this.tipchange = true;
				this.tipword = '请扫描条码';
				this.hasInventory = false
			}else{
				this.getData(option.tasknumber, option.Traybarcode);
				this.hasInventory = true
			}
		}
	}
</script>

<style>
	.inventoryModification {
		padding-top: 70px;
	}

	.inventoryModification /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.inventoryModification /deep/ .uniui-clear {
		width: 28px;
		height: 28px;
		color: #446fb4 !important;
		font-size: 28px !important;
		line-height: 28px !important;
		padding: 0;
		margin-right: 5px;
	}

	.inventoryModification .inventoryModification-list-item /deep/ .uni-input-input {
		text-align: right;
	}

	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.inventoryModification-content {
		width: 100%;
		flex: 1;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.search-bar {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search-icon {
		width: 20px;
		height: 20px;
		margin-left: 10px;
	}

	.inventoryModification-list {
		width: 100%;
		height: auto;
		background: #1c2c4a;
		border-radius: 4px;
		overflow: hidden;
		padding: 40px 13px 20px;
		margin-bottom: 10px;
		position: relative;
	}

	.inventoryModification-label {
		width: 82px;
		height: 25px;
		background: linear-gradient(134deg, #7586a5 0%, #243655 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 15px;
		position: absolute;
		left: 0;
		top: 0;
	}

	.inventoryModification-list-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
		line-height: 20px;
	}

	.inputPadding {
		align-items: center;
		margin-bottom: 20px;
	}

	.inventoryModification-list-item:last-child {
		margin-bottom: 0;
	}

	.inventoryModification-list-key {
		width: 100px;
		color: #b5c5e5;
	}

	.inventoryModification-list-value {
		flex: 1;
		color: #ffffff;
		text-align: right;
	}

	.inventoryModification-list-input {
		width: 152px;
		height: 32px;
		background: rgba(47, 64, 96, 0.39);
		border: 1px solid #385a91;
		opacity: 1;
		border-radius: 2px;
		text-align: right;
		color: #fff;
	}
</style>
