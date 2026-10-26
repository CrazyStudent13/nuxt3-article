<template>
  <div class="column">
    <section class="column-header">
      <div class="header-top">
        <div class="cover">
          <img v-if="coverUrl" :src="coverUrl" :alt="subject.title || ''" />
          <div v-else class="cover-placeholder">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
            </svg>
          </div>
        </div>
        <div class="info">
          <h1 class="title">《{{ subject.title || '专栏详情' }}》</h1>
          <p v-if="subject.desc" class="desc">{{ subject.desc }}</p>
          <div class="meta">
            <span v-if="total">共 {{ total }} 篇文章</span>
            <span v-if="createTime">{{ createTime }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="feed-panel">
      <div class="feed-header">
        <h2 class="feed-title">专栏文章</h2>
      </div>

      <template v-if="articles.length">
        <article-card
          v-for="item in articles"
          :key="item.id || item.title"
          :card-info="item"
          @click="handleRowClick(item)"
        />
      </template>
      <p v-else class="feed-empty">该专栏下还没有文章</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

type SubjectDetail = {
  id?: number | string
  title?: string
  name?: string
  desc?: string
  content?: string
  cover?: string
  createTime?: string
}

type ArticleListItem = {
  id?: number | string
  title?: string
  author?: string
  cover?: string
  publishTime?: string
  read?: number
  readNum?: number
  remark?: string
  desc?: string
}

const route = useRoute()
const config = useRuntimeConfig()
const subjectId = computed(() => (route.query.id as string) || '')

const { data: subjectRes } = await useFetch<{ data?: SubjectDetail }>(
  `${config.public.apiBase}/api/post/subject/guest/detail`,
  {
    query: {
      id: subjectId
    },
    default: () => ({ data: null })
  }
)

const subject = computed(() => subjectRes.value?.data || {})

useSeoMeta({
  title: () => (subject.value.title ? `《${subject.value.title}》 - 专栏 - 游戏速递` : '专栏详情 - 游戏速递'),
  ogTitle: () => subject.value.title || '专栏详情',
  description: () => subject.value.desc || '游戏速递的专栏详情页。'
})
const createTime = computed(() => {
  const value = subject.value.createTime
  if (!value) {
    return ''
  }

  const formatted = dayjs(value).format('YYYY-MM-DD')
  return formatted === 'Invalid Date' ? '' : formatted
})
const coverUrl = computed(() => toCoverUrl(config.public.apiBase, subject.value.cover))

const { data: articleRes } = await useFetch<{ data?: { list?: ArticleListItem[]; total?: number } }>(
  `${config.public.apiBase}/api/post/article/guest/list`,
  {
    query: {
      subjectId,
      pageNum: 1,
      pageSize: 10
    },
    default: () => ({ data: { list: [] } })
  }
)

const articles = computed(() => articleRes.value?.data?.list || [])
const total = computed(() => articleRes.value?.data?.total || articles.value.length)

const handleRowClick = (item: ArticleListItem) => {
  return navigateTo({
    path: '/article/detail',
    query: {
      id: item.id
    }
  })
}
</script>

<style lang="less" scoped>
.column-header {
  padding: 24px;
  margin-bottom: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .header-top {
    display: flex;
    gap: 20px;
  }

  .cover {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background-color: var(--color-bg);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-3);
      background-color: var(--color-primary-light);
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-text-1);
      margin-bottom: 8px;
    }

    .desc {
      font-size: 14px;
      line-height: 22px;
      color: var(--color-text-2);
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .meta {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 20px;
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
}
</style>
