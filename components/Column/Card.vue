<template>
  <article class="column-card">
    <div class="cover">
      <img v-if="coverUrl" :src="coverUrl" :alt="title" loading="lazy" />
      <div v-else class="cover-placeholder">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
        </svg>
      </div>
    </div>

    <div class="body">
      <h3 class="title">{{ title }}</h3>
      <p v-if="desc" class="desc">{{ desc }}</p>
      <div class="meta">
        <span v-if="articleNum">{{ articleNum }} 篇文章</span>
        <span v-if="createTime">{{ createTime }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

type ColumnInfo = {
  title?: string
  name?: string
  desc?: string
  content?: string
  cover?: string
  createTime?: string
  articleNum?: number | string
  articleCount?: number | string
}

const props = withDefaults(
  defineProps<{
    columnInfo?: ColumnInfo
  }>(),
  {
    columnInfo: () => ({})
  }
)

const config = useRuntimeConfig()

const title = computed(() => props.columnInfo?.title || props.columnInfo?.name || '未命名专栏')
const desc = computed(() => props.columnInfo?.desc || props.columnInfo?.content || '')
const articleNum = computed(() => props.columnInfo?.articleCount || props.columnInfo?.articleNum || '')

const coverUrl = computed(() => toCoverUrl(config.public.apiBase, props.columnInfo?.cover))

const createTime = computed(() => {
  const value = props.columnInfo?.createTime
  if (!value) {
    return ''
  }

  const formatted = dayjs(value).format('YYYY-MM-DD')
  return formatted === 'Invalid Date' ? '' : formatted
})
</script>

<style lang="less" scoped>
.column-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-2);
    border-color: transparent;

    .title {
      color: var(--color-primary);
    }
  }

  .cover {
    height: 130px;
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

  .body {
    padding: 14px 16px 16px;

    .title {
      font-size: 15px;
      font-weight: 600;
      line-height: 22px;
      color: var(--color-text-1);
      transition: color 0.2s ease;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .desc {
      margin-top: 6px;
      font-size: 13px;
      line-height: 20px;
      color: var(--color-text-2);
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      min-height: 40px;
    }

    .meta {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
}
</style>
