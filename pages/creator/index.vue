<!-- 创作者中心首页（占位）：欢迎语 + 快捷入口 + 数据总览待开发提示 -->
<template>
  <div class="creator-home">
    <div class="welcome-panel">
      <h1 class="welcome-title">Hi，{{ displayName }}</h1>
      <p class="welcome-desc">这里是你的创作工作台，写点什么分享给玩家吧。</p>
      <div class="quick-actions">
        <button class="qa-btn primary" type="button" @click="goWrite">写文章</button>
        <NuxtLink to="/creator/article" class="qa-btn ghost">文章管理</NuxtLink>
        <NuxtLink to="/creator/column" class="qa-btn ghost">专栏管理</NuxtLink>
      </div>
    </div>

    <div class="todo-panel">
      <h2 class="panel-title">数据总览</h2>
      <CommonEmptyState>数据总览开发中，论坛上线后一起拓展</CommonEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'creator'
})

const { user } = useUser()

const displayName = computed(() => user.value?.nickName || user.value?.userName || '创作者')

const goWrite = () => {
  return navigateTo('/editor/new')
}
</script>

<style lang="less" scoped>
.creator-home {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-panel {
  padding: 28px 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .welcome-title {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .welcome-desc {
    margin: 0 0 20px;
    font-size: 14px;
    color: var(--color-text-2);
  }

  .quick-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .qa-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 22px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    &.primary {
      border: 0;
      background-color: var(--color-primary);
      color: #fff;

      &:hover {
        background-color: var(--color-primary-hover);
      }
    }

    &.ghost {
      border: 1px solid var(--color-border);
      background-color: transparent;
      color: var(--color-text-2);

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
    }
  }
}

.todo-panel {
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .panel-title {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-1);
  }
}
</style>
