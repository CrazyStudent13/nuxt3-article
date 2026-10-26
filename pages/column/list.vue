<template>
  <div>
    <div class="page-head">
      <h1 class="page-title">专栏</h1>
      <span v-if="columns.length" class="page-count">共 {{ columns.length }} 个</span>
    </div>

    <div v-if="columns.length" class="column-grid">
      <column-card
        v-for="item in columns"
        :key="item.id || item.title"
        :column-info="item"
        @click="handleRowClick(item)"
      />
    </div>
    <div v-else class="feed-panel">
      <p class="feed-empty">暂无专栏，敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
type ColumnListItem = {
  id?: number | string
  title?: string
  name?: string
  desc?: string
  cover?: string
  createTime?: string
  articleNum?: number
}

useSeoMeta({
  title: '专栏 - 游戏速递',
  ogTitle: '专栏',
  description: '游戏速递的专栏频道，系列化的游戏内容合集。'
})

const config = useRuntimeConfig()

const { data } = await useFetch<{ data?: { list?: ColumnListItem[] } }>(
  `${config.public.apiBase}/api/post/subject/guest/list`,
  {
    query: {
      pageNum: 1,
      pageSize: 20
    },
    default: () => ({ data: { list: [] } })
  }
)

const columns = computed(() => data.value?.data?.list || [])

const handleRowClick = (item: ColumnListItem) => {
  return navigateTo({
    path: '/column/detail',
    query: {
      id: item.id
    }
  })
}
</script>

<style lang="less" scoped>
.page-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .page-count {
    font-size: 13px;
    color: var(--color-text-3);
  }
}

.column-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .column-grid {
    grid-template-columns: 1fr;
  }
}
</style>
