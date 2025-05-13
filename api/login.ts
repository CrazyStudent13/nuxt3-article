import request from '@/utils/request'

// 登录
export function login(data: any) {
  return request.post({
    url: '/login',
    data
  })
}

// 注册
export function register(data: any) {
  return request.post({
    url: '/register',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request.get({
    url: '/getInfo'
  })
}

// 退出
export function logout() {
  return request.post({
    url: '/logout'
  })
}

// 获取验证码
export function getCodeImg() {
  return request.get({
    url: '/captchaImage'
  })
}
