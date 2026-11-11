// 登录 token 的 cookie 存取：SSR 与客户端都能读到
// useCookie 需在函数体内调用（模块顶层调用会有 SSR 上下文问题）
// memoryToken 是同 tick 镜像：useCookie 写入后立刻读取会拿到旧值，
// 登录成功后马上调 getInfo 的场景必须读内存兜底；页面刷新后内存为空，回退读 cookie
const TOKEN_KEY = 'token'
let memoryToken: string | null = null

export const setToken = (token?: string) => {
  memoryToken = token || null
  useCookie(TOKEN_KEY).value = token || ''
}

export const getToken = (): string | undefined => {
  if (memoryToken) {
    return memoryToken
  }
  return useCookie(TOKEN_KEY).value || undefined
}

export const clearToken = () => {
  memoryToken = null
  useCookie(TOKEN_KEY).value = null
}
