// 用户登录态：token 存 cookie，用户信息存全局 state（刷新页面后靠 getInfo 恢复）
export interface AuthUser {
  userId: number
  userName: string
  nickName: string
  email: string
  avatar: string
  createTime?: string
}

export interface CaptchaInfo {
  captchaEnabled: boolean
  img: string
  uuid: string
}

export const useUser = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  // 登录：成功后写入 token 并拉取用户信息
  // username 字段按后端 LoginDto 命名，值传邮箱（后端暂按 userName 查询，邮箱直登待后端放开）
  const login = async (payload: { username: string; password: string; code?: string; uuid?: string }) => {
    const res = await apiFetch<{ token: string }>('/api/login', { method: 'POST', body: payload })
    setToken(res.data?.token)
    await fetchUserInfo()
    return res
  }

  // 注册：成功后无 data，由调用方引导用户登录；后端 nickName 默认取账号本身
  const register = async (payload: { username: string; password: string }) => {
    return await apiFetch('/api/register', { method: 'POST', body: payload })
  }

  // 当前登录用户信息（token 失效时清空登录态）
  const fetchUserInfo = async () => {
    try {
      const res = await apiFetch('/api/getInfo')
      // getInfo 的 user 在顶层而非 data 里；响应带密码散列，只保留展示需要的字段
      const raw: any = (res as any).user
      user.value = raw
        ? {
            userId: raw.userId,
            userName: raw.userName,
            nickName: raw.nickName,
            email: raw.email,
            avatar: raw.avatar,
            createTime: raw.createTime
          }
        : null
    } catch (error) {
      clearToken()
      user.value = null
      throw error
    }
  }

  // 验证码：账号连续登录失败达到阈值（3 次）时后端才返回 captchaEnabled: true + 图片
  const fetchCaptcha = async (username: string): Promise<CaptchaInfo> => {
    try {
      const res = await apiFetch<CaptchaInfo>('/api/captchaImage', { query: { username } })
      return res.data ?? { captchaEnabled: false, img: '', uuid: '' }
    } catch {
      // 验证码接口异常时按无验证码处理，由登录接口的报错兜底
      return { captchaEnabled: false, img: '', uuid: '' }
    }
  }

  // 退出：无论接口结果如何都清空本地登录态
  const logout = async () => {
    try {
      await apiFetch('/api/logout', { method: 'POST' })
    } catch {
      // 接口失败不阻塞本地退出
    }
    clearToken()
    user.value = null
  }

  return { user, isLoggedIn, login, register, fetchUserInfo, fetchCaptcha, logout }
}
