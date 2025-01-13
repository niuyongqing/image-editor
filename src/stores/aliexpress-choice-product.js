// 速卖通-全托管
export const useAliexpressChoiceProductStore = defineStore('aliexpressChoiceProductStore', {
  state: () => {
    return {
      isEdit: false,
      sellerId: '',
      channelInfo: {}, // 全托管渠道信息
      categoryId: '',
      SKUList: [],
      SKUTableData: [],
      productDetail: {} // 全托管产品详情
    }
  },
})