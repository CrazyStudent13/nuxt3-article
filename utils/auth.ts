const Cookies = useCookie('token') // 获取 Cookie

// 设置 Cookie
export function setToken(token?: string) {
  console.log(token, '设置token')
  Cookies.value = token || ''
}

// 获取 Cookie
export function getToken() {
  console.log(Cookies.value, '获取token')
  return Cookies.value
}

// 删除 Cookie
export function removeToken() {
  Cookies.value = ''
  console.log(Cookies.value, '删除token')
}
