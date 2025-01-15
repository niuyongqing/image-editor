// 已加入商品列表
export function listApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/joinedList', params)
}

// 待加入商品列表
export function waitPublishListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/selectedList', params)
}

// 同步店铺在线商品 (已加入)
export function syncListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/sync/list', params)
}

// 同步待加入单个商品
export function syncWaitPublishOneApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/sync/syncSelectedOne', params)
}

// 同步已加入单个商品
export function syncOneApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/sync/one', params)
}

// 商家基本信息查询
export function popChoiceInfoApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/choiceInfoQuery', params)
}

// 升级为半托管SKU信息查询
export function SKUInfoApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/getPopChoiceDraftQueryProduct', params)
}

// 商品详情
export function detailApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/selectOne', params)
}

// 预存草稿详情
export function getPopChoiceProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/getPopChoiceProduct', params)
}

// 获取半托管草稿详情
export function getSemiCustodialDraftsProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/getSemiCustodialDraftsProduct', params)
}

// 存下草稿详情
export function draftSaveApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/popChoiceProductSubmit', params)
}

// 半托管第二阶段提交
export function popChoiceProductSaveApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/popChoiceProduct', params)
}

// 半托管编辑
export function editApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/edit', params)
}

// 已加入-删除
export function deleteSemiProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/deleteSemiProduct', params)
}

// 已加入-库存编辑
export function updateStocksApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/updateStocks', params)
}
