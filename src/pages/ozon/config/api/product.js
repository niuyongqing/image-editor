import request from "@/utils/request";
// 待发布
export function list(data) {
  return request({
    url: "/platform-ozon/platform/ozon/product/list",
    method: "post",
    data: data,
  });
}

// 店铺列表
export function accountCache() {
  return request({
    url: `/platform-ozon/platform/ozon/setting/account/relevance/user/cache`,
    method: "post",
  });
}

// 店铺分类
export function categoryTree(data) {
  return request({
    url: "/platform-ozon/platform/ozon/attribute/category/tree",
    method: "post",
    data: data,
  });
}

// 历史分类
export function historyCategory(data) {
  return request({
    url: "/platform-ozon/platform/ozon/attribute/history/category",
    method: "post",
    data: data,
  });
}

// 保存历史分类
export function addHistoryCategory(data) {
  return request({
    url: "/platform-ozon/platform/ozon/attribute/add/history/category",
    method: "post",
    data: data,
  });
}

// 历史属性
export function historyAttribute(data) {
  return request({
    url: "/platform-ozon/platform/ozon/attribute/history/attribute",
    method: "post",
    data: data,
  });
}

// 获取属性
export function categoryAttributes(data) {
  return request({
    url: '/platform-ozon/platform/ozon/attribute/category/attributes',
    method: 'post',
    data: data
  })
}

// 获取变种主题中的下拉值
export function attributesValues(data) {
  return request({
    url: '/platform-ozon//platform/ozon/attribute/category/attributes/values',
    method: 'post',
    data: data
  })
}

// 获取品牌
export function categoryBrand(data) {
  return request({
    url: '/platform-wish/platform/wish/attribute/category/brand',
    method: 'post',
    data: data
  })
}

// 视频接口
export function videoQuota(data) {
  return request({
    url: '/platform-lazada/platform/lazada/file/video/quota',
    method: 'post',
    data: data
  })
}

// 新增产品
export function add(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/add',
    method: 'post',
    data: data
  })
}

// 删除产品
export function del(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/del',
    method: 'post',
    data: data
  })
}

// 获取第三方返回的仓库
export function getWarehouses(data) {
  return request({
    url: '/platform-wish/platform/wish/warehouse/info',
    method: 'post',
    data: data
  })
}

// 批量修改库存
export function updateStock(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/batch/update/stock',
    method: 'post',
    data: data
  })
}

// 同步当前产品
export function syncOneProduct(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/sync/product',
    method: 'post',
    data: data
  })
}

// 同步所有产品
export function syncShopProductAll(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/sync-all',
    method: 'post',
    data: data
  })
}

export function syncShopProduct(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/sync/shop/product',
    method: 'post',
    data: data
  })
}

// 下架产品
export function batchArchive(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/batch/archive',
    method: 'post',
    data: data
  })
}

// 修改备注
export function remark(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/remark',
    method: 'post',
    data: data
  })
}

// 修改备注
export function unarchive(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/batch/unarchive',
    method: 'post',
    data: data
  })
}

// 查询产品详情
export function getDetail(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/detail',
    method: 'post',
    data: data
  })
}

// 复制
export function copyList(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/copy',
    method: 'post',
    data: data
  })
}

// 修改价格
export function updatePrices(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/batch/update/price',
    method: 'post',
    data: data
  })
}

// 批量下载图片
export function downloadImgs(data) {
  return request({
    url: '/platform-ozon/platform/ozon/file/download/img',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json; application/octet-stream'
    }
  })
}

// 同步历史分类
export function syncHistoryCategory(data) {
  return request({
    url: '/platform-ozon/platform/ozon/attribute/sync/history/category',
    method: 'post',
    data: data
  })
}

// 合并产品列表
export function mergeList(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/merge/list',
    method: 'post',
    data: data
  })
}


// 获取修改仓库数据的列表
export function productWarehouse(data) {
  return request({
    url: '/platform-ozon/platform/ozon/warehouse/query/warehouse',
    method: 'post',
    data: data
  })
}

// 进度条接口
export function asyncProgress(data) {
  return request({
    url: "/platform-ozon/platform/ozon/product/progressBar?uuid=" + data,
    method: 'get',
  })
}

// 获取设置店铺币种列表
export function shopCurrency(data) {
  return request({
    url: "/platform-ozon/platform/ozon/shop/setting",
    method: 'get',
  })
}

// 获取修改仓库数据的列表
export function updateCurrency(data) {
  return request({
    url: '/platform-ozon/platform/ozon/shop/update/currency',
    method: 'post',
    data: data
  })
}

// 富文本修改图片尺寸
export function replaceSuffix(data) {
  return request({
    url: '/platform-ozon/platform/ozon/file/replace/suffix',
    method: 'post',
    data: data
  })
}

// 批量修改字段数据
export function batchUpdate(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/batch/update',
    method: 'post',
    data: data
  })
}


// 拆分在线商品列表数据统计接口
export function byState(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/statistics/by/state',
    method: 'post',
    data: data
  })
}

// 进度条接口
export function shopAsyncProgress(data) {
  return request({
    url: "/platform-ozon/platform/ozon/product/get/sync/process?progressId=" + data,
    method: 'get',
  })
}

// 导出
export function exportProduct(data) {
  return request({
    url: '/platform-ozon/platform/ozon/product/export/product',
    method: 'post',
    data
  })
}

// 存为产品模板
export function tempSaveOrUpdate(data) {
  return request({
    url: '/platform-ozon/platform/ozon/template/saveOrUpdate',
    method: 'post',
    data
  })
}

// 引用产品模板
export function templateList(data) {
  return request({
    url: '/platform-ozon/platform/ozon/template/list',
    method: 'post',
    data
  })
}

// 根据分类id查询分类用于修改属性品牌
export function brandCategory(data) {
  return request({
    url: '/platform-ozon/platform/ozon/attribute/list/history/category',
    method: 'post',
    data
  })
}

// 根据资料库id查询数据
export function brandDatabase(data) {
  return request({
    url: 'commodity-manage/commodity/store/detailImages',
    method: 'post',
    data
  })
}

// 根据产品id查询关联的分类
export function relationDetail(data) {
  return request({
    url: '/platform-common/platform/common/variant/relation/detail',
    method: 'post',
    data
  })
}

// 在线产品移动分类
export function moveCategoryApi(params) {
  return usePost('/platform-ozon/platform/ozon/product/move/category', params)
}

// 根据资料库ID查询关联的分类详情数据
export function dataBaseDetail(data) {
  return request({
    url: '/platform/ozon/product/reference/data/bank',
    method: 'post',
    data
  })
}