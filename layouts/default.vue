<!-- 全站默认布局：吸顶站头+内容区+底部页脚；首页与通知中心不渲染页脚（首页站点信息在右侧边栏展示，通知中心拉满视口灰底） -->
<template>
  <div class="app">
    <AppHeader />

    <main class="app-main">
      <slot />
    </main>

    <!-- 首页的页脚信息在右侧边栏展示（掘金式），通知中心拉满视口不留白色页脚条，其余页面保留底部页脚 -->
    <AppFooter v-if="route.path !== '/' && route.path !== '/notification'" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style lang="less" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 24px 16px 40px;
}
</style>
