import request from "@/utils/request";
// 订单列表
export function orderList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/order/list`,
    method: "post",
    data: data,
  });
}
// 导出
export function orderExport(data) {
  return request({
    url: `/platform-ozon/platform/ozon/order/export`,
    method: "post",
    data: data,
  });
}
// 同步订单
export function asyncOrder(data) {
  return request({
    url: `/platform-ozon/platform/ozon/order/sync`,
    method: "post",
    data: data,
  });
}
