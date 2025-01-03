// 速卖通-普通商品和半托
export const useAliexpressPopProductStore = defineStore('aliexpressPopProductStore', {
  state: () => {
    return {
      sellerId: '',
      categoryId: '',
      SKUList: [],
      SKUTableData: [],
      productDetail: {} // 产品详情
    }
  }
})
