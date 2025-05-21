import { encrypt, decrypt } from '@/utils/jsencrypt'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getCodeImg } from '@/api/login'

// 验证码相关信息
const authCodeInfo = reactive({
  captchaEnabled: true, // 验证码开关
  loading: false, // 是否加载中
  imgUrl: '', // 验证码图片地址
  uuid: '' // 验证码唯一标识
})

interface loginForm {
  username: string
  password: string
  rememberMe?: Boolean
}

/**
 * 获取图片验证码
 * @param data 表单数据
 * @param isClick 是否点击触发
 */
const getValidateCode = async (form: loginForm, isClick: Boolean) => {
  try {
    if ((form.username === '' || form.username === undefined) && isClick) {
      ElMessage.error('请输入用户账号')
      return
    }

    if ((form.password === '' || form.password === undefined) && isClick) {
      ElMessage.error('请输入用户密码')
      return
    }

    if (authCodeInfo.loading) {
      ElMessage.warning('正在请求验证码，请稍等')
      return
    }

    const { data } = await getCodeImg()
    const result = data
    authCodeInfo.loading = true
    authCodeInfo.captchaEnabled = result.captchaEnabled === undefined ? true : result.captchaEnabled
    authCodeInfo.uuid = result.uuid
    if (authCodeInfo.captchaEnabled) {
      authCodeInfo.imgUrl = result.img
      authCodeInfo.loading = false
    }
  } catch (err) {
    console.log('验证码获取错误:', err)
  }
}

// 从cookie中获取登录用户信息
const getUserCookie = async (data: loginForm) => {
  const loginForm = useCookie('loginForm', {
    default: () => ({
      username: data.username,
      password: decrypt(data.password),
      rememberMe: data.rememberMe
    }),
    watch: false
  })

  return loginForm
}

// 在Cookie中的记住用户信息,勾选了需要记住密码设置在 cookie 中设置记住用户名和密码，否则移除
const setUserCookie = async (data: loginForm) => {
  const loginForm = useCookie('loginForm', {
    default: () => ({
      username: data.username,
      password: encrypt(data.password),
      rememberMe: data.rememberMe
    }),
    watch: false
  })

  if (data.rememberMe) {
    loginForm.value = {
      username: data.username,
      password: decrypt(data.password),
      rememberMe: data.rememberMe
    }
  }
}

export default { getValidateCode, getUserCookie, setUserCookie, authCodeInfo }
