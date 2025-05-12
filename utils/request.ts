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

class HttpRequest {
  // 最大缓存条数
  private readonly MAX_CACHE_SIZE = 50
  // 缓存过期时间 5分钟
  private readonly CACHE_EXPIRE_TIME = 5 * 60 * 1000

  private getCache() {
    return useState('http-cache', () => new Map<string, CacheItem>())
  }

  request<T = any>(url: string, method: Methods, data: any, options?: UseFetchOptions<T>) {
    const { $i18n } = useNuxtApp()
    return new Promise((resolve, reject) => {
      // 生成缓存键
      const cacheKey = method === 'GET' ? `${url}-${JSON.stringify(data)}` : ''
      const cache = this.getCache()

      // 如果是 GET 请求且存在缓存，检查是否过期
      if (method === 'GET' && cache.value.has(cacheKey)) {
        const cachedItem = cache.value.get(cacheKey)!
        if (Date.now() - cachedItem.timestamp < this.CACHE_EXPIRE_TIME) {
          return resolve({ data: ref(cachedItem.data) })
        }
        // 如果缓存过期，直接删除
        cache.value.delete(cacheKey)
      }

      const newOptions: UseFetchOptions<T> = {
        baseURL: BASE_URL,
        method: method,
        headers: {
          'tenant-id': '164'
          //   'Accept-Language': $i18n.locale || 'zh'
        },
        ...options
      }

      if (method === 'GET' || method === 'DELETE') {
        newOptions.params = data
      }
      if (method === 'POST' || method === 'PUT') {
        newOptions.body = data
      }

      useFetch(url, newOptions)
        .then((res) => {
          // 如果是 GET 请求，缓存结果
          if (method === 'GET' && res.data.value) {
            // 如果缓存达到上限，删除最旧的一条数据
            if (cache.value.size >= this.MAX_CACHE_SIZE) {
              const oldestKey = Array.from(cache.value.keys())[0]
              cache.value.delete(oldestKey)
            }

            // 直接设置新的缓存数据
            cache.value.set(cacheKey, {
              data: res.data.value,
              timestamp: Date.now()
            })
          }
          console.log('res', res)
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 封装常用方法

  get<T = any>(url: string, params?: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'GET', params, options)
  }

  post<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'POST', data, options)
  }

  Put<T = any>(url: string, data: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'PUT', data, options)
  }

  Delete<T = any>(url: string, params: any, options?: UseFetchOptions<T>) {
    return this.request(url, 'DELETE', params, options)
  }

  // 清除缓存的方法
  clearCache() {
    const cache = this.getCache()
    cache.value.clear()
  }
}

const httpRequest = new HttpRequest()

export default httpRequest
