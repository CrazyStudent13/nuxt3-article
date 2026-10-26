<template>
  <div class="stub">
    <div class="panel">
      <div class="icon">ℹ️</div>
      <h1 class="title">关于我们</h1>
      <p class="desc">页面建设中，敬请期待。</p>
      <NuxtLink to="/" class="back-btn">返回首页</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '关于我们 - 游戏速递'
})
</script>

<style lang="less" scoped>
.stub {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.panel {
  width: 100%;
  max-width: 480px;
  padding: 48px 32px;
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .icon {
    font-size: 40px;
    margin-bottom: 16px;
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text-1);
    margin-bottom: 8px;
  }

  .desc {
    font-size: 14px;
    color: var(--color-text-3);
    margin-bottom: 24px;
  }

  .back-btn {
    display: inline-block;
    padding: 8px 24px;
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    color: #fff;
    font-size: 14px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }
}
</style>
