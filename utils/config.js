let url_config = '';
if (process.env.NODE_ENV === 'development') {
	// 开发环境
	url_config = 'http://192.168.1.61:8002'
} else {
	// 生产环境
	url_config = 'http://192.168.1.61:8002'
}

export default url_config
