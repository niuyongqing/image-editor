// 产品编审
export const useProductReviewStore = defineStore('productReviewStore', {
  state: () => {
    return {
      loading: false,
      attributes: {},
      addHeaderList: [],
      productDetail: {},
      waterMarkOptions: [],
      SKUTableData: [], // 变种表格数据
      attrList: [] // 变种属性列表
    }
  }
})