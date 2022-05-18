<template>
	<view class="page-container largeVolumeWarehousing">
		<titleNView title="小卷入库" titleIcon="/static/nav_warehouse.png"></titleNView>
		<view class="text-area">

			<view class="largeVolumeWarehousing-area">
				<view class="input-item">
					<uni-easyinput v-model="value" type="text" :focus="isFocus" confirmType="done"
						:styles="{ color: '#fff', borderColor: '#385A91' }" @confirm="barCodeBindTray">
					</uni-easyinput>
				</view>
				<view class="border-list">
					<view class="border-item">
						<view class="item-left">序号</view>
						<view class="item-middle">工单号</view>
						<view class="item-right">重量</view>
					</view>
					<view class="border-item" v-for="(item,idx) in tableList" :key="item.key">
						<view class="item-left">{{Number(idx)+1}}</view>
						<view class="item-middle">{{item.WorkOrderNum}}</view>
						<view class="item-right">{{item.Weight}}</view>
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
		PDA_EntryTray,
		PDA_BindBarCodeData
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
				tableList: [],
				timer: null,
				groupNoList: [],
				OidList: [],
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
				if (!this.value) {
					this.tipchange = true;
					this.tipword = "请录入条码！！";
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					return;
				}
				let identifiers = this.value.split(',')
				if(identifiers[0] === 'GP'){
					let idx = this.groupNoList.indexOf(identifiers[1])
					if(idx >= 0){
						that.tipchange = true;
						that.isDelete = true;
						that.tipword = "是否删除条码信息？";
						return
					}
				}else{
					let idx = this.OidList.indexOf(identifiers[1])
					if(idx >= 0){
						that.tipchange = true;
						that.isDelete = true;
						that.tipword = "是否删除条码信息？";
						return
					}
				}
				that.sumbitBarCodeBindTray(false)
			},
			sumbitBarCodeBindTray(IsCancel) {
				let that = this;
				let data = {
					EntryType: 4,
					BarCode: this.value,
					IsCancel,
				}
				PDA_BarCodeBindTray(data).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = !IsCancel ? "条码校验成功！" : "删除条码成功！";
						
						let identifiers = this.value.split(',')
						if(identifiers[0] === 'GP'){
							let idx = this.groupNoList.indexOf(identifiers[1])
							if(idx >= 0){
								this.groupNoList.splice(idx, 1)
								let list = [...this.tableList]
								list.forEach((item)=>{
									if(item.GroupNo && item.GroupNo === identifiers[1]){
										this.tableList.splice(this.tableList.indexOf(item), 1)
									}
								})
							} else {
								this.groupNoList.push(identifiers[1])
								if(res.BarCodeInfos.length){
									res.BarCodeInfos.forEach(item=>{
										this.tableList.push({
											...item, 
											GroupNo: identifiers[1]
										})
									})
								}else{
									this.tableList.push({
										...res.BarCodeInfos, 
										GroupNo: identifiers[1]
									})
								}
							}
						}else{
							let idx = this.OidList.indexOf(identifiers[1])
							if(idx >= 0){
								this.OidList.splice(idx, 1)
								let list = [...this.tableList]
								list.forEach((item)=>{
									if(item.Oid === identifiers[1]){
										this.tableList.splice(this.tableList.indexOf(item), 1)
									}
								})
								
							}else{
								this.OidList.push(identifiers[1])
								if(res.BarCodeInfos.length){
									res.BarCodeInfos.forEach(item=>{
										this.tableList.push({
											...item, 
											GroupNo: identifiers[1]
										})
									})
								}else{
									this.tableList.push({
										...res.BarCodeInfos, 
										GroupNo: identifiers[1]
									})
								}
							}
						}
						
						this.value = "";
					} else {
						this.tipchange = true;
						this.tipword = "条码校验失败！";
					}
				}).catch((err) => {
					this.tipchange = true;
					this.tipword = err.responseMessage || err.Message;
				});
			},
			sumbit() {
				let that = this;
				if (!this.tableList.length) {
					this.tipchange = true;
					this.tipword = "请录入条码！";
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					return;
				}
				let data = {
					entryType: 4,
				};
				PDA_EntryTray(data)
					.then((res) => {
						if (res.responseCode == 0) {
							that.tipchange = true;
							that.tipword = "条码校验成功！";
							that.tableList = [];
							that.groupNoList = []
							that.OidList = [];
							that.value = "";
						} else {
							that.tipchange = true;
							that.tipword = res.responseMessage;
						}
					})
					.catch((err) => {
						that.tipchange = true;
						that.tipword = err.responseMessage || err.Message;
					});
			},
			getBarCodeInfos() {
				PDA_BindBarCodeData({
					entryType: 4
				}).then((res)=>{
					let list = res.BindBarCodeInfos
					this.tableList = []
					let groupId = []
					let OidList = []
					list.forEach(item=>{
						item.GroupNo && groupId.push(item.GroupNo)
						OidList.push(item.Oid)
						this.tableList.push(item)
					})
					this.groupNoList = [...new Set(groupId)]
					this.OidList = [...new Set(OidList)]
					console.log(this.groupNoList, this.OidList)
				})
				.catch((err) => {
					this.tipchange = true;
					this.tipword = err.responseMessage || err.Message;
				});
			},
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
		width: 58px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #B5C5E5;
		border-right: 1px solid #446FB4;
	}

	.item-middle {
		flex: auto;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #B5C5E5;
		border-right: 1px solid #446FB4;
	}

	.item-right {
		width: 58px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #B5C5E5;
	}
</style>
