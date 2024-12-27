export function getList(params) {
  return usePost("/platform-lazada/platform/lazada/product/list", params);
}

export function accountCache() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}
export function categoryTree(params) {
  return usePost(
    "/platform-lazada/platform/lazada/attribute/category/tree",
    params
  );
}
//  品牌列表
export function getBrandList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/attribute/category/brand",
    params
  );
}

// 产品图片上传
export function uploadImage(params, headers) {
  return usePost(
    "/platform-lazada/platform/lazada/file/upload/main-image",
    params,
    { headers }
  );
}
// 获取分类类型属性
export function categoryAttributesApi(params) {
  return usePost(
    "/platform-lazada/platform/lazada/attribute/category/attributes",
    params
  );
}
