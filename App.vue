<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	*{
		font-size: 14px;
		box-sizing: border-box;
	}
	.page-container {
		background-color: #0F223D;
		height: 100vh;
		padding: 80px 10px 0;
		box-sizing: border-box;
	}
</style>
