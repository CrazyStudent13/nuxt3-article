<template>
  <header class="header">
    <div class="inner">
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
</script>

<style lang="less" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.85);
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
}
</style>
