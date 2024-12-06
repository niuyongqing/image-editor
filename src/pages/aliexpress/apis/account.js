// 店铺账号
export function accountCache(isChoice) {
  return useGet(`/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/cache${isChoice ? '?isChoice=true' : ''}`)
}

