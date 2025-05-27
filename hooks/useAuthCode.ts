import { encrypt, decrypt } from '@/utils/jsencrypt'
import { isNumeric, isHasChinese, isLegalChars, hasWhiteSpace } from '@/utils/validate'
import { ElMessage } from 'element-plus'
import { getCodeImg } from '@/api/login'

interface loginForm {
  username: string
  password: string
  code: string
  rememberMe?: Boolean
}

// -------------------------------- 验证码相关信息 -----------------------------
const authCodeInfo = reactive({
  captchaEnabled: true, // 验证码开关
  loading: false, // 是否加载中
  imgUrl: '', // 验证码图片地址
  uuid: '' // 验证码唯一标识
})

/**
 * 获取图片验证码
 * @param form 表单数据
 * @param isClick 是否点击触发
 */
const getValidateCode = async (form: loginForm, isClick: Boolean) => {
  const { username, password } = form
  try {
    if ((username === '' || typeof username === 'undefined') && isClick) {
      ElMessage.warning('请先输入用户账号')
      return
    }

    if ((password === '' || typeof password === 'undefined') && isClick) {
      ElMessage.warning('请先输入用户密码')
      return
    }

    if (authCodeInfo.loading) {
      ElMessage.warning('正在请求验证码，请稍等')
    } else {
      const { data } = await getCodeImg()

      const result = data

      authCodeInfo.loading = true
      authCodeInfo.captchaEnabled = typeof result.captchaEnabled === 'undefined' ? true : result.captchaEnabled
      authCodeInfo.uuid = result.uuid
      if (authCodeInfo.captchaEnabled) {
        authCodeInfo.imgUrl = result.img
        authCodeInfo.loading = false
      }
    }
  } catch (err) {
    console.log('验证码获取错误:', err)
  }
}

// -------------------------------- 登录表单规则 -----------------------------
const authLoginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
    // { min: 4, max: 4, message: '长度为 4 个字符', trigger: 'blur' }
  ]
}

// 校验用户名
const authLoginAccount = (username: string) => {
  // 用户名不能为空
  if (isEmpty(username)) {
    ElMessage.warning('用户名不能为空')
    return false
  }

  // 不能输入空格
  if (hasWhiteSpace(username)) {
    ElMessage.warning('用户名不包含空格')
    return false
  }

  // 不能输入中文和特殊字符, 只允许输入英文和数字
  if (!isLegalChars(username)) {
    ElMessage.warning('用户名不能输入中文或特殊字符')
    return false
  } else {
    return true
  }
}

// 校验密码
const authLoginPassword = (password: string) => {
  // 密码不能为空
  if (isEmpty(password)) {
    ElMessage.warning('密码不能为空')
    return false
  }

  // 不能输入中文
  if (isHasChinese(password)) {
    ElMessage.warning('密码不能包含中文')
    return false
  }

  // 不能输入空格
  if (hasWhiteSpace(password)) {
    ElMessage.warning('密码不能包含空格')
    return false
  }

  return true
}

// 校验验证码
const authLoginCode = (code: string) => {
  // 校验码不能为空
  if (isEmpty(code)) {
    ElMessage.warning('校验码不能为空')
    return false
  }

  // 检查是否有空格
  if (isString(code) && hasWhiteSpace(code)) {
    ElMessage.warning('验证码不能包含空格')
    return false
  }

  // 检查是否全是数字
  if (!isNumeric(code)) {
    ElMessage.warning('验证码必须为数字')
    return false
  }

  return true
}

// 校验登录表单 综合用户名，密码，验证码校验。如有必要，后续会添加其他辅助校验信息
const authLoginForm = (form: loginForm) => {
  const accountState = authLoginAccount(form.username)
  const passwordState = authLoginPassword(form.password)
  const codeState = authCodeInfo.captchaEnabled ? authLoginCode(form.code) : true

  return accountState && passwordState && codeState
}

// -------------------------------- 记住密码 -----------------------------
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
const setUserCookie = async (form: loginForm) => {
  const { username, password, rememberMe } = form

  const loginForm = useCookie('loginForm', {
    default: () => ({
      username,
      password: encrypt(password),
      rememberMe: rememberMe
    }),
    watch: false
  })

  if (rememberMe) {
    loginForm.value = {
      username,
      password: encrypt(password),
      rememberMe: rememberMe
    }
  }
}

export default { getValidateCode, getUserCookie, setUserCookie, authCodeInfo, authLoginRules, authLoginForm }
