<template>
  <div class="login-bg">
    <div v-for="n in 5" :key="n" />
  </div>
  <ClientOnly>
    <div class="login">
      <el-form ref="loginRef" :model="loginForm.model" :rules="loginForm.rules" class="login-form">
        <h3 class="title">用户登录</h3>
        <el-form-item prop="username">
          <el-input v-model.trim="loginForm.model.username" maxlength="10" type="text" size="large" auto-complete="off" placeholder="账号">
            <template #prefix>
              <User class="input-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.model.password" maxlength="20" type="password" size="large" auto-complete="off" placeholder="密码" @keyup.enter="handleLogin">
            <template #prefix>
              <Lock class="input-icon" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code" v-show="authCodeInfo.captchaEnabled">
          <el-input v-model.trim="loginForm.model.code" maxlength="3" size="large" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleLogin">
            <template #prefix>
              <Key class="input-icon" />
            </template>
          </el-input>

          <div class="login-code" v-html="authCodeInfo.imgUrl" @click="useAuthCode.getValidateCode(loginForm.model, true)" />
        </el-form-item>

        <div v-if="false" class="login-tips">
          <el-checkbox v-model="loginForm.model.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
          <el-link class="login-tips-link" type="primary" href="/register" target="_blank">去注册账号</el-link>
        </div>

        <el-form-item style="width: 100%; margin: 32px 0">
          <el-button :loading="authCodeInfo.loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
            <span v-if="!authCodeInfo.loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </ClientOnly>
</template>

<script setup>
import useUserStore from '@/store/user'
import useAuthCode from '@/hooks/useAuthCode'

const userStore = useUserStore()
const authCodeInfo = useAuthCode.authCodeInfo
const loginRef = ref()

const loginForm = reactive({
  model: {
    username: '',
    password: '',
    rememberMe: false,
    code: '',
    uuid: ''
  },
  rules: {
    username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
    code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
  }
})

const handleLogin = () => {
  loginRef.value.validate(async (valid) => {
    if (valid) {
      authCodeInfo.loading = true
      loginForm.model.uuid = authCodeInfo.uuid
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码，否则移除
      useAuthCode.setUserCookie(loginForm.model)

      try {
        // 调用action的登录方法
        await userStore.Login(loginForm.model)
        useRouter().push({ path: '/' })
      } catch (error) {
        // 重新获取验证码
        if (authCodeInfo.captchaEnabled) {
          useAuthCode.getValidateCode(loginForm.model, true)
        }
      } finally {
        authCodeInfo.loading = false
      }
    }
  })
}

useAuthCode.getValidateCode(loginForm.model, false)
// loginForm.model = useAuthCode.getUserCookie(loginForm.model)
</script>

<style lang="less" scoped>
@import '@/assets/style/login.less';

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 20%;
  background: #f0f2f5;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 10px;
  }
}

.login-code {
  width: 35%;
  height: 48px;
  float: right;
  text-align: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #909399;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-tips {
  &-link {
    position: relative;
    top: 3px;
    right: 10px;
    font-size: 13px;
    float: right;
  }
}
</style>
