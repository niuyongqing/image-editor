// 新分类数接口
export function newCategoryTreeApi() {
  return usePost('/platform-ozon/platform/ozon/attribute/new/category/tree')
}

// 智能化刊登-产品详情
export function getDetailApi(id) {
  return useGet(`/platform-ozon/intelligent/product/getDetail/${id}`)
}
