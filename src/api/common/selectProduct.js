/**
 * 选择资料库产品弹窗API
 */
//  获取禁售属性
export function forbidSaleApi() {
  return useGet("/commodity-manage/commodity/means-public/forbid-sale");
}

//  产品资料库数据
export function storeList(data) {
  return usePost("/commodity-manage/commodity/store/list", data);
}

//  产品资料库详情
export function storeDetail(data) {
  return usePost("/commodity-manage/commodity/store/details", data);
}

//获取关键词所有的数据
export function cacheGet() {
  return useGet("/commodity-manage/infringe1/cache/get");
}
