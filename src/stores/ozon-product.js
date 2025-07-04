export const useOzonProductStore = defineStore('OzonProductStore', {
  state: () => {
    return {
      attributes: {}, // 属性缓存
      addHeaderList: [], // 设置颜色和标题
    }
  }
})