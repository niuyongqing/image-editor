export function getCroppingListApi() {
    return useGet('/platform-setting/platform/setting/template/ps/cropping/list')
}


export function addCroppingApi(data) {
    return usePost('/platform-setting/platform/setting/template/ps/cropping/add',data)
}


export function delCroppingApi(data) {
    return usePost('/platform-setting/platform/setting/template/ps/cropping/del',data)
}


export function editEliminateApi(data) {
    return usePost('/xinzhan-ai/ai/image/eliminate',data)
}