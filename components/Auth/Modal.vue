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
            <div class="field-group">
              <input
                v-model="form.email"
                class="field"
                :class="fieldClass('email')"
                type="email"
                placeholder="请输入邮箱"
                @blur="touchField('email')"
              />
              <p v-if="fieldError('email')" class="field-tip">{{ errors.email }}</p>
            </div>

            <div class="field-group">
              <div class="field-wrap">
                <input
                  v-model="form.password"
                  class="field"
                  :class="fieldClass('password')"
                  type="password"
                  placeholder="请输入登录密码"
                  @blur="touchField('password')"
                />
                <button v-if="mode === 'login'" class="forgot" type="button" @click="showTip('请联系管理员重置密码')">
                  忘记密码
                </button>
              </div>

              <div v-if="mode === 'register' && form.password" class="strength">
                <div class="strength-bars">
                  <span v-for="n in 3" :key="n" class="strength-bar" :class="strengthBarClass(n)" />
                </div>
                <span class="strength-label" :class="`strength-${strength}`">{{ strengthLabel }}</span>
              </div>

              <p v-if="fieldError('password')" class="field-tip">{{ errors.password }}</p>
            </div>

            <div v-if="mode === 'register'" class="field-group">
              <input
                v-model="form.confirm"
                class="field"
                :class="fieldClass('confirm')"
                type="password"
                placeholder="请再次输入密码"
                @blur="touchField('confirm')"
              />
              <p v-if="fieldError('confirm')" class="field-tip">{{ errors.confirm }}</p>
            </div>

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

type FormField = 'email' | 'password' | 'confirm'

const form = reactive({
  email: '',
  password: '',
  confirm: ''
})

const touched = reactive<Record<FormField, boolean>>({
  email: false,
  password: false,
  confirm: false
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed<Record<FormField, string>>(() => ({
  email: !form.email.trim()
    ? '请输入邮箱'
    : EMAIL_RE.test(form.email.trim())
      ? ''
      : '邮箱格式不正确',
  password: !form.password
    ? '请输入密码'
    : form.password.length < 6
      ? '密码长度不能少于 6 位'
      : '',
  confirm:
    mode.value !== 'register'
      ? ''
      : !form.confirm
        ? '请再次输入密码'
        : form.confirm !== form.password
          ? '两次输入的密码不一致'
          : ''
}))

// 实时校验：字段失焦后开始显示错误，输入过程中错误随修正即时消失
const touchField = (field: FormField) => {
  touched[field] = true
}

const fieldError = (field: FormField) => (touched[field] ? errors.value[field] : '')
const fieldValid = (field: FormField) => touched[field] && !errors.value[field] && !!form[field]
const fieldClass = (field: FormField) => ({
  'field-error': !!fieldError(field),
  'field-valid': fieldValid(field)
})

// 密码强度：长度 + 字符种类，1 弱 / 2 中 / 3 强
const strength = computed(() => {
  const pwd = form.password
  if (!pwd) {
    return 0
  }

  let score = 0
  if (pwd.length >= 6) {
    score++
  }
  if (pwd.length >= 10) {
    score++
  }
  if (/[a-zA-Z]/.test(pwd) && /\d/.test(pwd)) {
    score++
  }
  if (/[^a-zA-Z0-9]/.test(pwd)) {
    score++
  }
  return Math.min(score, 3)
})

const strengthLabel = computed(() => ['太短了', '弱', '中', '强'][strength.value] ?? '')
const strengthBarClass = (n: number) => ({ on: strength.value >= n, [`lv-${strength.value}`]: strength.value >= n })

const tip = ref('')
const tipIsError = ref(false)
const submitting = ref(false)

const showTip = (message: string, isError = false) => {
  tip.value = message
  tipIsError.value = isError
}

const resetForm = () => {
  form.email = ''
  form.password = ''
  form.confirm = ''
  touched.email = false
  touched.password = false
  touched.confirm = false
  showTip('')
}

const switchMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  resetForm()
}

const handleSubmit = () => {
  touched.email = true
  touched.password = true
  touched.confirm = true

  if (errors.value.email || errors.value.password || errors.value.confirm) {
    return
  }

  // TODO: 接入后端登录/注册接口（后端验证码已开启，需补充验证码流程与 token 管理）
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    showTip(`${mode.value === 'login' ? '登录' : '注册'}接口待接入，敬请期待`)
  }, 400)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(isOpen, (open) => {
  if (open) {
    resetForm()
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

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

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
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &::placeholder {
      color: var(--color-text-3);
    }

    &:focus {
      border-color: var(--color-primary);
      background-color: var(--color-surface);
    }

    // 校验通过：绿色描边
    &.field-valid,
    &.field-valid:focus {
      border-color: #1a7f37;
    }

    // 校验失败：红色描边
    &.field-error,
    &.field-error:focus {
      border-color: #d1242f;
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

  .field-tip {
    font-size: 12px;
    line-height: 18px;
    color: #d1242f;
  }

  // 密码强度指示
  .strength {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;

    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;

      .strength-bar {
        height: 4px;
        flex: 1;
        border-radius: 2px;
        background-color: var(--color-border);
        transition: background-color 0.2s ease;

        &.on.lv-1 {
          background-color: #d1242f;
        }
        &.on.lv-2 {
          background-color: #d29922;
        }
        &.on.lv-3 {
          background-color: #1a7f37;
        }
      }
    }

    .strength-label {
      font-size: 12px;
      color: var(--color-text-3);

      &.strength-1 {
        color: #d1242f;
      }
      &.strength-2 {
        color: #d29922;
      }
      &.strength-3 {
        color: #1a7f37;
      }
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
