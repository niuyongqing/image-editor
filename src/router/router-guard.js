import { AxiosError } from 'axios'
import router from '~/router'
import { useMetaTitle } from '~/composables/meta-title'
import { setRouteEmitter } from '~@/utils/route-listener'

const allowList = ['/platform/login', '/platform/error', '/platform/401', '/platform/404', '/platform/403']
const loginPath = '/platform/login'

router.beforeEach(async (to, _, next) => {
  setRouteEmitter(to)
  const userStore = useUserStore()
  const token = useAuthorization()
  if (!token.value || token.value === 'null') {
    if (!allowList.includes(to.path) && !to.path.startsWith('/platform/redirect')) {
      next({
        path: loginPath,
        query: {
          redirect: encodeURIComponent(to.fullPath)
        }
      })
      return
    }
  } else {
    if (!userStore.userInfo && !allowList.includes(to.path) && !to.path.startsWith('/platform/redirect')) {
      try {
        await userStore.getUserInfo()
        if (userStore.userInfo === undefined) {
          next({
            path: loginPath,
            query: {
              redirect: encodeURIComponent(to.fullPath)
            }
          })
          return
        }
        const currentRoute = await userStore.generateDynamicRoutes()
        router.addRoute(currentRoute)
        next({
          ...to,
          replace: true
        })
        return
      } catch (err) {
        // if (e instanceof AxiosError && e?.response?.status === 500) {
        if (err?.code === 500) {
          next({
            path: '/platform/401'
          })
          return
        }
      }
    }
  }
  next()
})

router.afterEach(to => {
  useMetaTitle(to)
  useLoadingCheck()
  useScrollToTop()
})
