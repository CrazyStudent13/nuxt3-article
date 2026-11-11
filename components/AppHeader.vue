<template>
  <header class="header">
    <div class="inner">
      <div class="left">
        <NuxtLink to="/" class="brand">
          <span class="brand-logo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
            </svg>
          </span>
          <span class="brand-name">游戏速递</span>
        </NuxtLink>

        <nav class="nav" role="navigation">
          <NuxtLink
            v-for="item in navs"
            :key="item.match"
            :to="item.to"
            class="nav-link"
            :class="{ active: isActive(item.match) }"
          >
            {{ item.title }}
          </NuxtLink>
        </nav>
      </div>

      <div class="right">
        <form class="search" @submit.prevent="handleSearch">
          <button class="search-btn" type="submit" aria-label="搜索">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
              />
            </svg>
          </button>
          <input v-model="keyword" type="search" placeholder="搜索文章" />
        </form>

        <!-- 已登录：头像 + 昵称 + 退出；未登录：登录/注册按钮 -->
        <template v-if="isLoggedIn">
          <span class="user-area">
            <NuxtLink to="/user/space" class="user-link" title="进入个人中心">
              <img v-if="avatarUrl" class="user-avatar" :src="avatarUrl" alt="头像" />
              <span v-else class="user-avatar user-avatar-fallback">{{ avatarFallback }}</span>
              <span class="user-name">{{ user?.nickName || user?.userName }}</span>
              <!-- 悬停展示完整信息：昵称被截断时能看到全文 -->
              <span class="user-tip" role="tooltip">
                <span class="user-tip-name">{{ user?.nickName || user?.userName }}</span>
                <span v-if="user?.email && user.email !== user.nickName" class="user-tip-email">{{ user.email }}</span>
              </span>
            </NuxtLink>
            <button class="logout-btn" type="button" @click="handleLogout">退出</button>
          </span>
        </template>
        <template v-else>
          <button class="auth-btn login" type="button" @click="openLogin()">登录</button>
          <button class="auth-btn register" type="button" @click="openRegister()">注册</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const navs = [
  { title: '首页', to: '/', match: '/' },
  { title: '专栏', to: '/column/list', match: '/column' }
]

const isActive = (match: string) => {
  // 首页即文章列表，文章详情页也保持首页高亮
  if (match === '/') {
    return route.path === '/' || route.path.startsWith('/article')
  }
  return route.path.startsWith(match)
}

const keyword = ref((route.query.title as string) || '')

// 路由上的搜索词变化时同步输入框（如点击"清除搜索"）
watch(
  () => route.query.title,
  (value) => {
    keyword.value = (value as string) || ''
  }
)

const handleSearch = () => {
  const title = keyword.value.trim()
  return navigateTo({ path: '/', query: title ? { title } : {} })
}

const { openLogin, openRegister } = useAuthModal()
const config = useRuntimeConfig()
const { user, isLoggedIn, fetchUserInfo, logout } = useUser()

// 头像地址：后端返回相对路径（/profile/...）时补全服务器前缀
const avatarUrl = computed(() => toCoverUrl(config.public.apiBase, user.value?.avatar))
const avatarFallback = computed(() => (user.value?.nickName || user.value?.userName || '用户').slice(0, 1))

// 页面刷新后恢复登录态：有 token 但还没有用户信息时静默拉取
onMounted(() => {
  if (getToken() && !user.value) {
    fetchUserInfo().catch(() => {})
  }
})

const handleLogout = async () => {
  await logout()
}
</script>

<style lang="less" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);

  .inner {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 16px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 24px;
    min-width: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;

    .brand-logo {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-sm);
      background-image: var(--gradient-brand);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-1);
    }

    .brand-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text-1);
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .nav-link {
    display: inline-block;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 14px;
    color: var(--color-text-2);
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      color: var(--color-text-1);
      background-color: var(--color-bg);
    }

    &.active {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      font-weight: 500;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 180px;
    padding: 4px 8px 4px 12px;
    border-radius: var(--radius-full);
    background-color: var(--color-bg);
    border: 1px solid transparent;
    color: var(--color-text-3);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &:focus-within {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .search-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border: 0;
      background-color: transparent;
      color: inherit;
      cursor: pointer;
    }

    input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: none;
      background-color: transparent;
      font-size: 13px;
      color: var(--color-text-1);

      &::placeholder {
        color: var(--color-text-3);
      }
    }
  }

  .auth-btn {
    padding: 5px 16px;
    border-radius: var(--radius-full);
    font-size: 13px;
    white-space: nowrap;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    &.login {
      background-color: var(--color-primary);
      color: #fff;

      &:hover {
        background-color: var(--color-primary-hover);
      }
    }

    &.register {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);

      &:hover {
        background-color: var(--color-primary-light);
      }
    }
  }

  .user-area {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;

    .user-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      cursor: pointer;
    }

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-full);
      object-fit: cover;
      background-color: var(--color-bg);

      &.user-avatar-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: var(--gradient-brand);
        color: #fff;
        font-size: 14px;
      }
    }

    .user-name {
      max-width: 96px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      color: var(--color-text-1);
    }

    .logout-btn {
      padding: 0;
      border: 0;
      background-color: transparent;
      font-size: 13px;
      color: var(--color-text-3);
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-primary);
      }
    }

    // 悬停浮层：展示完整昵称与邮箱
    .user-tip {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      background-color: var(--color-text-1);
      color: #fff;
      font-size: 12px;
      line-height: 18px;
      white-space: nowrap;
      box-shadow: var(--shadow-2);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-4px);
      transition:
        opacity 0.15s ease,
        transform 0.15s ease,
        visibility 0.15s;
      pointer-events: none;
      z-index: 101;
    }

    &:hover .user-tip {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .user-tip-email {
      color: rgba(255, 255, 255, 0.65);
    }
  }
}

@media (max-width: 640px) {
  .header .search {
    display: none;
  }
}
</style>
