export function getList(params) {
  return usePost("/platform-lazada/platform/lazada/product/listNew", params);
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

// 富文本 图片上传
export function marketImageLazada(params, headers) {
  return usePost(
    "/platform-lazada/platform/lazada/file/upload/market-image-lazada",
    params,
    { headers }
  );
}
// 视频的封面图 上传
export function videoImageUpload(params, headers) {
  return usePost(
    "/platform-lazada/platform/lazada/file/upload/video-image",
    params,
    { headers }
  );
}
// 视频 上传
export function videoUpload(params, headers) {
  return usePost("/platform-lazada/platform/lazada/file/upload/video", params, {
    headers,
  });
}

// sku列表
export function skuList(data) {
  return usePost("/commodity-manage/commodity/store/sku/list", data);
}

// 水印列表
export function watermarkList(params) {
  return useGet("/platform-setting/platform/setting/template/watermark/list");
}

// lazada 添加站点商品
export function lazadaAdd(data) {
  return usePost("/platform-lazada/platform/lazada/product/add", data);
}
// lazada 添加站点商品
export function lazadaEdit(data) {
  return usePost("/platform-lazada/platform/lazada/product/edit", data);
}

// lazada 商品详情
export function lazadaProductDetail(data) {
  return usePost("/platform-lazada/platform/lazada/product/detail", data);
}
// videoUrl
export function lazadaVideoUrl(data) {
  return usePost("/platform-lazada/platform/lazada/file/video/url", data);
}
// 根据站点获取分类
export function lazadaCategoryTree(data) {
  return usePost(
    "/platform-lazada/platform/lazada/attribute/category/tree",
    data
  );
}
// 同步
export function syncOne(data) {
  return usePost("/platform-lazada/platform/lazada/product/sync-one", data);
}
// 同步所有店铺商品
export function syncAll() {
  return useGet("/platform-lazada/platform/lazada/product/sync-all");
}
// 下架
export function deactivate(data) {
  return usePost("/platform-lazada/platform/lazada/product/deactivate", data);
}

// 获取已填充好值的分类属性列表
export function hasValueAttributes(data) {
  return usePost(
    "/platform-lazada/platform/lazada/attribute/category/hasValueAttributes",
    data
  );
}

// 获取已填充好值的分类属性列表
export function saveProduct(data) {
  return usePost("/platform-lazada/platform/lazada/product/saveProduct", data);
}
