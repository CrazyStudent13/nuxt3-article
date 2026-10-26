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
html,
body {
  margin: 0;
  height: 100%;
  background-color: #f7f8fa;
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
    background-image: linear-gradient(135deg, #4f6bff 0%, #7c5cff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: #1f2329;
    margin: 12px 0 8px;
  }

  .desc {
    font-size: 14px;
    color: #86909c;
    margin-bottom: 28px;
  }

  .home-btn {
    padding: 10px 28px;
    border: 0;
    border-radius: 999px;
    background-color: #4f6bff;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #3d57d9;
    }
  }
}
</style>
