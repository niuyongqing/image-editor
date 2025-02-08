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
