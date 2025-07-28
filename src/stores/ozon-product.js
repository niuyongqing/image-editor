export const useOzonProductStore = defineStore('OzonProductStore', {
  state: () => {
    return {
      attributes: {}, // 属性缓存
      addHeaderList: [], // 设置颜色和标题
      productTemplate: {},  // 产品模板
      variant: {} // 三级分类ID和店铺ID
    }
  }
})