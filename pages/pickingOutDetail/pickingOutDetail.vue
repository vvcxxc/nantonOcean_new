<template>
	<view class="page-container">
		<titleNView title="拣选详情" titleIcon="/static/nav_pick.png"></titleNView>
		<view class="text-area">
			<view class="noBorder-area">
				<noBorderArea>
					<leftList :dataList="leftListData"></leftList>
				</noBorderArea>
			</view>
			<view class="list-area">
				<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
					<borderArea>
						<sideList :dataList="item"></sideList>
					</borderArea>
				</view>
				<div class="no-data" v-if="!sideListData.length">
					<noData></noData>
				</div>
			</view>
			<view class="list-tips">
				<image class="tips-icon" src="/static/icon_prompt.png"></image>
				<text class="tips-text">托盘货物详情信息，包括订单号及内容</text>
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
		PDA_PickTaskDetail,
		PDA_CallTrayBack
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
				footerBtn: [{
						title: "拣选出库",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.editPicking(),
					},
					{
						title: "托盘回库",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.openType(),
					},
				],
				leftListData: [],
				sideListData: [],
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ptype = false;
				this.backType = false;
			},
			editPicking() {
				if (!this.sideListData.length) {
					this.tipchange = true;
					this.tipword = "拣选数据为空";
					return;
				}
				uni.navigateTo({
					url: `/pages/pickingIssue/pickingIssue?id=${this._id}`,
				});
			},
			openType() {
				this.tipchange = true;
				this.tipword = "是否确认托盘回库？";
				this.ptype = true;
			},
			callBack() {
				if (this.ptype) {
					let data = {
						TaskId: Number(this._id),
					};
					console.log(data)
					PDA_CallTrayBack(data)
						.then((res) => {
							if (res.responseCode == 0) {
								this.tipchange = true;
								this.tipword = "托盘回库任务生成成功！";
								this.backType = true;
							} else {
								this.tipchange = true;
								this.tipword = res.responseMessage;
							}
						})
						.catch((err) => {
							this.tipchange = true;
							this.tipword = err.responseMessage || err.Message;
						});
				} else if (this.backType) {
					uni.navigateBack();
				}
			},
			getData(_id, ContainerNum) {
				PDA_PickTaskDetail(_id)
					.then((res) => {
						if (res.responseCode == 0) {
							this._id = _id;
							this.ContainerNum = ContainerNum;
							this.leftListData = [{
									key: "任务号",
									value: _id,
								},
								{
									key: "取货地址",
									value: ContainerNum,
								},
								{
									key: "拣选数量",
									value: res.ResTaskDetails.length,
								},
							];
							this.sideListData = res.ResTaskDetails.map((item) => {
								return [{
										key: "条码",
										value: item.Oid,
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
									{
										key: "是否需要拣选",
										value: item.NeedPick ? "是" : "否",
									},
								];
							});
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
		},
		onShow: function() {
			this.tipchange = false;
			this.tipword = "";
			if (this._id) {
				this.getData(this._id, this.ContainerNum);
			}
		},
		onLoad: function(option) {
			this.getData(option.id, option.ContainerNum);
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
		padding: 10px 10px 30px;
		width: 100%;
		flex: auto;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
		position: relative;
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
