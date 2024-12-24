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

//获取部门
export function userDep() {
  return request({
    url: `/platform-amazon/platform/amazon/account/dep/list`,
    method: 'get',
  })
}

//获取用户
export function getAccountUser(data) {
  return request({
    url: `/platform-amazon/platform/amazon/account/user`,
    method: 'post',
    data: data
  })
}
//新增
export function addAccount(data) {
  return request({
    url: `/platform-amazon/platform/amazon/account/add`,
    method: 'post',
    data: data
  })
}
// 编辑
export function editAccount(data) {
  return request({
    url: `/platform-amazon/platform/amazon/account/edit`,
    method: 'post',
    data: data
  })
}
// 删除
export function delAccount(data) {
  return request({
    url: `/platform-amazon/platform/amazon/account/del/${data}`,
    method: 'post',
    // data: data
  })
}
// 列表
export function accountList(data) {
  return request({
    url: `/platform-amazon/platform/amazon/account/list`,
    method: 'post',
    data: data
  })
}