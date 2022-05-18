<template>
	<view class="page-container largeVolumeWarehousing">
		<titleNView title="大卷入库" titleIcon="/static/nav_warehouse.png"></titleNView>
		<view class="text-area">

			<view class="largeVolumeWarehousing-area">
				<view class="input-item">
					<uni-easyinput v-model="tableItem.value" type="text" :focus="isFocus" confirmType="search"
						:styles="{ color: '#fff', borderColor: '#385A91' }" @confirm="barCodeBindTray">
					</uni-easyinput>
				</view>
				<view class="border-list">
					<view class="border-item">
						<view class="item-left">条码</view>
						<view class="item-right">{{tableItem.Oid}}</view>
					</view>
					<view class="border-item">
						<view class="item-left">销售订单号</view>
						<view class="item-right">{{tableItem.SaleNum}}</view>
					</view>
					<view class="border-item">
						<view class="item-left">销售订单行号</view>
						<view class="item-right">{{tableItem.SaleLine}}</view>
					</view>
					<view class="border-item">
						<view class="item-left">工单号</view>
						<view class="item-right">{{tableItem.WorkOrderNum}}</view>
					</view>
					<view class="border-item">
						<view class="item-left">重量</view>
						<view class="item-right">{{tableItem.Weight}}</view>
					</view>
					<view class="border-item">
						<view class="item-left">长度</view>
						<view class="item-right">{{tableItem.Length}}</view>
					</view>
					<view class="border-item">
						<view class="item-left">支号</view>
						<view class="item-right">{{tableItem.RollNum}}</view>
					</view>
				</view>



			</view>
			<footerBtnList :btnList="footerBtn"></footerBtnList>
			<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
		</view>
	</view>
</template>

<script>
	import {
		PDA_BarCodeBindTray,
		PDA_BindBarCodeData,
		PDA_EntryTray
	} from "@/api/api.js";
	export default {
		data() {
			return {
				isFocus: false,
				tipchange: false,
				tipword: "",
				value: "",
				isDelete: false,
				footerBtn: [{
					title: "新建入库",
					background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.sumbit(),
				}, ],
				tableItem: {
					value: '',
					Length: '',
					Oid: '',
					RollNum: '',
					SaleLine: '',
					SaleNum: '',
					Weight: '',
					WorkOrderNum: '',
				},
				timer: null
			};
		},
		methods: {
			callBack() {
				if (this.isDelete) {
					this.isDelete = false;
					this.sumbitBarCodeBindTray(true);
				}
			},
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				clearTimeout(this.timer)
			},
			barCodeBindTray() {
				let that = this;
				if (!this.tableItem.value) {
					this.tipchange = true;
					this.tipword = "请录入条码！！";
					this.timer = setTimeout(() => {
						that.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					return;
				}
				let identifiers = this.tableItem.value.split(',')
				if(this.tableItem.Oid === identifiers[1]){
					this.tipchange = true;
					this.isDelete = true;
					this.tipword = "是否删除条码信息？";
					return;
				}else{
					this.sumbitBarCodeBindTray(false)
				}
			},
			sumbitBarCodeBindTray(IsCancel) {
				let that = this;
				let data = {
					EntryType: 3,
					BarCode: this.tableItem.value,
					IsCancel
				}
				PDA_BarCodeBindTray(data).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = !IsCancel ? "条码校验成功！" : "删除条码成功！";
						if (!IsCancel) {
							let item = {
								...this.tableItem,
								...res.BarCodeInfos[0]
							};
							this.tableItem = {
								...res.BarCodeInfos[0],
								value: '',
							};
						} else {
							this.tableItem = {
								value: '',
								Length: '',
								Oid: '',
								RollNum: '',
								SaleLine: '',
								SaleNum: '',
								Weight: '',
								WorkOrderNum: '',
							};
						}
					} else {
						this.tipchange = true;
						this.tipword = "条码校验失败！";
					}
				})
				.catch((err) => {
					this.tipchange = true;
					this.tipword = err.responseMessage || err.Message;
				});
			},
			sumbit() {
				console.log(this.tableItem.Oid)
				if(this.tableItem.Oid === ''){
					this.tipchange = true;
					this.tipword = "请录入条码！";
					
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					return
				}
				let data = {
					entryType: 3,
				};
				PDA_EntryTray(data).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = "入库成功！";
						this.tableItem = {
							value: '',
							Length: '',
							Oid: '',
							RollNum: '',
							SaleLine: '',
							SaleNum: '',
							Weight: '',
							WorkOrderNum: '',
						};
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				}).catch((err) => {
					this.tipchange = true;
					this.tipword = err.responseMessage || err.Message;
				});
			},
			getBarCodeInfos() {
				PDA_BindBarCodeData({
					entryType: 3
				}).then((res)=>{
					res.BindBarCodeInfos.Length > 0 ? this.tableItem = {
						...res.BindBarCodeInfos[0]
					} : null
				}).catch(res=>{
					this.tipchange = true;
					this.tipword = err.responseMessage || err.Message;
				})
			}
		},
		onShow: function() {
			this.getBarCodeInfos();
		}
	};
</script>

<style>
	.largeVolumeWarehousing {
		padding-top: 75px;
	}

	.largeVolumeWarehousing /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.largeVolumeWarehousing /deep/ .uniui-clear {
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

	.largeVolumeWarehousing-area {
		margin-top: 10px;
		padding: 10px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;

	}

	.input-item {
		width: 100%;
		height: 30px;
		margin-bottom: 30px;
	}

	.border-list {
		width: 100%;
		height: auto;
		border-radius: 8px;
		border: 1px solid #446FB4;
		border-bottom: none;
	}

	.border-item {
		width: 100%;
		height: 38px;
		border-bottom: 1px solid #446FB4;
		display: flex;
	}

	.item-left {
		width: 112px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #B5C5E5;
		border-right: 1px solid #446FB4;
	}

	.item-right {
		width: calc(100% - 112px);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-left: 15px;
		color: #FFFFFF;
		line-height: 1;
		word-break: break-all;
	}
</style>
