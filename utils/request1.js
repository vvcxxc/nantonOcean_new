// import $toast from '../js/toast.js'

// 全局请求封装
//#ifdef APP-PLUS
const apiUrl = 'http://192.168.2.120:8081' //web ip
//#endif
//#ifndef APP-PLUS
const apiUrl = 'http://192.168.2.120:8081'
//#endif

const baseRequest = (url,method,data) => {
	//请求拦截
	uni.showLoading({
		title: '加载中',
		mask: true
	});

	let timer = 60000
	// let newData = data
	const kutai = uni.getStorageSync('kutai');
	if(kutai){
		data = { ...data, Kutai: Number(kutai)}
	}

	return new Promise((resolve, reject) => {
		uni.getNetworkType({
		    success: function (res) {
				if(res.networkType != 'none'){
					uni.request({
						url: apiUrl + url,
						data: data,
						method: method,
						timeout:timer,
						header: {
							// 'token': token
						},
						sslVerify:false,
						success(res) {
							uni.hideLoading();
							const new_data = res.data
							let code = String(new_data.responseCode)
							console.log(res)
							if(res.statusCode === 503){
								uni.showToast({
									title: '请求服务器失败',
									icon: "none",
									duration: 2500,
									mask: true,
								});
							}else if (code === '0') {
								resolve(new_data)
							} else {
								reject(new_data)
							}
						},
						fail(err) {
							uni.hideLoading();
							if(err.errMsg != 'request:fail abort'){
								uni.showToast({
									title: '请求失败,请重新尝试',
									icon: "none",
									duration: 2500,
									mask: true,
								});
							}else{
								reject(err)
							}
						},
						complete(res) {
						}
					})
				}
		    },
		})
		
	})
}

export default {
	baseRequest,
}
