//  封装axios请求,参考链接如下
// https://juejin.cn/post/7477875236145102874?searchId=20250512203958AFB70B141BF1B5498369

import type { UseFetchOptions } from 'nuxt/app'

type Methods = 'GET' | 'POST' | 'DELETE' | 'PUT'

interface CacheItem {
  data: any
  timestamp: number
}

const BASE_URL = 'http://111.229.29.214:8080'

export interface IResultData<T> {
  code: number
  data: T
  msg: string
}

interface Params {
  url: string
  params?: any
  method?: Methods
  key?: string
}

const httpRequest = async ({ url, params, method = 'GET' }: Params) => {
  // 接口传参要求
  interface QueryItem {
    uid?: string
    token?: any
  }
  const route = useRoute()
  const query: QueryItem = route.query

  const config = useRuntimeConfig()

  // 拼接str，但是方法有点烂，后续还得重写
  let str = ''
  if (method === 'GET') {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        str += `${key}=${params[key]}&`
      }
    }
  }

  const { data } = await useFetch(url, {
    // method此处仅仅只处理了get与post请求
    method,
    // ofetch库会自动识别请求地址，对于url已包含域名的请求不会再拼接baseURL
    baseURL: BASE_URL,
    // onRequest相当于请求拦截
    onRequest({ request, options }) {
      // 设置请求头
      // options.headers = { ...options.headers, authorization: '' }
      // 设置请求参数
      if (method === 'POST') {
        options.body = { ...params.data }
      } else {
        options.params = {}
      }
    },
    // onResponse相当于响应拦截
    onResponse({ response }) {
      // 处理响应数据
      console.log(response)
    },
    onRequestError({ request, options, error }) {
      // 处理请求错误
      console.warn('request error', error)
      ElMessage.warning('Request Error')
    },
    onResponseError({ request, response, options }) {
      // 处理响应错误
      console.warn('request error', response)
      ElMessage.warning('Request Error')
    }
  })

  // 这里data本身是个ref对象，将其内部值抛出去方便调用时获得数据。
  const result = unref(data) as IResultData<any>
  return result
}

export default httpRequest
