<!-- 全局错误页（布局之外渲染）：404 显示"页面走丢了"，其余显示"出错了"；返回首页用 clearError；自带 html/body 背景，必须走主题变量以免盖住深色模式 -->
<template>
  <div class="error-page">
    <p class="code">{{ statusCode }}</p>
    <h1 class="title">{{ title }}</h1>
    <p class="desc">{{ description }}</p>
    <button class="home-btn" type="button" @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode || 404)
const is404 = computed(() => statusCode.value === 404)
const title = computed(() => (is404.value ? '页面走丢了' : '出错了'))
const description = computed(() =>
  is404.value ? '你要找的页面不存在，可能已被移动或删除。' : '服务器开小差了，请稍后再试。'
)

useSeoMeta({
  title: () => `${statusCode.value} - 游戏速递`
})

const goHome = () => {
  clearError({ redirect: '/' })
}
</script>

<style lang="less">
// 错误页在布局之外渲染，自带全局背景
// 注意：本块会被 Nuxt 入口在所有页面加载，必须走主题变量（硬编码浅色会盖住深色模式）
html,
body {
  margin: 0;
  height: 100%;
  background-color: var(--color-bg);
}
</style>

<style lang="less" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;

  .code {
    font-size: 96px;
    font-weight: 700;
    line-height: 1.2;
    background-image: var(--gradient-brand);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text-1);
    margin: 12px 0 8px;
  }

  .desc {
    font-size: 14px;
    color: var(--color-text-3);
    margin-bottom: 28px;
  }

  .home-btn {
    padding: 10px 28px;
    border: 0;
    border-radius: 999px;
    background-color: var(--color-primary);
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }
}
</style>
