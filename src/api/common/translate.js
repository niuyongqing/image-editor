/** 翻译相关 */
// yandex翻译API
export function yandexTranslateApi(params) {
  return usePost('/xinzhan-ai/alimt/yandex/translate', params)
}
