import request from '@/utils/request'
// get方法参数序列化
function getParamsFn(data) {
  let params = ''
  if (data) {
    let arr = []
    Object.keys(data).forEach(key => {
      let str = `${key}=${data[key]}`
      arr.push(str)
    })
    params = `?${arr.join('&')}`
  }
  return params
}
// 第一步：获取授权链接
export function getUrl(data) {
  return request({
    url: '/platform-amazon/platform/amazon/auth/url',
    method: 'post',
    data: data,
  })
}
// 第二步：授权回调保存code
export function saveCode(data) {
  return request({
    url: '/platform-amazon/platform/amazon/auth/callback',
    method: 'post',
    data: data,
  })
}
// 第三步：获取该区域的access_token
export function getLoadAccessToken(data) {
  return request({
    url: '/platform-amazon/platform/amazon/auth/loadAccessToken',
    method: 'post',
    data: data,
  })
}
// 刷新授权Token
export function refreshToken(data) {
  return request({
    url: '/platform-amazon/platform/amazon/auth/refresh/all/token',
    method: 'post',
    data: data,
  })
}
// 获取区域列表信息
export function getAreaList(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-amazon/platform/marketplace/group/area/list' + params,
    method: 'get',
  })
}
// 根据区域获取站点列表
export function getMarketList(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-amazon/platform/marketplace/area/market/list' + params,
    method: 'get',
  })
}
// 获取列表
export function list(data) {
  return request({
    url: '/platform-amazon/platform/amazon/auth/list',
    method: 'post',
    data: data,
  })
}

// 获取授权失败列表
export function failAuthList() {
  return request({
    url: '/platform-amazon/platform/amazon/auth/fail/auth',
    method: 'get',
  })
}