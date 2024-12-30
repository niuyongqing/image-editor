/** 刊登相关 */
// 普通商品列表
export function productListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/list', params)
}

// 同步单个商品
export function syncOneApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/sync/one', params)
}

// 同步店铺商品
export function syncListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/sync/list', params)
}

// 同步进度条
export function syncProgressApi(redisKey) {
  return useGet(`/platform-aliexpress/platform/aliexpress/general/product/getToken?redisKey=${redisKey}`)
}

// 同步全部商品
export function syncAllApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/sync/all', params)
}

// 删除商品
export function deleteProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/deleteProduct', params)
}

// 下架商品
export function productsOffShelfApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/productsOffShelf', params)
}

// 上架商品
export function productsShelvesApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/productsShelves', params)
}

// 复制商品(复一到多)
export function copyProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/copyProduct', params)
}

// 商品添加备注
export function addNotesApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/addNotes', params)
}

// 产品分类
export function getProductClassificationApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getProductClassification', params)
}

// 产品属性(mongoDB 这个接口快)
export function resultByPostCateIdAndPathApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/resultByPostCateIdAndPath', params)
}

// 产品子属性(速卖通api, 调中国省份数据的, 这个慢)
export function getResultByPostCateIdAndPathApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getResultByPostCateIdAndPath', params)
}

// 运费模版列表
export function getListFreightTemplateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getListFreightTemplate', params)
}

// 运费模版同步
export function syncGetListFreightTemplateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/sync/syncGetListFreightTemplate', params)
}

// 服务模版列表
export function queryPromiseTemplateByIdApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/queryPromiseTemplateById', params)
}

// 服务模版同步
export function syncPromiseTemplateByIdApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/sync/queryPromiseTemplateById', params)
}

// 产品分组列表
export function getProductGroupsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/sync/getProductGroups', params)
}

// 欧盟责任人列表
export function euPersonListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/euPersonList', params)
}

// 欧盟责任人同步
export function syncEuPersonListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/sync/euPersonList', params)
}

// 欧盟责任人同步
export function qualificationsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/sync/qualifications', params)
}

// 新增商品
export function addProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/add', params)
}

// 编辑商品
export function editProductApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/edit', params)
}

// 区域数据
export function areaListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getAreaList', params)
}

// 全量产品分组
export function getAllProductGroupsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getAllProductGroups', params)
}

// 全量运费模版
export function getAllFreightTemplateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getFreightTemplateList', params)
}

// 商品详情
export function productDetailApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/selectOne', params)
}

// 制造商列表
export function manufactureListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/manufacture-list', params)
}

/* ==========  草稿相关  ============ */
// 新增草稿
export function saveProductDraftsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/saveProductDrafts', params)
}

// 编辑草稿
export function editProductDraftsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/general/product/editProductDrafts', params)
}

// 半托管商品新发一阶段草稿保存接口(提交到速卖通)
export function popOneSubmitApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/popOneSubmit', params)
}
