// 全托管商品待发布列表
export function draftListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/draft-list', params)
}

// 全托管商品待发布-批量发布
export function createBatchApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/create-batch', params)
}

// 全托管商品待发布-删除
export function delDraftApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/del-batch', params)
}
