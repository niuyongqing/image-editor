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
// 获取店铺列表
export function getShopList(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-amazon/platform/amazon/product/shops' + params,
    method: 'get',
  })
}
// 根据区域获取站点列表
export function getMarketList(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/market/' + data,
    method: 'get',
  })
}
// 获取产品类别
export function getProductTypes(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/types',
    method: 'post',
    data: data
  })
}
// 获取json链接
export function getJsonUrl(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/type/attributes',
    method: 'post',
    data: data
  })
}
// 校验属性
// 获取json链接
export function validateJson(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/validate',
    method: 'post',
    data: data
  })
}

// table接口
// 获取商品列表
export function getList(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-amazon/platform/amazon/product/list' + params,
    method: 'get',
  })
}