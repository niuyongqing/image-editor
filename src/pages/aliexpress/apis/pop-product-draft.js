// 普通商品待发布列表
export function getProductDraftsListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/getProductDraftsList', params)
}

// 草稿详情
export function getProductDraftsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/getProductDrafts', params)
}

// 删除草稿
export function deleteProductDraftsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/deleteProductDrafts', params)
}
