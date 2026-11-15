// 后端统一请求封装：拼 apiBase、携带 token、解析 { code, msg, data } 信封
// 页面级数据请求仍走 useFetch（可 SSR），此处供事件触发的交互型请求（登录等）使用
// 后端约定：HTTP 状态恒为 200，业务错误体现在 body.code（401/404/500）
interface ApiEnvelope<T = any> {
  code: number
  msg: string
  data?: T
}

export const apiFetch = async <T = any>(url: string, opts: Record<string, any> = {}): Promise<ApiEnvelope<T>> => {
  const config = useRuntimeConfig()
  try {
    const body = await $fetch<ApiEnvelope<T>>(`${config.public.apiBase}${url}`, {
      ...opts,
      headers: {
        Authorization: `Bearer ${getToken() || ''}`,
        ...(opts.headers || {})
      }
    })
    if (body.code !== 200) {
      throw new Error(body.msg || '请求失败')
    }
    return body
  } catch (error: any) {
    // ofetch 的 HTTP 层错误（非 2xx）带 data.msg，统一转成带 msg 的 Error 供调用方提示
    throw new Error(error?.data?.msg || error?.message || '请求失败')
  }
}
