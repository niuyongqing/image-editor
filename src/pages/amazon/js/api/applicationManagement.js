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

// 应用列表
export function getList(data) {
  return request({
    url: '/platform-amazon/platform/amazon/app/queryAll',
    method: 'get'
  })
}
// 新增应用信息
export function add(data) {
  return request({
    url: '/platform-amazon/platform/amazon/app/add',
    method: 'post',
    data: data,
  })
}
// 编辑应用信息
export function edit(data) {
  return request({
    url: '/platform-amazon/platform/amazon/app/edit',
    method: 'post',
    data: data,
  })
}
// 编辑应用信息
export function del(data) {
  return request({
    url: '/platform-amazon/platform/amazon/app/del/' + data,
    method: 'post',
    // data: data,
  })
}