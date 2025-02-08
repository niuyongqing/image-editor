import request from "@/utils/request";

// 店铺列表查询
export function list(data) {
  return request({
    url: "/platform-ozon/platform/ozon/activity/list",
    method: "post",
    data: data,
  });
}

// 活动数据查询
export function detail(data) {
  return request({
    url: "/platform-ozon/platform/ozon/activity/detail",
    method: "post",
    data: data,
  });
}

// 同步促销活动
export function syncActivity(data) {
  return request({
    url: "/platform-ozon/platform/ozon/activity/sync",
    method: "get",
    data: data,
  });
}

// 同步活动进度条
export function activityProgress(data) {
  return request({
    url: `/platform-ozon/platform/ozon/activity/progress-bar?uuid=${data}`,
    method: "get",
  });
}

// 单个同步
export function syncOneProduct(data) {
  return request({
    url: `/platform-ozon/platform/ozon/activity/sync/action/product?account=${data.account}&activityId=${data.activityId}`,
    method: "get",
  });
}

// 添加活动
export function candidates(data) {
  return request({
    url: `/platform-ozon/platform/ozon/activity/get/candidates`,
    method: "post",
    data: data,
  });
}

// 添加商品
export function addProducts(data) {
  return request({
    url: `/platform-ozon/platform/ozon/activity/save/product`,
    method: "post",
    data: data,
  });
}

// 删除活动中的商品
export function delActProd(data) {
  return request({
    url: `/platform-ozon/platform/ozon/activity/delete/product`,
    method: "post",
    data: data,
  });
}