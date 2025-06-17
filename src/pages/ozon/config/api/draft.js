import request from "@/utils/request";

// 店铺列表查询
export function ozonDraftList(data) {
  return request({
    url: "/platform-ozon/platform/ozon/gather/product/list",
    method: "post",
    data: data,
  });
};

//  采集箱产品详情
export function ozonDraftDetail(data) {
    return request({
        url: "/platform-ozon/platform/ozon/gather/product/detail",
        method: "post",
        data: data,
    });
};