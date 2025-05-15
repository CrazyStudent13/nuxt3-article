//  封装axios请求,参考链接如下
import type { UseFetchOptions } from 'nuxt/app'

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

/**
 * 参数处理
 * @param {*} params  参数
 */
function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

const httpRequest = async ({ url, params, method = 'get', options }: options) => {
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

export default httpRequest
