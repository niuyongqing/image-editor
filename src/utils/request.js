import {message} from "ant-design-vue";
import axios from 'axios'
import {useUserStore} from "~/stores/user.js";
import { AxiosLoading } from './loading.js'
import { STORAGE_AUTHORIZE_KEY, useAuthorization } from '~/composables/authorization'
import { ContentTypeEnum, RequestEnum } from '~#/http-enum'
import router from '~/router'
import {useMultiTab} from "~/stores/multi-tab.js";
import {useLayoutMenu} from "~/stores/layout-menu.js";
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API ?? '/',
  timeout: 6e4,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
})
const axiosLoading = new AxiosLoading()
async function requestHandler(config) {
  if (import.meta.env.DEV && import.meta.env.VITE_APP_BASE_API_DEV && import.meta.env.VITE_APP_BASE_URL_DEV && config.customDev)
    config.baseURL = import.meta.env.VITE_APP_BASE_API_DEV

  const token = useAuthorization()
  if (token.value && config.token !== false)
    config.headers.set(STORAGE_AUTHORIZE_KEY, token.value)
  const { locale } = useI18nLocale()
  config.headers.set('Accept-Language', locale.value ?? 'zh-CN')
  if (config.loading)
    axiosLoading.addLoading()
  return config
}
function responseHandler(response) {
  const notification = useNotification()
  if(response.data.code !== 200){
    notification?.error({
      message: '401',
      description: response.data.msg,
      duration: 3,
    })
    if(response.data.code === 401){
       out()
    }
    return Promise.reject('error')
    // return new Promise(resolve => setTimeout(resolve, 200))
  }
  return response.data
}

async function out(){
  const hide = message.loading('退出登录...', 0)
  try {
    await useUserStore().logout()
  }
  finally {
    hide()
    message.success('退出登录成功', 3)
    router.push({
      path: '/login',
    }).then(() => {
      useMultiTab().clear()
      useLayoutMenu().clear()
    })
  }
}

function errorHandler(error) {
  const token = useAuthorization()
  const notification = useNotification()
  if (error.response) {
    const { data, status, statusText } = error.response
    if (status === 401) {
      notification?.error({
        message: '401',
        description: data?.msg || statusText,
        duration: 3,
      })
      token.value = null
      out()
    }
    else if (status === 403) {
      notification?.error({
        message: '403',
        description: data?.msg || statusText,
        duration: 3,
      })
    }
    else if (status === 500 || status === 401) {
      notification?.error({
        message: status,
        description: data?.msg || statusText,
        duration: 3,
      })
    }
    else {
      notification?.error({
        message: '服务错误',
        description: data?.msg || statusText,
        duration: 3,
      })
    }
  }
  return Promise.reject(error)
}
instance.interceptors.request.use(requestHandler)
instance.interceptors.response.use(responseHandler, errorHandler)
export default instance
function instancePromise(options) {
  const { loading } = options
  return new Promise((resolve, reject) => {
    instance.request(options).then((res) => {
      resolve(res)
    }).catch((e) => {
      reject(e)
    }).finally(() => {
      if (loading)
        axiosLoading.closeLoading()
    })
  })
}
export function useGet(url, params, config) {
  const options = {
    url,
    params,
    method: RequestEnum.GET,
    ...config,
  }
  return instancePromise(options)
}
export function usePost(url, data, config) {
  const options = {
    url,
    data,
    method: RequestEnum.POST,
    ...config,
  }
  return instancePromise(options)
}
export function usePut(url, data, config) {
  const options = {
    url,
    data,
    method: RequestEnum.PUT,
    ...config,
  }
  return instancePromise(options)
}
export function useDelete(url, data, config) {
  const options = {
    url,
    data,
    method: RequestEnum.DELETE,
    ...config,
  }
  return instancePromise(options)
}
