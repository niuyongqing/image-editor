/** 速卖通公共接口 */
// 全量产品分组
export function getAllProductGroupsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getAllProductGroups', params)
}

// 全量运费模版
export function getAllFreightTemplateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getFreightTemplateList', params)
}

// 店铺账号
export function accountCacheApi(isChoice) {
  return useGet(`/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/cache${isChoice ? '?isChoice=true' : ''}`)
}

// 查询商家信息
export function getSellerInfoApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/semiCustodial/product/getSellerInfo', params)
}

// 上传图片到图片银行
export function uploadImageForSdkApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/imageBank/uploadImageForSdk', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// 批量修改图片尺寸
export function replaceSuffixApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/replace/suffix', params)
}