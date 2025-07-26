/** 批量编辑 */
// 批量查询采集箱产品详情
export function batchQueryDetailApi(params) {
  return usePost('/platform-ozon/platform/ozon/gather/product/batchQueryDetail', params)
}

// 批量编辑采集箱产品
export function batchUpdateProductApi(params) {
  return usePost('/platform-ozon/platform/ozon/gather/product/batchUpdateProduct', params)
}


// 批量查询待发布产品详情
export function detailListApi(params) {
  return usePost('/platform-ozon/platform/ozon/wait/product/detail-list', params)
}

// 批量编辑待发布产品
export function editBatchSaveApi(params) {
  return usePost('/platform-ozon/platform/ozon/wait/product/edit-batch-save', params)
}
