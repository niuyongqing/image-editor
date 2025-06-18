/** 平台公共接口 */
// 平台店铺列表
export function shopListApi() {
  return useGet('/platform-common/platform/common/shop/findShopByUserId')
}
