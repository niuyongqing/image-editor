// 新分类数接口
export function newCategoryTreeApi() {
  return usePost('/platform-ozon/platform/ozon/attribute/new/category/tree')
}

// 智能化刊登-产品详情
export function getDetailApi(id) {
  return useGet(`/platform-ozon/intelligent/product/getDetail/${id}`)
}

// 智能化刊登-更新产品详情
export function updateProductDetailApi(params) {
  return usePost('/platform-ozon/intelligent/product/updateProductDetail', params)
}

// 分类属性(不传店铺id)
export function getAttributesApi(params) {
  return usePost('/platform-ozon/platform/ozon/attribute/new/category/attributes', params)
}
