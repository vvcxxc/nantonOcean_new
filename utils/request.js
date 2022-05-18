import urlConfig from './config.js'
import {
	getToken,
	setToken,
	removeToken
} from './auth.js'
const request = {}
// const headers = {}
request.globalRequest = (url, method, data) => {
	uni.showLoading({
		title: '加载中',
		mask: true
	});
	// if (!data) {
	// 	data = {}
	// }
	const kutai = uni.getStorageSync('kutai');
	data.Kutai = kutai;
	// if (getToken()) {
	// 	headers['Authorization'] = 'Bearer ' + getToken() || ''
	// }
	return new Promise((resolve, reject) => {
		uni.request({
			url: urlConfig + url,
			method: method,
			data: data,
			// sslVerify: false,
			// dataType: 'json',
			header: {
				'Content-Type': 'application/json'
			},
			timeout: 5 * 1000
		}).then(res => {
			uni.hideLoading();
			const new_data = res[1].data
			let code = String(new_data.responseCode)
			if (code === '0') {
				resolve(new_data)
			} else {
				reject(new_data)
			}
		}).catch(err => {
			uni.hideLoading();
			uni.showModal({
				title: '提示',
				content: '请求失败,请重新尝试',
				showCancel: false
			})
			// reject(err)
		})
	})
}
export default request
