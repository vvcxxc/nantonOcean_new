<template>
  <view class="noBorderArea">
    <slot></slot>
  </view>
</template>

<style>
.noBorderArea {
  width: 100%;
  height: auto;
  padding: 10px;
  box-sizing: border-box;
  background: #1c2c4a;
  border-radius: 4px;
  overflow-y: scroll;
}
</style>
