<template>
  <div class="detail">
    <NuxtLink to="/" class="back">← 返回文章列表</NuxtLink>

    <article class="panel">
      <header class="panel-head">
        <h1 class="title">{{ article.title || '文章详情' }}</h1>
        <div class="meta">
          <span v-if="article.publishTime">发布时间：{{ article.publishTime }}</span>
          <span v-if="article.createTime">创建时间：{{ article.createTime }}</span>
          <span v-if="article.author">作者：{{ article.author }}</span>
        </div>
      </header>

      <div class="panel-body">
        <MdViewer :value="article.content" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

type ArticleDetail = {
  title?: string
  desc?: string
  publishTime?: string | null
  createTime?: string
  author?: string
  content?: string
}

const config = useRuntimeConfig()
const route = useRoute()
const articleId = computed(() => (route.query.id as string) || '')

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  return formatted === 'Invalid Date' ? '' : formatted
}

const { data } = await useFetch<{ data?: ArticleDetail }>(
  `${config.public.apiBase}/api/post/article/guest/detail`,
  {
    query: {
      id: articleId
    },
    default: () => ({ data: null })
  }
)

const article = computed(() => {
  const model = data.value?.data || {}

  return {
    ...model,
    title: model.title || '',
    content: model.content || '',
    publishTime: formatDateTime(model.publishTime),
    createTime: formatDateTime(model.createTime)
  }
})

useSeoMeta({
  title: () => (article.value.title ? `${article.value.title} - 游戏速递` : '文章详情 - 游戏速递'),
  ogTitle: () => article.value.title || '文章详情',
  description: () => article.value.desc || article.value.title || '游戏速递的文章详情页。'
})
</script>

<style lang="less" scoped>
.back {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--color-text-3);
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
}

.panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 32px 36px;
}

.panel-head {
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);

  .title {
    font-size: 26px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-text-1);
    margin-bottom: 12px;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 20px;
    font-size: 13px;
    color: var(--color-text-3);
  }
}
</style>
