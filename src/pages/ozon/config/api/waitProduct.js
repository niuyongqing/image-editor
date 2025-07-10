/**
 *daraz 商品待发布
 */

import request from "@/utils/request";

// 待发布列表
export function ozonProductList(data) {
  return request({
    url: "/platform-ozon/platform/ozon/wait/product/list",
    method: "post",
    data: data,
  });
}

// 待发布页面编辑后发布
export function ozonProductEdit(data) {
  return request({
    url: "/platform-ozon/platform/ozon/wait/product/edit",
    method: "post",
    data: data,
  });
}

// 待发布页面删除
export function ozonProductDel(data) {
  return request({
    url: "/platform-ozon/platform/ozon/wait/product/del",
    method: "post",
    data: data,
  });
}

// 待发布页面添加备注
export function ozonProductRemark(data) {
  return request({
    url: "/platform-ozon/platform/ozon/wait/product/remark",
    method: "post",
    data: data,
  });
}


// 待发布详情
export function ozonProductDetail(data) {
  return request({
    url: "/platform-ozon/platform/ozon/wait/product/detail",
    method: "post",
    data: data,
  });
}

// 待发布--批量发布
export function ozonProductPublish(data) {
  return request({
    url: "/platform-ozon/platform/ozon/wait/product/batch/publish",
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

// 保存到待发布
export function saveTowaitProduct(data) {
  return request({
    url: '/platform-ozon/platform/ozon/wait/product/save',
    method: 'post',
    data:data
  })
}

// 待发布数量统计
export function statistics(data) {
  return request({
    url: '/platform-ozon/platform/ozon/wait/product/statistics/state',
    method: 'post',
    data:data
  })
}


// 待发布导出
export function waitExport(data) {
  return request({
    url: '/platform-ozon/platform/ozon/wait/product/export',
    method: 'post',
    data:data
  })
}

// 批量修改售价、原价等
export function waitBathUpdate(data) {
  return request({
    url: '/platform-ozon/platform/ozon/wait/product/bath/update',
    method: 'post',
    data:data
  })
}

// 编辑页面发布
export function productPublish(data) {
  return request({
    url: '/platform-ozon/platform/ozon/wait/product/publish',
    method: 'post',
    data
  })
}

// 获取修改品牌的分类
export function brandCategory(data) {
  return request({
    url: '/platform-ozon/platform/ozon/wait/product/history/category',
    method: 'post',
    data
  })
}