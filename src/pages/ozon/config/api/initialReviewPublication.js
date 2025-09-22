import request from '@/utils/request'
// 下载
export function exportProductList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/list`,
    method: 'post',
    data: data
  })
}

// 审核
export function ozonAccount(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/ozon/shop`,
    method: 'post',
    data: data
  })
}

// 获取详情列表
export function setAccountlist(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/list`,
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
