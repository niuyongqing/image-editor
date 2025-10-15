import request from '@/utils/request'
// 下载
export function exportProductList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/list`,
    method: 'post',
    data: data
  })
}

// 初审审核
export function firstAudit(data) {
  return request({
    url: `/platform-ozon/platform/ozon/commodity/first/audit`,
    method: 'post',
    data: data
  })
}

//终审审核
export function lastAudit(data) {
  return request({
    url: `/platform-ozon/platform/ozon/commodity/last/audit`,
    method: 'post',
    data: data
  })
}

//驳回审核
export function rejectAudit(data) {
  return request({
    url: `/platform-ozon/platform/ozon/commodity/reject/audit`,
    method: 'post',
    data: data
  })
}

// 获取表单列表
export function commodityList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/commodity/list`,
    method: 'post',
    data: data
  })
}

// 获取详情
export function getProductDetail(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/detail`,
    method: 'post',
    data: data
  })
}

// 申请拍照提交
export function batchOldStore(data) {
  return request({
    // url: `/commodity-manage/commodity/store/old`,
    url: `/platform-ozon/intelligent/product/oldArtApply`,
    method: 'post',
    data: data
  })
}

//获取用户
export function getAccountUser(data) {
  return request({
    url: `/platform-ozon/platform/ozon/commodity/find/user`,
    method: 'get',
    data: data
  })
}
