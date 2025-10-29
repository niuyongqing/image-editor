
import request from '@/utils/request'
// 获取店铺列表页数据
export const getStoreTemplateList = async (data) => {
  return request({
    url: '/platform-ozon/intelligent/shop/template/list',
    method: 'POST',
    data,
  });
};

/**
 * // 创建店铺模板
 * @param {*} data 
 * @returns 
 */
export function createShopTemplate(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/create',
    method: 'post',
    data: data
  })
}

/**
 * // 更新店铺模板
 * @param {*} data 
 * @returns 
 */
export function updateShopTemplate(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/update',
    method: 'post',
    data: data
  })
}

/**
 * // 获取店铺模板详情
 * @param {*} data 
 * @returns 
 */
export function getShopTemplateDetails(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/details/' + data,
    method: 'GET',
  });
}

/**
 * // 获取店铺模板下的店铺列表
 * @param {*} data 
 * @returns 
 */
export function getShopList() {
  return request({
    url: '/platform-ozon/intelligent/shop/template/shop',
    method: 'GET',
  });
}

/**
 * // 停用店铺模板
 * @param {*} data 
 * @returns 
 */
export function stopShopTemplate(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/enable',
    method: 'POST',
    data: data
  })
}


/**
 * // 删除店铺模板
 * @param {*} data 
 * @returns 
 */
export function delShopTemplate(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/del/' + data,
    method: 'DELETE',
    data: data
  })
}

/*添加备注
 * @param {*} data 
 * @returns 
 */
export function addRemarkShopTemplate(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/add/remark',
    method: 'POST',
    data: data
  })
}

/**
 * // 复制店铺模板
 * @param {*} data 
 * @returns 
 */
export function copyShopTemplate(data) {
  return request({
    url: '/platform-ozon/intelligent/shop/template/copy',
    method: 'POST',
    data: data
  })
}



