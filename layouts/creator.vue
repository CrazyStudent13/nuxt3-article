<!-- 创作者中心布局：独立顶栏 + 左侧导航（参考掘金创作者中心），登录守卫在此兜底（未登录原地弹登录框） -->
<template>
  <div class="creator-layout">
    <header class="creator-header">
      <div class="inner">
        <div class="left">
          <NuxtLink to="/" class="brand" title="回到游戏速递首页">
            <span class="brand-logo">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
              </svg>
            </span>
            <span class="brand-name">游戏速递</span>
          </NuxtLink>
          <span class="divider" />
          <span class="creator-title">创作者中心</span>
        </div>

        <div class="right">
          <NuxtLink v-if="user" to="/user/space" class="user-link" title="进入个人中心">
            <img v-if="avatarUrl" class="user-avatar" :src="avatarUrl" alt="头像" />
            <span v-else class="user-avatar user-avatar-fallback">{{ avatarFallback }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="creator-body">
      <!-- 左侧：写文章入口 + 导航菜单 -->
      <aside class="side-panel">
        <button class="write-btn" type="button" @click="goWrite">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
          </svg>
          写文章
        </button>

        <nav class="side-menu">
          <NuxtLink to="/creator" class="menu-item" :class="{ active: route.path === '/creator' }">
            <span class="menu-icon" v-html="icons.home" />
            <span>首页</span>
          </NuxtLink>
          <span class="menu-group">内容管理</span>
          <NuxtLink to="/creator/article" class="menu-item" :class="{ active: route.path.startsWith('/creator/article') }">
            <span class="menu-icon" v-html="icons.article" />
            <span>文章管理</span>
          </NuxtLink>
          <NuxtLink to="/creator/column" class="menu-item" :class="{ active: route.path.startsWith('/creator/column') }">
            <span class="menu-icon" v-html="icons.column" />
            <span>专栏管理</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- 右侧内容：未登录给登录引导，登录后才渲染页面 -->
      <main class="creator-content">
        <div v-if="!isLoggedIn" class="login-gate">
          <CommonEmptyState>登录后即可管理你的文章与专栏</CommonEmptyState>
          <button class="gate-btn" type="button" @click="openLogin()">立即登录</button>
        </div>
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 菜单图标：全站内联 SVG 规范（24 viewBox + stroke 2 + 圆角线帽），存字符串经 v-html 渲染
const icons = {
  home: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  article:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  column:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
}

const route = useRoute()
const config = useRuntimeConfig()
const { user, isLoggedIn, fetchUserInfo } = useUser()
const { openLogin } = useAuthModal()

// 登录守卫：无 token 原地弹登录框（不跳页）；有 token 但 state 为空时静默恢复登录态
onMounted(() => {
  if (!getToken()) {
    openLogin()
    return
  }
  if (!user.value) {
    fetchUserInfo().catch(() => {})
  }
})

const goWrite = () => {
  return navigateTo('/editor/new')
}

// 头像地址：相对路径（/profile/...）补全服务器前缀
const avatarUrl = computed(() => toCoverUrl(config.public.apiBase, user.value?.avatar))
const avatarFallback = computed(() => (user.value?.nickName || user.value?.userName || '用户').slice(0, 1))
</script>

<style lang="less" scoped>
.creator-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

// 顶栏：与主站头部同规格（60px、毛玻璃、吸顶）
.creator-header {
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
    gap: 14px;
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

  .divider {
    width: 1px;
    height: 18px;
    background-color: var(--color-border);
  }

  .creator-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-primary);
    white-space: nowrap;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .user-link {
    display: flex;
    align-items: center;
    line-height: 0;
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
}

// 内容区：左侧栏 + 右侧页面，与全站 1100px 容器对齐
.creator-body {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.side-panel {
  flex-shrink: 0;
  width: 200px;
  position: sticky;
  top: 76px;
  padding: 20px 14px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .write-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px 0;
    margin-bottom: 16px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }

  .side-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .menu-group {
      padding: 10px 12px 4px;
      font-size: 12px;
      color: var(--color-text-3);
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      color: var(--color-text-1);
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
}

.creator-content {
  flex: 1;
  min-width: 0;
  min-height: 400px;
}

// 未登录引导：空态插画 + 登录按钮
.login-gate {
  padding: 48px 20px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  text-align: center;

  .gate-btn {
    padding: 8px 32px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }
}

@media (max-width: 768px) {
  // 窄屏收纳侧栏（写文章可回主站头部进入）
  .side-panel {
    display: none;
  }

  .creator-header .brand-name,
  .creator-header .divider {
    display: none;
  }
}
</style>
