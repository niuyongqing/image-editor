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
  return request({
    url: '/platform-amazon/platform/amazon/product/list',
    method: 'post',
    data: data
  })
}
// 删除商品
export function del(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/del',
    method: 'post',
    data: data
  })
}
// 同步商品
export function sync(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/sync',
    method: 'post',
    data: data
  })
}
// 同步商品
export function syncProportion(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-amazon/platform/amazon/product/sync/proportion' + params,
    method: 'get',
  })
}
// 下载模板
export function downloadTemplate() {
  return request({
    url: '/platform-amazon/platform/amazon/product/download/template',
    method: 'get'
  })
}
// 上传模板
export function uploadTemplate(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/export/batch/edit',
    method: 'post',
    data: data
  })
}

// 批量更新接口
// 批量修改库存
export function quantityEdit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/batch/edit/quantity',
    method: 'post',
    data: data
  })
}
// 批量修改价格
export function ourPriceEdit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/batch/edit/ourPrice',
    method: 'post',
    data: data
  })
}
// 批量修改促销价格
export function discountedPriceEdit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/batch/edit/discountedPrice',
    method: 'post',
    data: data
  })
}
// 批量修改List Price
export function listPriceEdit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/batch/edit/listPrice',
    method: 'post',
    data: data
  })
}
// 批量修改商品标题
export function nameEdit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/batch/edit/item/name',
    method: 'post',
    data: data
  })
}
// 批量修改商品主图
export function imageEdit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/product/batch/edit/main/image',
    method: 'post',
    data: data
  })
}