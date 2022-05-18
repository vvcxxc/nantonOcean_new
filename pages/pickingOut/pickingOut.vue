<template>
	<view class="page-container">
		<titleNView title="拣选" titleIcon="/static/nav_pick.png"></titleNView>
		<view class="text-area">
			<view class="list-area">
				<view v-if="sideListData.length">
					<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
						<view class="item-background" @click="chooseItem(idx)">
							<image v-if="curIdx == idx" class="select-icon" src="/static/icon_selected.png"></image>
							<borderArea>
								<leftList :dataList="item"></leftList>
							</borderArea>
						</view>
					</view>
				</view>
				<noData v-else></noData>
			</view>
			<footerBtnList :btnList="footerBtn"></footerBtnList>
			<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg"></messagePop>
		</view>
	</view>
</template>

<script>
	import {
		PDA_PickTasklist
	} from "@/api/api.js";
	export default {
		data() {
			return {
				tipchange: false,
				tipword: "",
				curIdx: undefined,
				footerBtn: [{
					title: "开始拣选",
					background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.startPicking(),
				}, ],
				sideListData: [],
			};
		},
		methods: {
			chooseItem(idx) {
				this.curIdx = idx;
			},
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
			},
			startPicking() {
				if (!this.curIdx && this.curIdx != 0) {
					this.tipchange = true;
					this.tipword = "请选择任务";
				}
				uni.navigateTo({
					url: `/pages/pickingOutDetail/pickingOutDetail?id=${this.sideListData[this.curIdx][0].value}&ContainerNum=${this.sideListData[this.curIdx][1].value} `,
				});
			},
		},
		onShow: function() {
			this.tipchange = false;
			this.tipword = "";
			PDA_PickTasklist()
				.then((res) => {
					if (res.responseCode == 0) {
						let arr = res.TaskInfos.map((item) => [{
								key: "任务号",
								value: item.TaskId,
							},
							{
								key: "拣选地址",
								value: item.ContainerNum,
							},
						]);
						this.sideListData = arr;
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
		padding: 10px;
		width: 100%;
		flex: auto;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
		position: relative;
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

	.list-tips {
		width: 200%;
		height: auto;
		font-size: 20px;
		color: #d8995b;
		transform: scale(0.5) translate(-50%, 50%);
		padding: 10px;
		background: #1c2c4a;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list-item {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}

	.tips-icon {
		width: 18px;
		height: 18px;
		margin-right: 6px;
	}
</style>
