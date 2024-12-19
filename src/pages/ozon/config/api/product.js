import request from "@/utils/request";
// 待发布
export function list(data) {
  return request({
    url: "/platform-wish/platform/wish/product/list",
    method: "post",
    data: data,
  });
}

// 店铺列表
export function accountCache() {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/cache`,
    method: "post",
  });
}

// 店铺分类
export function categoryTree(data) {
  return request({
    url: "/platform-ozon/platform/ozon/attribute/category/tree",
    method: "post",
    data: data,
  });
}

// 获取属性
export function categoryAttributes(data) {
  return request({
    url: '/platform-ozon/platform/ozon/attribute/category/attributes',
    method: 'post',
    data:data
  })
}

// 获取变种主题中的下拉值
export function attributesValues(data) {
  return request({
    url: '/platform-ozon//platform/ozon/attribute/category/attributes/values',
    method: 'post',
    data:data
  })
}

// 获取品牌
export function categoryBrand(data){
  return request({
    url: '/platform-wish/platform/wish/attribute/category/brand',
    method: 'post',
    data:data
  })
}

// 视频接口
export function videoQuota(data){
  return request({
    url: '/platform-lazada/platform/lazada/file/video/quota',
    method: 'post',
    data:data
  })
}

// 新增产品
export function add(data){
  return request({
    url: '/platform-wish/platform/wish/product/add',
    method: 'post',
    data:data
  })
}

// 删除产品（单个）
export function del(data){
  return request({
    url: '/platform-wish/platform/wish/product/del',
    method: 'post',
    data:data
  })
}

// 获取第三方返回的仓库
export function getWarehouses(data){
  return request({
    url: '/platform-wish/platform/wish/warehouse/info',
    method: 'post',
    data:data
  })
}