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