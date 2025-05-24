//  封装axios请求,参考链接如下,后续改为$fetch封装
// https://juejin.cn/post/7173507227104313352
// https://juejin.cn/post/7173507227104313352

import type { UseFetchOptions } from 'nuxt/app'
import { walk } from '@/utils/tools'

type Methods = 'get' | 'post' | 'delete' | 'put'

export interface IResultData<T> {
  code: number
  data: T
  msg: string
}

// 请求参数
interface options {
  url: string
  params?: any
  method?: Methods
  options?: UseFetchOptions<any>
  key?: string
}

const BASE_URL = 'http://111.229.29.214:8080'
// const BASE_URL = 'http://43.156.233.9:8080'

/**
 * 参数处理
 * @param {*} params  参数
 */
function tansParams(params: any): string {
  const result: string[] = []

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      walk(params[key], [key], result)
    }
  }

  return result.join('&')
}

const service = async ({ url, params, method = 'get', options }: options) => {
  // 如果是get请求，则将参数拼接到url上
  let baseUrl = `${BASE_URL}${url}`
  if (method === 'get' || method === 'delete') {
    if (params && Object.keys(params).length) {
      baseUrl += `?${tansParams(params)}`
    }
  }

  const { data } = await useFetch(baseUrl, {
    // method此处仅仅只处理了get与post请求
    method,
    // ofetch库会自动识别请求地址，对于url已包含域名的请求不会再拼接baseURL
    baseURL: BASE_URL,
    // onRequest相当于请求拦截
    onRequest({ request, options }) {
      // 示例：添加 token 到 header
      // options.headers = { ...options.headers, authorization: 'Bearer token' }
      // options.headers = { ...options.headers, authorization: 'Bearer ' + useCookie('token').value }
      if (method === 'get' || method === 'delete') {
        options.params = params
      }
      if (method === 'post' || method === 'put') {
        options.body = params
      }
    },
    // onResponse相当于响应拦截
    onResponse({ response }) {
      // 处理响应数据
      // console.log(response)
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

export default service
