<!-- 文章详情页右侧相关推荐卡：同专栏下排除当前文章的其它文章，无数据时整体不渲染 -->
<template>
  <div v-if="related.length" class="related-card">
    <div class="related-head">相关推荐</div>
    <NuxtLink
      v-for="item in related"
      :key="item.id"
      class="related-item"
      :title="item.title"
      :to="{ path: '/article/detail', query: { id: String(item.id) } }"
    >
      <span class="item-title">{{ item.title || '无标题' }}</span>
      <span class="item-meta">{{ item.readNum ?? 0 }} 阅读</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface RelatedItem {
  id?: number | string
  title?: string
  readNum?: number
}

const props = withDefaults(
  defineProps<{
    subjectId?: number | string
    excludeId?: number | string
  }>(),
  {
    subjectId: '',
    excludeId: ''
  }
)

const config = useRuntimeConfig()

// 同专栏文章一次取 6 条，剔除当前文章后最多展示 5 条；专栏无效（如孤儿引用）时为空整体隐藏
const { data } = await useFetch<{ data?: { list?: RelatedItem[] } | null }>(
  `${config.public.apiBase}/api/post/article/guest/list`,
  {
    query: computed(() => ({ subjectId: props.subjectId, pageNum: 1, pageSize: 6 })),
    immediate: !!props.subjectId,
    default: () => ({ data: null })
  }
)

const related = computed(() =>
  (data.value?.data?.list || [])
    .filter((item) => String(item.id) !== String(props.excludeId))
    .slice(0, 5)
)
</script>

<style lang="less" scoped>
.related-card {
  padding: 14px 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.related-head {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.related-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;

  & + .related-item {
    border-top: 1px solid var(--color-border-light);
  }

  .item-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    line-height: 20px;
    color: var(--color-text-1);
    transition: color 0.15s ease;
  }

  .item-meta {
    font-size: 12px;
    color: var(--color-text-3);
  }

  &:hover .item-title {
    color: var(--color-primary);
  }
}
</style>
