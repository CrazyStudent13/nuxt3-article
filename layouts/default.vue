<template>
  <div class="app">
    <AppHeader />

    <main class="app-main">
      <slot />
    </main>

    <!-- 首页的页脚信息在右侧边栏展示（掘金式），其余页面保留底部页脚 -->
    <AppFooter v-if="route.path !== '/'" />
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
