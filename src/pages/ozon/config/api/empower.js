import request from "@/utils/request";

// 店铺列表查询
export function list(data) {
  return request({
    url: "/platform-ozon/platform/ozon/shop/list",
    method: "post",
    data: data,
  });
}

// 店铺新增
export function add(data) {
  return request({
    url: "/platform-ozon/platform/ozon/shop/add",
    method: "post",
    data: data,
  });
}

// 店铺删除
export function del(data) {
  return request({
    url: "/platform-ozon/platform/ozon/shop/del",
    method: "post",
    data: data,
  });
}

// 导出
export function exportList(data) {
  return request({
    url: '/platform-ozon/platform/ozon/shop/export',
    method: 'post',
    data: data
  })
}

// 修改简称/备注、别名
export function simpleNames(data) {
  return request({
    url: '/platform-ozon/platform/ozon/shop/update',
    method: 'post',
    data: data
  })
}

//禁售属性
export function meansAttribute() {
  return request({
    url: '/commodity-manage/commodity/means-public/forbid-sale',
    method: 'get',
  })
}

// 广告授权
export function adAuthorizeApi(params) {
  return usePost('/platform-ozon/platform/ozon/shop/advertising/authorize', params)
}
