import { ElMessage } from 'element-plus'

type Methods = 'get' | 'post' | 'delete' | 'put'

export interface IResultData<T> {
  code: number
  data: T
  msg: string
}

interface Options {
  url: string
  params?: any
  method?: Methods
}

// const config = useRuntimeConfig()

// console.log(config.public.apiBase, '》》》》》')

const BASE_URL = 'http://111.229.29.214:8080'

/**
 * 参数处理
 * @param {*} params 参数
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

// 封装请求方法
const service = async ({ url, params, method = 'get' }: Options): Promise<IResultData<any>> => {
  let requestUrl = `${BASE_URL}${url}`

  // 处理 GET / DELETE 参数拼接
  if ((method === 'get' || method === 'delete') && params && Object.keys(params).length > 0) {
    const queryString = tansParams(params)
    requestUrl += `?${queryString}`
  }

  // 设置请求体
  const body = method === 'post' || method === 'put' ? params : undefined

  try {
    const response = await $fetch.raw(requestUrl, {
      method,
      body
      // headers 可根据需要添加
      // headers: {
      //   Authorization: `Bearer ${useCookie('token').value}`
      // }
    })

    // 响应拦截
    if (response.status >= 400) {
      ElMessage.warning('请求失败')
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = response._data as IResultData<any>

    if (data.code !== 200) {
      ElMessage.warning(data.msg)
    }

    return data
  } catch (error: any) {
    console.warn('请求错误:', error)
    ElMessage.warning('网络异常，请重试')
    throw error
  }
}

export default service
