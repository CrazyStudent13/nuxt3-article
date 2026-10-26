<template>
  <Teleport to="body">
    <Transition name="auth-modal">
      <div v-if="isOpen" class="auth-mask" @click.self="close" @keydown.esc="close">
        <div class="auth-panel" role="dialog" aria-modal="true" :aria-label="title">
          <header class="panel-head">
            <h2 class="panel-title">{{ title }}</h2>
            <button class="close-btn" type="button" aria-label="关闭" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path
                  d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3-1.41-1.41z"
                />
              </svg>
            </button>
          </header>

          <form class="panel-body" @submit.prevent="handleSubmit">
            <input v-model="form.account" class="field" type="text" :placeholder="mode === 'login' ? '用户名/邮箱' : '请输入用户名'" />

            <div class="field-wrap">
              <input v-model="form.password" class="field" type="password" placeholder="请输入登录密码" />
              <button v-if="mode === 'login'" class="forgot" type="button" @click="showTip('请联系管理员重置密码')">忘记密码</button>
            </div>

            <input
              v-if="mode === 'register'"
              v-model="form.confirm"
              class="field"
              type="password"
              placeholder="请再次输入密码"
            />

            <p v-if="tip" class="tip" :class="{ 'tip-error': tipIsError }">{{ tip }}</p>

            <button class="submit-btn" type="submit" :disabled="submitting">
              {{ mode === 'login' ? '登录' : '注册' }}
            </button>
          </form>

          <footer class="panel-foot">
            <span class="agreement">
              {{ mode === 'login' ? '登录' : '注册' }}即表示同意
              <a href="javascript:void(0)">用户协议</a> 和 <a href="javascript:void(0)">隐私政策</a>
            </span>
            <button class="switch-btn" type="button" @click="switchMode">
              {{ mode === 'login' ? '注册' : '登录' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// 登录/注册弹窗：登录与注册共用一个弹窗，通过 mode 切换
const { isOpen, mode, close } = useAuthModal()

const title = computed(() => (mode.value === 'login' ? '登录游戏速递' : '注册游戏速递'))

const form = reactive({
  account: '',
  password: '',
  confirm: ''
})

const tip = ref('')
const tipIsError = ref(false)
const submitting = ref(false)

const showTip = (message: string, isError = false) => {
  tip.value = message
  tipIsError.value = isError
}

const switchMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  showTip('')
}

const handleSubmit = () => {
  if (!form.account.trim()) {
    showTip(mode.value === 'login' ? '请输入用户名或邮箱' : '请输入用户名', true)
    return
  }

  if (form.password.length < 6) {
    showTip('密码长度不能少于 6 位', true)
    return
  }

  if (mode.value === 'register' && form.confirm !== form.password) {
    showTip('两次输入的密码不一致', true)
    return
  }

  // TODO: 接入后端登录/注册接口（后端验证码已开启，需补充验证码流程与 token 管理）
  showTip(`${mode.value === 'login' ? '登录' : '注册'}接口待接入，敬请期待`)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(isOpen, (open) => {
  if (open) {
    form.account = ''
    form.password = ''
    form.confirm = ''
    showTip('')
    window.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="less" scoped>
.auth-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
}

.auth-panel {
  width: 100%;
  max-width: 400px;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;

  .panel-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 0;
    background-color: transparent;
    color: var(--color-text-3);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-text-1);
    }
  }
}

.panel-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 24px 24px;

  .field-wrap {
    position: relative;
  }

  .field {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    font-size: 14px;
    color: var(--color-text-1);
    outline: none;
    transition: border-color 0.2s ease;

    &::placeholder {
      color: var(--color-text-3);
    }

    &:focus {
      border-color: var(--color-primary);
      background-color: var(--color-surface);
    }
  }

  .forgot {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background-color: transparent;
    font-size: 12px;
    color: var(--color-text-3);
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }

  .tip {
    font-size: 13px;
    line-height: 20px;
    color: var(--color-primary);

    &.tip-error {
      color: #d1242f;
    }
  }

  .submit-btn {
    padding: 11px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      background-color: var(--color-primary-hover);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.panel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 20px;

  .agreement {
    font-size: 12px;
    color: var(--color-text-3);

    a {
      color: var(--color-primary);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .switch-btn {
    border: 0;
    background-color: transparent;
    font-size: 13px;
    color: var(--color-text-2);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }
}

// 过渡动画
.auth-modal-enter-active,
.auth-modal-leave-active {
  transition: opacity 0.2s ease;

  .auth-panel {
    transition: transform 0.2s ease;
  }
}

.auth-modal-enter-from,
.auth-modal-leave-to {
  opacity: 0;

  .auth-panel {
    transform: translateY(-8px);
  }
}
</style>
