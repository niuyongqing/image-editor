
//  获取模板列表
export function templateList(params) {
    return usePost('/platform-ozon/platform/ozon/template/list', params)
}

// 新建/编辑模板
export function templateSaveOrUpdate(params) {
    return usePost('/platform-ozon/platform/ozon/template/saveOrUpdate', params)
}

// 模板详情
export function templateDetail(params) {
    return useGet('/platform-ozon/platform/ozon/template/detail', params)
}
