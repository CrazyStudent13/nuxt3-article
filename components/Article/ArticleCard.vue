<template>
  <article class="article-item">
    <div class="body">
      <h3 class="title">{{ title }}</h3>
      <p v-if="remark" class="remark">{{ remark }}</p>
      <div class="meta">
        <span v-if="author">{{ author }}</span>
        <span v-if="publishTime">{{ publishTime }}</span>
        <span v-if="readLabel">{{ readLabel }}</span>
      </div>
    </div>

    <div v-if="cover" class="thumb">
      <img :src="coverUrl" :alt="title" loading="lazy" />
    </div>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

type CardInfo = {
  title?: string
  cover?: string
  remark?: string
  desc?: string
  content?: string
  author?: string
  publishTime?: string
  date?: string
  createTime?: string
  read?: number | string
  readNum?: number | string
}

const props = withDefaults(
  defineProps<{
    cardInfo?: CardInfo
  }>(),
  {
    cardInfo: () => ({})
  }
)

const config = useRuntimeConfig()

const title = computed(() => props.cardInfo?.title || '无标题')
const cover = computed(() => props.cardInfo?.cover || '')
const coverUrl = computed(() => toCoverUrl(config.public.apiBase, cover.value))
const remark = computed(
  () => props.cardInfo?.remark || props.cardInfo?.desc || props.cardInfo?.content || ''
)
const author = computed(() => props.cardInfo?.author || '')
const readLabel = computed(() => {
  const read = props.cardInfo?.read ?? props.cardInfo?.readNum
  return read ? `${read} 阅读` : ''
})

const publishTime = computed(() => {
  const value = props.cardInfo?.publishTime || props.cardInfo?.date || props.cardInfo?.createTime
  if (!value) {
    return ''
  }

  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')
  return formatted === 'Invalid Date' ? '' : formatted
})
</script>

<style lang="less" scoped>
// 掘金风格信息流条目：文字为主，缩略图靠右，依赖外层 .feed-panel 提供底色和分隔线
.article-item {
  display: flex;
  gap: 20px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-bg);

    .title {
      color: var(--color-primary);
    }
  }

  .body {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: var(--color-text-1);
      transition: color 0.2s ease;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .remark {
      margin-top: 6px;
      font-size: 13px;
      line-height: 22px;
      color: var(--color-text-2);
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .meta {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      font-size: 13px;
      color: var(--color-text-3);
    }
  }

  .thumb {
    flex-shrink: 0;
    align-self: center;
    width: 112px;
    height: 76px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background-color: var(--color-bg);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
