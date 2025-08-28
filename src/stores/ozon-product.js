export const useOzonProductStore = defineStore('OzonProductStore', {
  state: () => {
    return {
      attributes: [], // 属性缓存
      addHeaderList: [], // 设置颜色和标题
      productTemplate: {},  // 产品模板
      variant: {}, // 三级分类ID和店铺ID
      dataType: '',  // 待发布编辑存储数据来源  编辑/现有产品/资料库
      templateType: '',  // 编辑模板类型 
      dataLoading: false,
    }
  }
})