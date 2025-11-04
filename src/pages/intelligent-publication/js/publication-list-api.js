/** 刊登序列 */
// 列表
export function listApi(params) {
  return usePost('/platform-ozon/intelligent/waitPublishProduct/page', params)
}

// 详情
export function detailApi(id) {
  return useGet(`/platform-ozon/intelligent/waitPublishProduct/getDetail/${id}`)
}

// 提交产品刊登 single
export function submitToPublishApi(id) {
  return usePost(`/platform-ozon/intelligent/waitPublishProduct/submitToPublish/${id}`)
}

// 提交产品刊登 batch
export function batchSubmitToPublishApi(params) {
  return usePost('/platform-ozon/intelligent/waitPublishProduct/batchSubmitToPublish', params)
}

// 更新详情
export function updateProductDetailApi(params) {
  return usePost('/platform-ozon/intelligent/waitPublishProduct/updateProductDetail', params)
}

// 取消刊登
export function cancelApi(params) {
  return usePost('/platform-ozon/intelligent/waitPublishProduct/cancel/batch', params)
}
