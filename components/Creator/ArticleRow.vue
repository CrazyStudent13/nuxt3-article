<!-- 创作者中心文章管理行卡：纯文字行（状态徽标+标题 | meta | 操作按钮），区别于 C 端信息流卡片 -->
<template>
  <article class="article-row">
    <div class="main">
      <div class="title-line">
        <span class="status-badge" :class="badge.cls">{{ badge.label }}</span>
        <h3 class="title" :title="rowTitle">{{ article.title }}</h3>
      </div>
      <div class="meta">
        <span v-if="subjectName">专栏：{{ subjectName }}</span>
        <span>{{ timeLabel }} {{ timeText }}</span>
        <span>阅读 {{ article.readNum ?? 0 }}</span>
        <span>点赞 {{ article.likeNum ?? 0 }}</span>
        <span>评论 {{ article.commentNum ?? 0 }}</span>
      </div>
    </div>

    <div class="actions">
      <button v-if="canEdit" class="act-btn primary" type="button" @click="emit('edit')">编辑</button>
      <button class="act-btn" type="button" @click="emit('toggle')">{{ status === '2' ? '下架' : '发布' }}</button>
      <button class="act-btn danger" type="button" @click="emit('remove')">删除</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

// 行数据：管理端列表返回的实体字段（publishStatus：0 草稿 / 1 待发布 / 2 已发布 / 3 已下架；
// auditStatus：0 未提交 / 1 审核中 / 2 审核通过 / 3 审核拒绝）
type ArticleRowData = {
  id: number
  title?: string
  subjectId?: number
  publishStatus?: string
  auditStatus?: string
  auditRemark?: string
  readNum?: number
  likeNum?: number
  commentNum?: number
  createTime?: string
  publishTime?: string | null
}

const props = defineProps<{
  article: ArticleRowData
  subjectName?: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'toggle'): void
  (e: 'remove'): void
}>()

const status = computed(() => props.article.publishStatus || '0')

const STATUS_MAP: Record<string, string> = {
  '0': '草稿',
  '1': '待发布',
  '2': '已发布',
  '3': '已下架'
}

// 徽标：审核状态优先展示（审核中/审核失败），其余按发布状态
const badge = computed(() => {
  if (props.article.auditStatus === '1') {
    return { label: '审核中', cls: 'audit-auditing' }
  }
  if (props.article.auditStatus === '3') {
    return { label: '审核失败', cls: 'audit-rejected' }
  }
  const label = STATUS_MAP[status.value] || '草稿'
  return { label, cls: `status-${status.value}` }
})

// 编辑入口：guest 详情只放行已发布文章，非已发布不给编辑
const canEdit = computed(() => status.value === '2')

// 悬停标题可见完整标题；审核失败时同时展示拒绝理由
const rowTitle = computed(() => {
  if (props.article.auditStatus === '3' && props.article.auditRemark) {
    return `${props.article.title}（${props.article.auditRemark}）`
  }
  return props.article.title
})

const timeLabel = computed(() => (status.value === '2' ? '发布于' : '创建于'))

const timeText = computed(() => {
  // 已发布优先展示发布时间（可能为空，退回创建时间），其余状态展示创建时间
  const value = status.value === '2' ? props.article.publishTime || props.article.createTime : props.article.createTime
  if (!value) {
    return ''
  }
  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')
  return formatted === 'Invalid Date' ? '' : formatted
})
</script>

<style lang="less" scoped>
.article-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }

  &:hover {
    background-color: var(--color-bg);
  }

  .main {
    flex: 1;
    min-width: 0;
  }

  .title-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  // 状态徽标：小号圆角胶囊
  .status-badge {
    flex-shrink: 0;
    padding: 1px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    line-height: 18px;

    &.status-2 {
      color: #3fb060;
      background-color: rgba(63, 176, 96, 0.12);
    }

    &.status-1,
    &.audit-auditing {
      color: #e6832d;
      background-color: rgba(230, 131, 45, 0.12);
    }

    &.audit-rejected {
      color: #d1242f;
      background-color: rgba(209, 36, 47, 0.1);
    }

    &.status-0,
    &.status-3 {
      color: var(--color-text-3);
      background-color: var(--color-bg);
    }
  }

  .title {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
    color: var(--color-text-1);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .meta {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    font-size: 13px;
    color: var(--color-text-3);
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
  .article-row {
    .actions {
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }
  }
}
</style>
