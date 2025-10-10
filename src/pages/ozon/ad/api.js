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


// 广告产品列表
export function adProductListApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/product/list', params)
}

// 广告产品新增
export function adProductAddApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/product/add/advertisement', params)
}

// 产品加入广告, 获取当前店铺的所有广告
export function adProductFindListApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/product/find/advertisement', params)
}

// 广告产品状态更改
export function adProductToggleStateApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/product/batch/activate', params)
}

// 删除广告产品
export function removeApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/product/remove', params)
}

// 广告产品修改竞价
export function updateBidApi(params) {
  return usePost('/platform-ozon/platform/ozon/advertisement/batch/update/bid', params)
}
