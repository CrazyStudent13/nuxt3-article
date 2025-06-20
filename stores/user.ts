// store/user.ts
import { ElMessage } from 'element-plus'

import { login, logout, getInfo, register } from '@/api/login'
import { setToken, getToken } from '@/utils/auth'

interface userInfo {
  username: string
  password: string
  rememberMe: boolean
  code: string
  uuid: string
}

const useUserStore = defineStore('user', {
  state: (): any => ({
    token: getToken() || '', // token
    name: '', // 用户账号
    nickName: '', // 用户昵称
    email: '', // 邮箱
    avatar: '', // 头像
    signature: '我们暂时还没有开放签名系统，敬请期待！', // 个性签名
    registerTime: '', // 注册时间
    roles: [], // 角色身份
    permissions: [] // 权限
  }),

  actions: {
    // 登录
    Login(userInfo: userInfo) {
      return new Promise((resolve, reject) => {
        const { username, password, code, uuid } = userInfo
        const loginFormData = {
          username,
          password,
          code: `${parseInt(code)}` + '',
          uuid
        }
        login(loginFormData)
          .then((res) => {
            // 登录成功跳转
            ElMessage.success('登录成功')

            const { data } = res
            this.token = data?.token
            setToken(data?.token)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const { user, roles, permissions }: any = res as any
            // 验证返回的roles是否是一个非空数组,获取当前用户信息
            if (roles && roles.length > 0) {
              this.name = user.userName
              this.nickName = user.nickName
              this.email = user.email
              // todo：获取注册时间，时间要用dayjs格式化
              this.registerTime = user.createTime
              this.avatar = `http://111.229.29.214:8080${user.avatar}`
              console.log(this.avatar, `http://111.229.29.214:8080${user.avatar}`, 'this.avatarhahahhahahh')
              this.roles = roles
              this.permissions = permissions
            }
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 退出系统
    Logout() {
      const { state } = this
      console.log(state, '猜测是！！')
      removeToken()
      window.close()
      // return new Promise((resolve, reject) => {
      //   logout(state.token)
      //     .then(() => {
      //       removeToken()
      //       resolve()
      //     })
      //     .catch((error) => {
      //       reject(error)
      //     })
      // })
    }
  }
})

export default useUserStore
