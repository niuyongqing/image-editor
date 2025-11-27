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

/**
 * // ERP用户信息查询
 * @param {*} data
 * @returns
 */
export function userList(data) {
  return request({
    url: '/xinzhan-system/user/by-dept-name',
    method: 'post',
    data: data
  })
}
/**
 * // 查询ozon分类
 * @param {*} data
 * @returns
 */
export function categoryTree(data) {
  return request({
    url: '/platform-ozon/platform/ozon/attribute/new/category/tree',
    method: 'post',
  })
}
/**
 * // 列表查询
 * @param {*} data
 * @returns
 */
export function getList(data) {
  return request({
    url: '/platform-ozon/intelligent/product-store/list',
    method: 'post',
    data: data
  })
}
/**
 * // 详情查询
 * @param {*} data    // 产品id
 * @returns
 */
export function getDetail(data) {
  return request({
    url: '/platform-ozon/intelligent/product-store/detail/' + data,
    method: 'get',
  })
}
/**
 * // 添加备注
 * @param {*} data    // 产品id
 * @returns
 */
export function addRemark(data) {
  return request({
    url: '/platform-ozon/intelligent/product-store/add-remark',
    method: 'post',
    data: data,
  })
}
/**
 * // 提交编辑
 * @param {*} data    // 产品id
 * @returns
 */
export function submitEdit(data) {
  return request({
    url: '/platform-ozon/intelligent/product-store/submit-edit',
    method: 'post',
    data: data,
  })
}

// 智能化刊登-获取店铺(暂无使用)
export function shopListApi() {
  return useGet('/platform-ozon/intelligent/product-store/find/shop')
}

// 智能化刊登-提交刊登
export function publishApi(params) {
  return usePost('/platform-ozon/intelligent/product-store/submit/publish', params)
}

// 智能化刊登-日志列表
export function getLogListApi(params) {
  return usePost('/platform-ozon/intelligent/publish/log/list', params)
}