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


// 查询变种关联关系
export function ozonRelationDetail(data) {
    return request({
        url: "/platform-common/platform/common/variant/relation/detail",
        method: "post",
        data: data,
    });
};

//  保存或更新变种关联关系
export function ozonRelationSave(data) {
    return request({
        url: "/platform-common/platform/common/variant/relation/save",
        method: "post",
        data: data,
    });
};

// 产品信息明细查询接口本
export function ozonCollectDetail(data) {
    return request({
        url: "/platform-common/platform/common/collect/product/detail",
        method: "post",
        data: data,
    });
};