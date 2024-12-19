import request from '@/utils/request'

// 获取账号列表
export function setAccountlist(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/list`,
    method: 'post',
    data: data
  })
}

// 获取账号
export function ozonAccount(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/ozon/shop`,
    method: 'post',
    data: data
  })
}

//获取部门
export function userDep(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/dep`,
    method: 'post',
    data: data
  })
}

//获取用户
export function getAccountUser(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/user`,
    method: 'post',
    data: data
  })
}

//新增
export function addAccount(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/add/account`,
    method: 'post',
    data: data
  })
}

//修改
export function editAccount(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/update/account`,
    method: 'post',
    data: data
  })
}

//删除
export function delAccount(data) {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/del/account`,
    method: 'post',
    data: data
  })
}



