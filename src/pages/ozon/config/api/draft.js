import request from "@/utils/request";

// 店铺列表查询
export function ozonDraftList(data) {
  return request({
    url: "/platform-ozon/platform/ozon/gather/product/list",
    method: "post",
    data: data,
  });
};
