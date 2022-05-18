<template>
	<view class="page-container">
		<titleNView title="盘点详情" titleIcon="/static/nav_stocktaking.png"></titleNView>
		<view class="text-area">
			<view class="noBorder-area">
				<noBorderArea>
					<leftList :dataList="leftListData"></leftList>
				</noBorderArea>
			</view>
			<view class="list-area">
				<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
					<view class="item-background"><!--  @click="chooseItem(idx)" -->
						<!-- <image v-if="curIdx == idx" class="select-icon" src="/static/icon_selected.png"></image> -->
						<borderArea>
							<sideList :dataList="item"></sideList>
						</borderArea>
					</view>
				</view>
				<div class="no-data" v-if="!sideListData.length">
					<noData></noData>
				</div>
			</view>
			<view class="list-tips">
				<image class="tips-icon" src="/static/icon_prompt.png"></image>
				<text class="tips-text">托盘货物详情信息，包括订单号及内容，盘点修改后的内容</text>
			</view>
			<view class="footerBtn-tips">
				<footerBtnList :btnList="footerBtn"></footerBtnList>
			</view>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_InventoryTaskDetail,
		PDA_Inventorysubmit
	} from "@/api/api.js";
	export default {
		data() {
			return {
				_id: "",
				ContainerNum: "",
				tipchange: false,
				tipword: "",
				ptype: false,
				backType: false,
				curIdx: undefined,
				footerBtn: [{
						title: "盘点修改",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.editInventory(),
					},
					{
						title: "盘点无误",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.openType(),
					},
				],
				leftListData: [],
				sideListData: [],
				referList: [] // 对照列表
			};
		},
		methods: {
			chooseItem(idx) {
				this.curIdx = idx;
			},
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ptype = false;
				this.backType = false;
			},
			editInventory() {
				let idx = this.curIdx || 0;
				let tasknumber = this.leftListData[0].value;
				let Traybarcode = this.sideListData[idx][0].value
				let showList = true
				if(this.sideListData.length > 1){
					showList = false
				}
				uni.navigateTo({
					url: `/pages/inventoryModification/inventoryModification?tasknumber=${tasknumber}&Traybarcode=${Traybarcode}&ShowList=${showList}`,
				});
			},
			openType() {
				this.tipchange = true;
				this.tipword = "是否确认盘点无误？";
				this.ptype = true;
			},
			callBack() {
				if (this.ptype) {
					let that = this;
					uni.getStorage({
						key: "inventoryModification",
						success: function(res) {
							if (res.data) {
								let taskInventoryDetails = JSON.parse(res.data);
								that.inventorysubmit(taskInventoryDetails);
							} else {
								that.inventorysubmit([]);
							}
						},
						fail: function() {
							that.inventorysubmit([]);
						}
					})
				}
				if (this.backType) {
					uni.navigateBack();
				}
			},
			inventorysubmit(taskInventoryDetails) {
				// referList
				let changeList = []
				taskInventoryDetails.forEach(item=>{
					if(item.Weight != item.WeightY || item.Length != item.LengthY || item.RollNum != item.RollNumY){
						changeList.push(item)
					}
				})
				let data = {
					TaskId: this._id,
					taskInventoryDetails: changeList
				};
				PDA_Inventorysubmit(data)
					.then((res) => {
						if (res.responseCode == 0) {
							this.tipchange = true;
							this.tipword = '盘点成功';
							this.backType = true;
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
			setInventoryData(id, data){
				let newData = [...data]
				// 数据二次处理，记住未修改前的数据
				newData.forEach(item=>{
					item.WeightY = item.Weight
					item.LengthY = item.Length
					item.RollNumY = item.RollNum
				})
				uni.setStorage({
					key: "inventoryModification",
					data: JSON.stringify(newData)
				})
			},
			// 数据处理
			dataDistribute(_id, ContainerNum, data){
				this._id = _id;
				this.ContainerNum = ContainerNum;
				this.leftListData = [{
						key: "任务号",
						value: _id,
					},
					{
						key: "盘点地址",
						value: ContainerNum,
					},
				];
				this.sideListData = data.map((item) => {
					return [{
							key: "条码",
							value: item.Oid,
						},
						{
							key: "托盘条码",
							value: item.TrayInfoDetailId,
						},
						{
							key: "销售订单号",
							value: item.SaleNum,
						},
						{
							key: "销售订单行号",
							value: item.SaleLineNum,
						},
						{
							key: "工单号",
							value: item.WorkOrderNum,
						},
						{
							key: "重量",
							value: item.Weight,
						},
						{
							key: "长度",
							value: item.Length,
						},
						{
							key: "支号",
							value: item.RollNum,
						},
					];
				});
			},
			getData(_id, ContainerNum) {
				PDA_InventoryTaskDetail(_id).then((res) => {
					if (res.responseCode == 0) {
						this.referList = [...res.ResTaskInventoryDetails]
						this.dataDistribute(_id, ContainerNum, res.ResTaskInventoryDetails)
						this.setInventoryData(_id, res.ResTaskInventoryDetails)
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				}).catch((err) => {
					this.tipchange = true;
					this.tipword = err.responseMessage || err.Message;
				});
			},
			watchRouter: function(isRoute){
				let that = this
				if(isRoute){
					this.getData(option.id, option.ContainerNum);
				}else {
					uni.getStorage({
						key: 'inventoryModification',
						success(res) {
							let dataList = JSON.parse(res.data)
							that.sideListData = dataList.map((item) => {
								return [{
										key: "条码",
										value: item.Oid,
									},
									{
										key: "托盘条码",
										value: item.TrayInfoDetailId,
									},
									{
										key: "销售订单号",
										value: item.SaleNum,
									},
									{
										key: "销售订单行号",
										value: item.SaleLineNum,
									},
									{
										key: "工单号",
										value: item.WorkOrderNum,
									},
									{
										key: "重量",
										value: Number(item.Weight),
									},
									{
										key: "长度",
										value: item.Length,
									},
									{
										key: "支号",
										value: item.RollNum,
									},
								];
							});
						}
					})
				}
			},
		},
		// onShow: function() {
		// 	this.tipchange = false;
		// 	this.tipword = "";
		// 	if (this._id) {
		// 		console.log("-----")
		// 		this.getData(this._id, this.ContainerNum);
		// 	}
		// },
		onLoad: function(option) {
			let that = this
			this.getData(option.id, option.ContainerNum);
			uni.addInterceptor('navigateBack', {//监听返回
				success(e) {
					that.watchRouter(false);
				}
			})
		},
	};
</script>

<style>
	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.list-area {
		margin-top: 10px;
		padding: 10px 10px 50px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.item-background {
		width: 100%;
		height: auto;
		position: relative;
	}

	.select-icon {
		width: 35px;
		height: 30px;
		position: absolute;
		right: 0;
		top: 0;
	}

	.no-data {
		width: 100%;
		height: 300px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.list-tips {
		width: calc(100% - 20px);
		height: auto;
		font-size: 14px;
		color: #d8995b;
		padding: 5px;
		background: #1c2c4a;
		box-sizing: border-box;
		position: fixed;
		left: 10px;
		bottom: 55px;
		display: flex;
		justify-content: flex-start;
		padding-left: 10px;
		word-break: break-all;
	}

	.tips-icon {
		width: 14px;
		height: 14px;
		margin-right: 6px;
		/* margin-top: 4px; */
		vertical-align: top;
	}

	.tips-text {
		width: calc(100% - 14px);
	}

	.list-item {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}
</style>
