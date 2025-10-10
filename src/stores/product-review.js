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
      attrList: [], // 变种属性列表
      addHeaderList: [], // 设置颜色和标题
      dataType: '' // 待发布编辑存储数据来源  编辑/现有产品/资料库
    }
  }
})