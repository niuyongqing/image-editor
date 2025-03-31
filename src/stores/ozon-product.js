export const useOzonProductStore = defineStore('OzonProductStore', {
  state: () => {
    return {
      attributes: {}, // 属性缓存
    }
  }
})