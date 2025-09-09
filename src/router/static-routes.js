const Layout = () => import('~/layouts/index.vue')
export default [
  {
    path: '/platform/login',
    component: () => import('~/pages/common/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/platform/401',
    name: 'Error401',
    component: () => import('~/pages/exception/401.vue'),
    meta: {
      title: '授权已过期',
    },
  },
  {
    path: '/platform/common',
    name: 'LayoutBasicRedirect',
    component: Layout,
    redirect: '/platform/common/redirect',
    children: [
      {
        path: '/platform/common/redirect',
        component: () => import('~/pages/common/route-view.vue'),
        name: 'CommonRedirect',
        redirect: '/platform/redirect',
        children: [
          {
            path: '/platform/redirect/:path(.*)',
            name: 'RedirectPath',
            component: () => import('~/pages/common/redirect.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    meta: {
      title: '找不到页面',
    },
    component: () => import('~/pages/exception/error.vue'),
  },
]
