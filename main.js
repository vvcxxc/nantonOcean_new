import App from './App'

import noBorderArea from "./components/noBorderArea.vue"
import borderArea from "./components/borderArea.vue"
import titleNView from "./components/titleNView.vue"
import leftList from "./components/leftList.vue"
import sideList from "./components/sideList.vue"
import footerBtnList from "./components/footerBtnList.vue"
import noData from "components/noData.vue"
import messagePop from "components/messagePop.vue"
Vue.component('noBorderArea', noBorderArea)
Vue.component('borderArea', borderArea)
Vue.component('titleNView', titleNView)
Vue.component('leftList', leftList)
Vue.component('sideList', sideList)
Vue.component('footerBtnList', footerBtnList)
Vue.component('noData', noData)
Vue.component('messagePop', messagePop)
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
