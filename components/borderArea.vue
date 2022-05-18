<template>
	<view class="BorderArea">
		<slot></slot>
	</view>
</template>

<style>
	.BorderArea {
		width: 100%;
		height: auto;
		padding: 10px;
		box-sizing: border-box;
		background: #2F4060;
		/* border: 1px solid #385A91; */
		border-radius: 4px;
	}
</style>
