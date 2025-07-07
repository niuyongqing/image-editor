/** 翻译相关 */
// 阿里专业翻译 (ERP通用)-单条翻译
export function translationApi(params) {
    return usePost('/xinzhan-ai/alimt/translate', params)
}

// 阿里专业翻译 (ERP通用)-批量翻译
export function batchTranslationApi(params) {
    return usePost('/xinzhan-ai/alimt/json/translate', params)
}

// 单图⽚翻译
export function imageTranslationApi(params) {
    return usePost('/xinzhan-ai/alimt/image/translate', params)
}

// 多图⽚翻译（不能超过20张）
export function imageRecognitionApi(params) {
    return usePost('/xinzhan-ai/alimt/batch/image/translate', params)
}

// 多图⽚翻译查询结果（轮询）
export function imageRecognitionQueryApi(taskId) {
    return useGet(`/xinzhan-ai/alimt/get/batch/image/result?taskId=${taskId}`)
}
