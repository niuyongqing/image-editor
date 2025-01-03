export const ROOT_ROUTE_REDIRECT_PATH = '/platform/dashboard'
const Layout = () => import('~/layouts/index.vue')
export const rootRoute = {
  path: '/platform/',
  name: 'rootPath',
  redirect: ROOT_ROUTE_REDIRECT_PATH,
  component: Layout,
  children: [],
}
