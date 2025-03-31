// 速卖通-普通商品和半托
export const useAliexpressPopProductStore = defineStore('aliexpressPopProductStore', {
  state: () => {
    return {
      isEdit: false,
      sellerId: '',
      currencyCode: '', // 货币代码
      categoryId: '',
      SKUList: [],
      SKUTableData: [],
      SKUAttributesCache: {}, // SKU 属性缓存
      isSemiCustodial: false, // 是否为半托商品
      productDetail: {}, // 产品详情
      variantTemplateList: [] // 变种模版列表
    }
  }
})
