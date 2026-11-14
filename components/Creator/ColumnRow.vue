<!-- 创作者中心专栏管理行卡：复用 C 端 ColumnCard 横排造型，右侧操作为 编辑/删除；点行跳公开专栏详情 -->
<template>
  <article class="column-row" @click="emit('view')">
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
        <span v-if="createTime">{{ createTime }} 创建</span>
        <span>文章数 {{ articleCount }}</span>
      </div>
    </div>

    <div class="actions">
      <button class="act-btn primary" type="button" @click.stop="emit('edit')">编辑</button>
      <button class="act-btn danger" type="button" @click.stop="emit('remove')">删除</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

// 行数据：管理端专栏列表返回字段（articleCount 为该专栏下文章数）
type ColumnRowData = {
  id: number
  title?: string
  desc?: string
  cover?: string
  createTime?: string
  articleCount?: number
}

const props = defineProps<{
  columnInfo: ColumnRowData
}>()

const emit = defineEmits<{
  (e: 'view'): void
  (e: 'edit'): void
  (e: 'remove'): void
}>()

const config = useRuntimeConfig()

const title = computed(() => props.columnInfo.title || '未命名专栏')
const desc = computed(() => props.columnInfo.desc || '')
const articleCount = computed(() => props.columnInfo.articleCount ?? 0)

const coverUrl = computed(() => toCoverUrl(config.public.apiBase, props.columnInfo.cover))

const createTime = computed(() => {
  const value = props.columnInfo.createTime
  if (!value) {
    return ''
  }
  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')
  return formatted === 'Invalid Date' ? '' : formatted
})
</script>

<style lang="less" scoped>
// 横排行：封面左 + 信息右 + 操作按钮（ColumnCard 同款造型）
.column-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }

  &:hover {
    background-color: var(--color-bg);

    .title {
      color: var(--color-primary);
    }
  }

  .cover {
    flex-shrink: 0;
    width: 160px;
    height: 100px;
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

  .body {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 17px;
      font-weight: 600;
      line-height: 24px;
      color: var(--color-text-1);
      transition: color 0.2s ease;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .desc {
      margin-top: 6px;
      font-size: 14px;
      line-height: 22px;
      color: var(--color-text-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 13px;
      color: var(--color-text-3);
    }
  }

  .actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .act-btn {
    padding: 0;
    border: 0;
    background-color: transparent;
    font-size: 13px;
    color: var(--color-text-2);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }

    &.primary {
      color: var(--color-primary);
    }

    &.danger:hover {
      color: #d1242f;
    }
  }
}

@media (max-width: 640px) {
  .column-row {
    .cover {
      width: 120px;
      height: 76px;
    }
  }
}
</style>
