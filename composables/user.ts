import { login, logout, getInfo } from '@/api/login'
import { setToken } from '@/utils/auth'
// store/modules/user.ts

interface userInfo {
  username: string
  password: string
  rememberMe: boolean
  code: string
  uuid: string
}

const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }
  },

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
            if (res.code) {
              ElMessage.error(res.msg)
            } else {
              const { token } = res
              setToken(token)
            }
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
            console.log(res, '测试>>>')
            // const user = res.user
            // if (res.roles && res.roles.length > 0) {
            //   // 验证返回的roles是否是一个非空数组
            // }
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
    // // 退出系统
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token)
    //       .then(() => {
    //         commit('SET_TOKEN', '')
    //         commit('SET_ROLES', [])
    //         commit('SET_PERMISSIONS', [])
    //         removeToken()
    //         resolve()
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //   })
    // },
    // // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise((resolve) => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resolve()
    //   })
    // }
  }
})

export default useUserStore
