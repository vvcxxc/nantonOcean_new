import request from '../utils/request1.js'

export function PDA_Login(params) {
	return request.baseRequest(`/api/PDA/PDA_Login`, 'POST', params)
}

export function PDA_Inventory(params) {
	return request.baseRequest(`/api/PDA/PDA_Inventory`, 'POST', params)
}

export function PDA_Picks(params) {
	return request.baseRequest(`/api/PDA/PDA_Picks`, 'POST', params)
}

export function PDA_Warehousing(params) {
	return request.baseRequest(`/api/PDA/PDA_Warehousing`, 'POST', params)
}

export function PDA_WarehousingRun(params) {
	return request.baseRequest(`/api/PDA/PDA_WarehousingRun`, 'POST', params)
}

export function PDA_Inventorysel(id) {
	return request.baseRequest(`/api/PDA/PDA_Inventorysel?tasknumber=${id}`, 'POST')
}

export function PDA_Picksdetails(id) {
	return request.baseRequest(`/api/PDA/PDA_Picksdetails?tasknumber=${id}`, 'POST')
}

export function PDA_PicksExwarehouse(params) {
	return request.baseRequest(`/api/PDA/PDA_PicksExwarehouse`, 'POST', params)
}

export function PDA_InventorymodificationSel(tasknumber, Traybarcode) {
	return request.baseRequest(
		`/api/PDA/PDA_InventorymodificationSel?tasknumber=${tasknumber}&Traybarcode=${Traybarcode}`, 'POST')
}

export function PDA_Inventorymodification(params) {
	return request.baseRequest(`/api/PDA/PDA_Inventorymodification`, 'POST', params)
}
// 以下是重构新接口
export function PDA_KutaiList(id) {
	return request.baseRequest(`/api/PDA/KutaiInfo/list`, 'GET')
}

export function PDA_EntryTray(params) {
	return request.baseRequest(`/api/PDA/EntryTray`, 'POST', params)
}

export function PDA_CallEmptyTray(params) {
	return request.baseRequest(`/api/PDA/CallEmptyTray`, 'POST', params)
}

// 盘点
export function PDA_InventoryTasklist() {
	return request.baseRequest(`/api/PDA/Inventory/task/list`, 'GET', {
		Kutai: uni.getStorageSync('kutai')
	})
}

export function PDA_InventoryTaskDetail(id) {
	return request.baseRequest(`/api/PDA/Inventory/taskDetail/list?taskDetailParm.taskId=${id}`, 'GET')
}

export function PDA_Inventorysubmit(params) {
	return request.baseRequest(`/api/PDA/Inventory/inventory/submit`, 'POST', params)
}

// 拣选
export function PDA_PickTasklist() {
	return request.baseRequest(`/api/PDA/Pick/task/list`, 'GET')
}

export function PDA_PickTaskDetail(id) {
	return request.baseRequest(`/api/PDA/Pick/taskDetail/list?taskDetailParm.taskId=${id}`, 'GET')
}

export function PDA_CallTrayBack(params) {
	return request.baseRequest(`/api/PDA/Pick/pick/callTrayBack`, 'POST', params)
}

export function PDA_Picksubmit(params) {
	return request.baseRequest(`/api/PDA/Pick/pick/submit`, 'POST', params)
}

export function PDA_BarCodeBindTray(params) {
	return request.baseRequest(`/api/PDA/BindTray/BarCodeBindTray`, 'POST', params)
}

export function PDA_BindBarCodeData(params) {
	return request.baseRequest('/api/PDA/BindTray/BindBarCodeData', 'GET', params)
}

