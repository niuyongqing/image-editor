// 产品编审
export const useProductReviewStore = defineStore('productReviewStore', {
  state: () => {
    return {
      attributes: {},
      detail: {},
      SKUTableData: [], // 变种表格数据
      joinedAspectNameList: [], // 变种属性列表
      watermarkOptions: [], // 水印选项
    }
  }
})