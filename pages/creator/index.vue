<!-- 创作者中心首页（占位）：时段问候语 + 数据总览待开发提示 -->
<template>
  <div class="creator-home">
    <div class="welcome-panel">
      <h1 class="welcome-title">{{ greeting }}，{{ displayName }}</h1>
      <p class="welcome-desc">这里是你的创作工作台，写点什么分享给玩家吧。</p>
    </div>

    <div class="todo-panel">
      <h2 class="panel-title">数据总览</h2>
      <CommonEmptyState>数据总览开发中，论坛上线后一起拓展</CommonEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

definePageMeta({
  layout: 'creator'
})

const { user } = useUser()

const displayName = computed(() => user.value?.nickName || user.value?.userName || '创作者')

// 时段问候：凌晨/上午/中午/下午/晚上，按用户本地时间
const greeting = computed(() => {
  const hour = dayjs().hour()
  if (hour < 5) {
    return '夜深了'
  }
  if (hour < 11) {
    return '上午好'
  }
  if (hour < 14) {
    return '中午好'
  }
  if (hour < 18) {
    return '下午好'
  }
  return '晚上好'
})
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
    margin: 0;
    font-size: 14px;
    color: var(--color-text-2);
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
