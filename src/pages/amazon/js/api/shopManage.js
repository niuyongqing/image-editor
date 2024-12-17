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
//新增
export function addShop(data) {
  return request({
    url: `/platform-amazon/platform/amazon/shop/add`,
    method: 'post',
    data: data
  })
}
// 编辑
export function editShop(data) {
  return request({
    url: `/platform-amazon/platform/amazon/shop/edit`,
    method: 'post',
    data: data
  })
}
// 删除
export function delShop(data) {
  return request({
    url: `/platform-amazon/platform/amazon/shop/del/${data}`,
    method: 'post',
    // data: data
  })
}
// 列表
export function shopList(data) {
  return request({
    url: `/platform-amazon/platform/amazon/shop/list`,
    method: 'post',
    data: data
  })
}

//禁售属性
export function meansAttribute() {
  return request({
    url: '/commodity-manage/commodity/means-public/forbid-sale',
    method: 'get',
  })
}