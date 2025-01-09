// 速卖通-普通商品和半托
export const useAliexpressPopProductStore = defineStore('aliexpressPopProductStore', {
  state: () => {
    return {
      sellerId: '',
      currencyCode: '', // 货币代码
      categoryId: '',
      SKUList: [],
      SKUTableData: [],
      SKUAttributesCache: {}, // SKU 属性缓存
      productDetail: {} // 产品详情
    }
  }
})
