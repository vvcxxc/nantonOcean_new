<template>
	<view class="page-container pickingIssue">
		<titleNView title="拣选出库" titleIcon="/static/nav_pick.png"></titleNView>
		<view class="text-area">
			<view class="top-tips">请扫描需要出库的货物条码</view>
			<view class="pickingIssue-list-item">
				<view class="pickingIssue-list-value">
					<uni-easyinput v-model="inputList" type="text" :focus="isFocus" confirmType="done"
						:styles="{ color: '#fff', borderColor: '#385A91' }" @confirm="checkOrder">
					</uni-easyinput>
				</view>
			</view>
			<view class="list-area">
				<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
					<borderArea>
						<sideList :dataList="item"></sideList>
					</borderArea>
				</view>
			</view>
			<footerBtnList :btnList="footerBtn"></footerBtnList>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_PickTaskDetail,
		PDA_Picksubmit
	} from "@/api/api.js";
	export default {
		data() {
			return {
				_id: '',
				isFocus: false,
				tipchange: false,
				tipword: "",
				backType: false,
				inputList: "",
				footerBtn: [{
					title: "确认出库",
					background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.sumbit(),
				}],
				sideListData: [],
				ResTaskDetails: [],
				finalSumbit: [],
				deleType: false,
				timer: null
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.backType = false;
				this.deleType = false;
				clearTimeout(this.timer);
			},
			checkOrder() {
				let that = this;
				let str = this.inputList;
				if (!str) {
					this.tipchange = true;
					this.tipword = "请录入条码！";
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					return;
				}
				let bool = false;
				let tempList = str.split(',');
				console.log(this.ResTaskDetails)
				if (tempList[0] == 'GP') {
					if(this.ResTaskDetails.find(_ => _.NeedPick === false)){
						this.tipchange = true;
						this.tipword = "条码校验失败！";
						this.timer = setTimeout(() => {
							this.closeMsg()
							clearTimeout(this.timer)
						}, 3000);
						return
					}
					bool = this.ResTaskDetails.find(_ => _.GroupNo == tempList[1]);
				} else {
					let code = this.ResTaskDetails.filter(item => item.Oid === tempList[1])
					if(code.length > 0 && !code[0].NeedPick){
						this.tipchange = true;
						this.deleType = false;
						this.tipword = "不需要分拣！";
						return
					}
					bool = this.ResTaskDetails.find(_ => _.Oid == tempList[1]);
				}
				if (!bool) {
					this.tipchange = true;
					this.tipword = "条码校验失败！";
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
				} else {
					uni.getStorage({
						key: "pickingIssue",
						success: function(res) {
							let result = JSON.parse(res.data)
							console.log(result)
							if(tempList[1]){
								
							}
							if (result && result.length > 0) {
								/**
								 * 1、扫描组码后，再扫子码，提示：已扫描主码
								 * 2、扫描子码，再扫组码，覆盖
								 */
								if(result[0].split(',')[0] === 'GP'){
									if(that.ResTaskDetails.filter(item => item.GroupNo === tempList[1]).length > 0 && !that.ResTaskDetails.filter(item => item.GroupNo === tempList[1])[0].NeedPick){
										that.tipchange = true;
										that.deleType = false;
										that.tipword = "校验失败！";
										return
									}
								}
								if (tempList[0] !== 'GP' && result[0].split(',')[0] === 'GP') {
									that.tipchange = true;
									that.deleType = false;
									that.tipword = "已扫描主码！";
									return
								}else if(tempList[0] === 'GP' && result[0].split(',')[0] !== 'GP'){
									that.checkSuccess(str, false)
								}else {
									let isSame = result.find(item => {
										let ids = item.split(',')
										return ids[1] === tempList[1]
									})
									if (result.includes(str) || isSame) {
										that.tipchange = true;
										that.deleType = true;
										that.tipword = "是否删除条码信息！";
									} else {
										if(tempList[0] === 'GP'){
										}
										that.checkSuccess(str, true)
									}
								}
							} else {
								that.checkSuccess(str, true)
							}
						},
						fail: function() {
							that.checkSuccess(str, true)
						}
					})
				}
			},
			checkSuccess(str, flag = true){
				this.tipchange = true;
				this.tipword = "条码校验成功！";
				this.setDataStroage(str, flag);
				this.inputList = "";
			},
			sumbit() {
				let that = this;
				uni.getStorage({
					key: "pickingIssue",
					success: function(res) {
						if (res.data) {
							let datacode = [];
							let temp = JSON.parse(res.data);
							for (let i = 0; i < temp.length; i++) {
								let tempList = temp[i].split(',');
								let arr = [];
								if (tempList[0] == 'GP') {
									arr = that.ResTaskDetails.filter(_ => _.GroupNo == tempList[1]).map(_2 => _2.Oid);
									datacode = datacode.concat(arr)
								} else {
									arr = that.ResTaskDetails.filter(_ => _.Oid == tempList[1]).map(_2 => _2.Oid);
								}
								if (!datacode.length) {
									datacode = arr
								} else {
									datacode = datacode.concat(arr)
								}
							}
							if (!datacode || !datacode.length) {
								that.tipchange = true;
								that.tipword = "请扫描条码！";
								return;
							}
							let data = {
								TaskId: that._id,
								BarCodes: [...new Set(datacode)],
							};
							PDA_Picksubmit(data)
								.then((res) => {
									if (res.responseCode == 0) {
										that.tipchange = true;
										that.tipword = "出库成功！";
										that.backType = true;
										that.inputList = "";
										uni.setStorage({
											key: "pickingIssue",
											data: JSON.stringify([]),
											fail: function() {
												that.tipchange = true;
												that.tipword = '清空缓存失败';
											}
										})
									} else {
										that.tipchange = true;
										that.tipword = "出库失败！";
										that.inputList = "";
										that.timer = setTimeout(() => {
											that.closeMsg()
											clearTimeout(that.timer)
										}, 3000);
									}
								})
								.catch((err) => {
									that.tipchange = true;
									that.tipword = err.responseMessage || err.Message;
								});
						} else {
							that.tipchange = true;
							that.tipword = "请扫描条码！";
							return;
						}
					},
					fail: function() {
						that.tipchange = true;
						that.tipword = "请扫描条码！";
						return;
					}
				})
			},
			callBack() {
				if (this.backType) {
					uni.navigateBack();
				}
				if (this.deleType) {
					this.setDataStroage(this.inputList, true);
				}
				this.inputList = "";
			},
			initData(_id) {
				uni.getStorage({
					key: "pickingIssue",
					success: function(res) {
						if (res.data && res.data.length) {

						} else {

						}
					},
					fail: function() {

					}
				})
			},
			getData(_id) {
				PDA_PickTaskDetail(_id)
					.then((res) => {
						console.log(res)
						if (res.responseCode == 0) {
							this._id = _id;
							console.log('=====',res.ResTaskDetails)
							this.ResTaskDetails = [...res.ResTaskDetails];
							uni.getStorage({
								key: "pickingIssue",
								success: (res)=>{
									let result = JSON.parse(res.data)
									if (result && result.length > 0) {
										this.getList(result)
									}
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
			setDataStroage(str, flag = true) {
				let that = this;
				uni.getStorage({
					key: "pickingIssue",
					success: function(res) {
						if (res.data) {
							let strList = JSON.parse(res.data);
							if(flag){
								let bool = false;
								//存在的话删除
								let strIds = str.split(',')
								strList.forEach((_, idx) => {
									let ids = _.split(',')
									if (_ == str || ids[1] === strIds[1]) {
										bool = true;
										strList.splice(idx, 1)
									}
								})
								
								//不存在的话加上
								if (!bool) {
									strList.push(str);
								}
							}else {
								strList = [str]
							}
							uni.setStorage({
								key: "pickingIssue",
								data: JSON.stringify(strList),
								success(){
									that.getList(strList)
								},
								fail: function() {
									that.tipchange = true;
									that.tipword = '设置缓存失败';
								}
							})
						} else {
							let data = [str];
							uni.setStorage({
								key: "pickingIssue",
								data: JSON.stringify(data),
								success(){
									that.getList(data)
								},
								fail: function() {
									that.tipchange = true;
									that.tipword = '设置缓存失败';
								}
							})
						}
					},
					fail: function() {
						let data = [str];
						uni.setStorage({
							key: "pickingIssue",
							data: JSON.stringify(data),
							success(){
								that.getList(data)
							},
							fail: function() {
								that.tipchange = true;
								that.tipword = '设置缓存失败';
							}
						})
					}
				})
			},
			getList(list){
				this.sideListData = []
				list.forEach((str, idx)=>{
					let tempList = str.split(',');
					if (tempList[0] == 'GP') {
						this.ResTaskDetails.forEach(item => {
							if(item.GroupNo == tempList[1]){
								this.sideListData.push(
									[{
										key: "序号",
										value: this.sideListData.length + 1,
									}, {
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
									}
								])
							}
						});
					} else {
						this.ResTaskDetails.forEach(item => {
							if(item.Oid == tempList[1]){
								this.sideListData.push(
									[{
										key: "序号",
										value: this.sideListData.length + 1,
									}, {
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
									}
								])
							}
						});
					}
					console.log(this.ResTaskDetails)
				})
			}
		},
		onShow: function() {
			this.tipchange = false;
			this.tipword = "";
		},
		onLoad: function(option) {
			this.getData(option.id);
		},
	};
</script>

<style>
	.pickingIssue {
		padding-top: 65px;
	}

	.pickingIssue /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.pickingIssue /deep/ .uniui-clear {
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

	.top-tips {
		width: 100%;
		height: 32px;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	.list-area {
		padding: 10px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.list-item {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}

	.pickingIssue-list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		line-height: 20px;
	}

	.pickingIssue-list-item:last-child {
		margin-bottom: 0;
	}

	.pickingIssue-list-key {
		width: 67px;
		color: #fff;
		font-size: 14px;
	}

	.pickingIssue-list-value {
		flex: 1;
		height: 34px;
	}
</style>
