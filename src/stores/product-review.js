// 产品编审
export const useProductReviewStore = defineStore('productReviewStore', {
  state: () => {
    return {
      attributes: {},
      productDetail: {},
      waterMarkOptions: [],
      SKUTableData: [], // 变种表格数据
      attrList: [], // 变种属性列表
      addHeaderList: [], // 设置颜色和标题
    }
  }
})