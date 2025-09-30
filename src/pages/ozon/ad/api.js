// 广告模块接口

// 同步广告管理列表
export function adSyncApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/sync', params)
}

// 同步单个广告
export function adSyncSingleApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/sync/advertising', params)
}

// 广告管理列表
export function adListApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/list', params)
}

// 广告详情
export function adDetailApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/detail', params)
}

// 广告新增
export function adAddApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/add', params)
}

// 广告 启用/禁用
export function toggleActivateApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/batch/activate', params)
}

// 引用广告产品
export function referenceProductApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/reference/product', params)
}

// 合并产品列表
export function mergeListApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/merge/list', params)
}
