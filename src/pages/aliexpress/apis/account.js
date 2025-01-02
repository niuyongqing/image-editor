// 店铺账号
export function accountCacheApi(isChoice) {
  return useGet(`/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/cache${isChoice ? '?isChoice=true' : ''}`)
}

