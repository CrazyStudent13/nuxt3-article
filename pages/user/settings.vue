<template>
  <div class="settings-page">
    <div class="settings-card">
      <!-- 左侧：返回链接 + 菜单（与内容同一块面板） -->
      <aside class="side-column">
        <NuxtLink to="/user/space" class="back-link">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M15.54 3.46 7.8 11.2a.6.6 0 0 0 0 .85l7.74 7.74 1.13-1.13-7.31-7.31 7.3-7.31-1.12-1.13z" />
          </svg>
          返回个人主页
        </NuxtLink>
        <nav class="side-menu">
          <button
            v-for="item in menus"
            :key="item.key"
            class="menu-item"
            :class="{ active: activeMenu === item.key }"
            type="button"
            @click="activeMenu = item.key"
          >
            <span class="menu-icon" v-html="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </aside>

      <!-- 右侧内容 -->
      <section class="content-panel">
        <!-- 个人资料 -->
        <template v-if="activeMenu === 'profile'">
          <h1 class="panel-title">个人资料</h1>
          <div class="panel-body profile-layout">
            <form class="settings-form" @submit.prevent="handleSaveProfile">
              <label class="form-row">
                <span class="form-label">昵称</span>
                <input v-model="editForm.nickName" class="form-input" type="text" maxlength="30" placeholder="请输入昵称" />
              </label>
              <label class="form-row">
                <span class="form-label">邮箱</span>
                <input v-model="editForm.email" class="form-input" type="email" maxlength="50" placeholder="请输入邮箱" />
              </label>
              <label class="form-row">
                <span class="form-label">性别</span>
                <select v-model="editForm.sex" class="form-input form-select">
                  <option value="">保密</option>
                  <option value="0">男</option>
                  <option value="1">女</option>
                </select>
              </label>
              <p v-if="profileTip" class="form-tip" :class="{ 'tip-error': profileTipIsError }">{{ profileTip }}</p>
              <div class="form-actions">
                <button class="btn primary" type="submit" :disabled="saving">{{ saving ? '保存中…' : '保存' }}</button>
              </div>
            </form>

            <!-- 右侧头像（参考掘金：表单在左，头像在右） -->
            <div class="avatar-side">
              <button class="avatar-btn" type="button" :disabled="avatarUploading" :title="avatarUploading ? '上传中…' : '点击上传头像'" @click="fileInput?.click()">
                <img v-if="avatarUrl" class="avatar" :src="avatarUrl" alt="头像" />
                <span v-else class="avatar avatar-fallback">{{ avatarFallback }}</span>
              </button>
              <input ref="fileInput" class="avatar-input" type="file" accept="image/*" @change="handleAvatarChange" />
              <span class="avatar-label">{{ avatarUploading ? '上传中…' : '上传头像' }}</span>
              <span class="avatar-hint">格式：支持 JPG、PNG、JPEG</span>
              <span class="avatar-hint">大小：5M 以内</span>
            </div>
          </div>
        </template>

        <!-- 账号设置 -->
        <template v-else-if="activeMenu === 'account'">
          <h1 class="panel-title">账号设置</h1>
          <div class="panel-body">
            <div class="setting-row">
              <div class="row-info">
                <span class="row-label">密码</span>
                <span class="row-desc">建议定期更换密码，保障账号安全</span>
              </div>
              <button class="row-action" type="button" @click="pwdOpen = !pwdOpen">{{ pwdOpen ? '收起' : '重置' }}</button>
            </div>

            <form v-if="pwdOpen" class="settings-form pwd-form" @submit.prevent="handleChangePwd">
              <label class="form-row">
                <span class="form-label">旧密码</span>
                <input v-model="pwdForm.old" class="form-input" type="password" maxlength="20" placeholder="请输入旧密码" />
              </label>
              <label class="form-row">
                <span class="form-label">新密码</span>
                <input v-model="pwdForm.next" class="form-input" type="password" maxlength="20" placeholder="至少 6 位" />
              </label>
              <label class="form-row">
                <span class="form-label">确认新密码</span>
                <input v-model="pwdForm.confirm" class="form-input" type="password" maxlength="20" placeholder="再次输入新密码" />
              </label>
              <p v-if="pwdTip" class="form-tip" :class="{ 'tip-error': pwdTipIsError }">{{ pwdTip }}</p>
              <div class="form-actions">
                <button class="btn primary" type="submit" :disabled="pwdSaving">{{ pwdSaving ? '提交中…' : '确认修改' }}</button>
              </div>
            </form>

            <div class="setting-row">
              <div class="row-info">
                <span class="row-label">账号注销</span>
                <span class="row-desc">注销后账号数据将无法恢复</span>
              </div>
              <button class="row-action" type="button" disabled title="暂未开放">注销</button>
            </div>
          </div>
        </template>

        <!-- 通用设置 -->
        <template v-else>
          <h1 class="panel-title">通用设置</h1>
          <div class="panel-body">
            <h2 class="section-title">页面设置</h2>
            <p class="section-desc">该设置仅保存在当前浏览器</p>
            <div class="theme-cards">
              <button
                v-for="opt in themeOptions"
                :key="opt.value"
                class="theme-card"
                :class="{ active: mode === opt.value }"
                type="button"
                @click="setMode(opt.value as ThemeMode)"
              >
                <span class="theme-preview" :class="`preview-${opt.value}`">
                  <span class="bar bar-title" />
                  <span class="bar" />
                  <span class="bar" />
                  <span class="bar bar-short" />
                </span>
                <span class="theme-label">
                  <span class="radio-dot" />
                  {{ opt.label }}
                </span>
              </button>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const config = useRuntimeConfig()
const { user, fetchUserInfo, updateProfile, updateAvatar, updatePassword } = useUser()
const { openLogin } = useAuthModal()
const { mode, setMode } = useTheme()

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/

const menus = [
  {
    key: 'profile',
    label: '个人资料',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/></svg>'
  },
  {
    key: 'account',
    label: '账号设置',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M21 2h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-9 5H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM21 13h-6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1z"/></svg>'
  },
  {
    key: 'general',
    label: '通用设置',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19.14 12.94a7.07 7.07 0 0 0 .06-.94 7.07 7.07 0 0 0-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.72 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.42.34.61.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.25.42.5.42h3.84c.25 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.24.1.5 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>'
  }
]
const activeMenu = ref('profile')

// ---------- 页面守卫 + 数据恢复（主题初始化由 plugins/theme.client 全局负责） ----------
onMounted(async () => {
  if (!getToken()) {
    openLogin()
    return navigateTo('/')
  }
  if (!user.value) {
    try {
      await fetchUserInfo()
    } catch {
      return navigateTo('/')
    }
  }
})

// ---------- 个人资料 ----------
const avatarUrl = computed(() => toCoverUrl(config.public.apiBase, user.value?.avatar))
const avatarFallback = computed(() => (user.value?.nickName || user.value?.userName || '用户').slice(0, 1))

const editingReady = ref(false)
const saving = ref(false)
const profileTip = ref('')
const profileTipIsError = ref(false)
const editForm = reactive({ nickName: '', email: '', sex: '' })
const fileInput = ref<HTMLInputElement | null>(null)
const avatarUploading = ref(false)

const setProfileTip = (message: string, isError = false) => {
  profileTip.value = message
  profileTipIsError.value = isError
}

// 表单初值：进入页面与用户信息变化后都同步一次
// 注册约定 userName=邮箱且后端 email 列可能为空，回填时用邮箱格式的账号兜底
watch(
  user,
  (val) => {
    if (!val || editingReady.value) {
      return
    }
    editForm.nickName = val.nickName || ''
    editForm.email = val.email || (EMAIL_RE.test(val.userName || '') ? val.userName : '')
    editForm.sex = val.sex || ''
    editingReady.value = true
  },
  { immediate: true, deep: true }
)

const handleSaveProfile = async () => {
  const nickName = editForm.nickName.trim()
  const email = editForm.email.trim()
  if (!nickName) {
    return setProfileTip('请输入昵称', true)
  }
  if (!email) {
    return setProfileTip('请输入邮箱', true)
  }
  if (!EMAIL_RE.test(email)) {
    return setProfileTip('邮箱格式不正确', true)
  }
  saving.value = true
  try {
    await updateProfile({ nickName, email, sex: editForm.sex || undefined })
    setProfileTip('资料已更新')
  } catch (error: any) {
    setProfileTip(error?.message || '保存失败，请稍后重试', true)
  } finally {
    saving.value = false
  }
}

const handleAvatarChange = async (event: Event) => {
  const inputEl = event.target as HTMLInputElement
  const file = inputEl.files?.[0]
  inputEl.value = '' // 允许连续选择同一文件
  if (!file) {
    return
  }
  if (!/^image\//.test(file.type)) {
    return setProfileTip('请选择图片文件', true)
  }
  if (file.size > 5 * 1024 * 1024) {
    return showToast('图片不能超过 5MB', 'error')
  }
  // 先裁剪成方形再上传；取消裁剪则静默结束
  let cropped: File
  try {
    cropped = await cropImage(file, { title: '裁剪头像', aspectRatio: 1 })
  } catch {
    return
  }
  avatarUploading.value = true
  try {
    await updateAvatar(cropped)
    setProfileTip('头像已更新')
  } catch (error: any) {
    setProfileTip(error?.message || '头像上传失败', true)
  } finally {
    avatarUploading.value = false
  }
}

// ---------- 账号设置 ----------
const pwdOpen = ref(false)
const pwdSaving = ref(false)
const pwdTip = ref('')
const pwdTipIsError = ref(false)
const pwdForm = reactive({ old: '', next: '', confirm: '' })

const setPwdTip = (message: string, isError = false) => {
  pwdTip.value = message
  pwdTipIsError.value = isError
}

const handleChangePwd = async () => {
  if (!pwdForm.old) {
    return setPwdTip('请输入旧密码', true)
  }
  if (!pwdForm.next) {
    return setPwdTip('请输入新密码', true)
  }
  if (pwdForm.next.length < 6) {
    return setPwdTip('新密码至少 6 位', true)
  }
  if (pwdForm.next.length > 20) {
    return setPwdTip('新密码不能超过 20 位', true)
  }
  if (pwdForm.next !== pwdForm.confirm) {
    return setPwdTip('两次输入的新密码不一致', true)
  }
  pwdSaving.value = true
  try {
    await updatePassword({ oldPassword: pwdForm.old, newPassword: pwdForm.next })
    pwdForm.old = ''
    pwdForm.next = ''
    pwdForm.confirm = ''
    setPwdTip('密码已修改')
  } catch (error: any) {
    setPwdTip(error?.message || '修改失败，请稍后重试', true)
  } finally {
    pwdSaving.value = false
  }
}

// ---------- 通用设置 ----------
const themeOptions = [
  { value: 'light', label: '浅色模式' },
  { value: 'dark', label: '深色模式' },
  { value: 'system', label: '跟随系统' }
] as const

// 未使用但保留 registerTime 供后续展示扩展
const registerTime = computed(() => {
  const value = user.value?.createTime
  if (!value) {
    return ''
  }
  const formatted = dayjs(value).format('YYYY-MM-DD')
  return formatted === 'Invalid Date' ? '' : formatted
})
void registerTime
</script>

<style lang="less" scoped>
.settings-page {
  padding: 0 0 8px;
}

// 整块面板：左侧菜单 + 右侧内容，撑满可用宽度
.settings-card {
  display: flex;
  align-items: stretch;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

// 左侧：返回链接 + 菜单
.side-column {
  flex-shrink: 0;
  width: 200px;
  padding: 16px 12px;
  border-right: 1px solid var(--color-border-light);

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin: 4px 4px 14px;
    font-size: 13px;
    color: var(--color-text-2);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }
}

// 左侧菜单
.side-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 11px 16px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: transparent;
    font-size: 14px;
    color: var(--color-text-1);
    cursor: pointer;
    text-align: left;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background-color: var(--color-bg);
    }

    &.active {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 500;
    }

    .menu-icon {
      display: flex;
      align-items: center;
    }
  }
}

// 右侧内容
.content-panel {
  flex: 1;
  min-width: 0;
  padding: 24px 28px;

  .panel-title {
    margin: 0 0 20px;
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-1);
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border-light);
  }

  .panel-body {
    min-height: 320px;
  }

  .section-title {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .section-desc {
    margin: 0 0 16px;
    font-size: 12px;
    color: var(--color-text-3);
  }
}

// 个人资料：左表单 + 右头像（参考掘金设置页布局）
.profile-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;

  .settings-form {
    flex: 1;
    min-width: 0;
  }
}

// 右侧头像
.avatar-side {
  flex-shrink: 0;
  width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .avatar-btn {
    padding: 0;
    margin-bottom: 12px;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    line-height: 0;

    &:disabled {
      cursor: wait;
    }
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    object-fit: cover;
    background-color: var(--color-bg);

    &.avatar-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: var(--gradient-brand);
      color: #fff;
      font-size: 28px;
    }
  }

  .avatar-label {
    font-size: 13px;
    color: var(--color-text-2);
    margin-bottom: 6px;
  }

  .avatar-hint {
    font-size: 12px;
    line-height: 20px;
    color: var(--color-text-3);
  }
}

.avatar-input {
  display: none;
}

// 表单
.settings-form {
  .form-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .form-label {
    flex-shrink: 0;
    width: 84px;
    font-size: 13px;
    color: var(--color-text-2);
    text-align: right;
  }

  .form-input {
    flex: 1;
    max-width: 320px;
    padding: 9px 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    font-size: 13px;
    color: var(--color-text-1);
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: var(--color-primary);
      background-color: var(--color-surface);
    }
  }

  .form-select {
    max-width: 140px;
  }

  .form-tip {
    margin: 4px 0 0 96px;
    font-size: 12px;
    line-height: 18px;
    color: var(--color-primary);

    &.tip-error {
      color: #d1242f;
    }
  }

  .form-actions {
    margin: 8px 0 0 96px;
  }

  .btn.primary {
    padding: 8px 24px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.pwd-form {
    padding: 16px 0 4px;
    margin-bottom: 8px;
    border-bottom: 1px dashed var(--color-border-light);
  }
}

// 账号设置行
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }

  .row-info {
    display: flex;
    align-items: baseline;
    gap: 16px;

    .row-label {
      font-size: 14px;
      color: var(--color-text-1);
    }

    .row-desc {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }

  .row-action {
    padding: 0;
    border: 0;
    background-color: transparent;
    font-size: 13px;
    color: var(--color-primary);
    cursor: pointer;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }

    &:disabled {
      color: var(--color-text-3);
      cursor: not-allowed;
    }
  }
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column-reverse;

    .avatar-side {
      width: 100%;
    }
  }
}

// 主题卡片
.theme-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  .theme-card {
    width: 164px;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: var(--color-text-3);
    }

    &.active {
      border-color: var(--color-primary);

      .theme-label {
        color: var(--color-primary);
        background-color: var(--color-primary-light);

        .radio-dot {
          border-color: var(--color-primary);

          &::after {
            opacity: 1;
          }
        }
      }
    }

    .theme-preview {
      display: flex;
      flex-direction: column;
      gap: 6px;
      height: 96px;
      padding: 14px;
      background-color: #ffffff;

      .bar {
        height: 8px;
        border-radius: 4px;
        background-color: #e5e6eb;

        &.bar-title {
          width: 45%;
          height: 10px;
        }

        &.bar-short {
          width: 60%;
        }
      }

      &.preview-dark {
        background-color: #101014;

        .bar {
          background-color: #33353d;
        }
      }

      &.preview-system {
        background: linear-gradient(90deg, #ffffff 50%, #101014 50%);

        .bar {
          background-color: #e5e6eb;
        }

        .bar:nth-child(even) {
          background-color: #33353d;
        }
      }
    }

    .theme-label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--color-text-1);
      background-color: var(--color-surface);
      border-top: 1px solid var(--color-border);

      .radio-dot {
        position: relative;
        width: 14px;
        height: 14px;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-text-3);

        &::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: var(--radius-full);
          background-color: var(--color-primary);
          opacity: 0;
          transition: opacity 0.15s ease;
        }
      }
    }
  }
}
</style>
