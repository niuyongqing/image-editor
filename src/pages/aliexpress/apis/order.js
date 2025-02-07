// 订单列表
export function orderListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/order/list', params)
}

// 查询订单备注
export function queryRemarkApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/order/query-seller-remark', params)
}

// 添加订单备注
export function saveRemarkApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/order/save-seller-remark', params)
}

// 导出
export function orderExportApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/order/export', params)
}

// 订单同步
export function orderSyncApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/order/sync', params)
}

// 历史订单同步
export function orderSyncHistoryApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/order/sync/history', params)
}

// 订单同步进度条
export function syncProgressApi(token) {
  return useGet(`/platform-aliexpress/platform/aliexpress/order/sync-progress?token=${token}`)
}
