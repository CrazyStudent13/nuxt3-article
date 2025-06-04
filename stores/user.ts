// store/user.ts
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

import { login, logout, getInfo, register } from '@/api/login'
import { setToken } from '@/utils/auth'

interface userInfo {
  username: string
  password: string
  rememberMe: boolean
  code: string
  uuid: string
}

const useUserStore = defineStore('user', {
  state: (): any => ({
    name: '', // 用户账号
    nickName: '', // 用户昵称
    email: '', // 邮箱
    avatar: '', // 头像
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
              this.registerTime = user.createTime
              this.avatar = user.avatar
              this.roles = roles
              this.permissions = permissions
            }
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
