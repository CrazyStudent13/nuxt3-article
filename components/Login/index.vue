<!-- 通用的登录弹窗组件 -->
<template>
  <el-dialog v-model="loginForm.visible" :title="loginForm.title" width="360" :show-close="false">
    <el-form ref="loginRef" :model="loginForm.model" :rules="loginForm.rules" class="login-form">
      <el-form-item prop="username">
        <el-input v-model.trim="loginForm.model.username" maxlength="10" type="text" size="large" auto-complete="off" placeholder="账号">
          <template #prefix>
            <User class="input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.model.password" maxlength="20" type="password" size="large" auto-complete="off" placeholder="密码" @keyup.enter="loginForm.handleLogin">
          <template #prefix>
            <Lock class="input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item style="width: 100%; margin-top: 16px">
        <el-button :loading="authCodeInfo.loading" size="large" type="primary" style="width: 100%" @click.prevent="loginForm.handleLogin">
          <span v-if="!authCodeInfo.loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
const authCodeInfo = reactive({
  loading: false
})

// 引入pina 实例,不要在setup中使用，而是等实例化之后再用
import useUserStore from '@/store/user'
const userStore = useUserStore()

onMounted(() => {
  console.log(userStore.name, '测试>>>>>')
})

const loginForm = reactive({
  visible: true,
  title: '用户登录',
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  },
  model: {
    username: '',
    password: '',
    rememberMe: false
  },
  handleLogin: () => {
    console.log('handleLogin')
  },
  handleClose: () => {
    console.log('handleClose')
  }
})
</script>

<style lang="less" scoped>
.login-form {
  background: #ffffff;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 16px;
  }
}
</style>
