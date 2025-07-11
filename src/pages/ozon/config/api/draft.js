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

// 认领采集产品至待发布
export function receiveProductToWaitPublishApi(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/receiveProductToWaitPublish', params)
}

// 视频 
export function videoUpload(params, headers) {
    return usePost('/platform-ozon/platform/ozon/file/upload/video', params, {
        headers,
    })
}


// 上传图片
export function uploadImage(params, headers) {
    return usePost("/platform-ozon/platform/ozon/file/upload/img", params, {
        headers,
    })
}

// 批量认领至采集箱
export function receiveProductToGatherBox(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/receiveProductToGatherBox', params)
}

// 批量备注
export function ozonRemark(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/batchRemark', params)
}


// 批量删除产品
export function ozonDeleteProduct(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/batchDeleteProduct', params)
}
// 批量发布产品
export function batchPublishToPlatform(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/batchPublishToPlatform', params)
}


//  批量获取详情
export function batchQueryDetail(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/batchQueryDetail', params)
}


//  批量修改产品属性
export function batchUpdateProduct(params) {
    return usePost('/platform-ozon/platform/ozon/gather/product/batchUpdateProduct', params)
}