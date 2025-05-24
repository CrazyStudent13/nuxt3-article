import request from '@/utils/request'

// 登录
export function login(data: any) {
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

// 注册
export function register(data: any) {
  return request({
    url: '/register',
    method: 'post',
    params: data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    // headers: {
    //   isToken: false
    // },
    // timeout: 20000,
    method: 'get'
  })
}
