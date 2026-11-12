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
        <span v-if="createTime">{{ createTime }}</span>
        <span v-if="articleNum">文章数 {{ articleNum }}</span>
      </div>
    </div>

    <!-- 订阅占位：后端暂无订阅能力 -->
    <button class="subscribe-btn" type="button" :disabled="!!subTip" @click.stop="handleSubscribe">
      <svg v-if="!subTip" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {{ subTip || '订阅' }}
    </button>
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

  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')
  return formatted === 'Invalid Date' ? '' : formatted
})

// 订阅占位反馈：按钮文字短暂切换，2 秒还原
const subTip = ref('')
let subTimer: ReturnType<typeof setTimeout> | null = null
const handleSubscribe = () => {
  subTip.value = '即将上线'
  if (subTimer) {
    clearTimeout(subTimer)
  }
  subTimer = setTimeout(() => (subTip.value = ''), 2000)
}

onBeforeUnmount(() => {
  if (subTimer) {
    clearTimeout(subTimer)
  }
})
</script>

<style lang="less" scoped>
// 掘金式横向行：封面左 + 信息右 + 订阅按钮，行间分隔线
.column-card {
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

  .subscribe-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 7px 16px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    font-size: 13px;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover:not(:disabled) {
      opacity: 0.85;
    }

    &:disabled {
      cursor: default;
    }
  }
}

@media (max-width: 640px) {
  .column-card {
    .cover {
      width: 120px;
      height: 76px;
    }

    .subscribe-btn {
      display: none;
    }
  }
}
</style>
