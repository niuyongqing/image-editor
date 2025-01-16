/** 全托管 */
// 商品列表
export function listApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/list', params)
}

// 同步单个商品
export function syncOneApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/sync-one', params)
}

// 同步列表
export function syncListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/sync-list', params)
}

// 同步进度条
export function syncProgressApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/sync-progress', params)
}

// 商品详情
export function detailApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/detail', params)
}

// 创建商品
export function createApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/create', params)
}

// 编辑
export function editApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/edit', params)
}

// 全托管商品待发布-保存
export function saveDraftApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/save-draft', params)
}

// 复制
export function copyToDraftApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/copy-to-draft', params)
}

// JIT 类型商品库存查询
export function queryStockApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/query-stock', params)
}

// JIT 类型商品库存编辑
export function editStockApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/edit-stock', params)
}

// 按照类目查询JIT库存规则
export function stockRuleApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/stock-rule', params)
}

// 按照商家查询仓库编码
export function queryWarehouseCodeApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/full-custodial/product/query-warehouse-code', params)
}

// 获取全托管商家渠道信息
export function queryChannelApi(sellerId) {
  return useGet(`/platform-aliexpress/platform/aliexpress/full-custodial/product/query-channel?sellerId=${sellerId}`)
}
