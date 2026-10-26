<template>
  <div class="feed-panel">
    <div class="feed-header">
      <h1 class="feed-title">最新文章</h1>
      <span v-if="articles.length" class="feed-more">共 {{ articles.length }} 篇</span>
    </div>

    <template v-if="articles.length">
      <article-card
        v-for="item in articles"
        :key="item.id || item.title"
        :card-info="item"
        @click="handleRowClick(item)"
      />
    </template>
    <p v-else class="feed-empty">暂无文章，敬请期待</p>
  </div>
</template>

<script setup lang="ts">
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

useSeoMeta({
  title: '游戏速递 - 专注分享游戏资讯与玩家攻略',
  ogTitle: '游戏速递',
  description: '专注分享游戏资讯，玩家攻略，游戏存档的快乐小站，希望为玩家们提供更好的游戏体验。',
  ogDescription: '专注分享游戏资讯，玩家攻略，游戏存档的快乐小站'
})

const config = useRuntimeConfig()

const { data } = await useFetch<{ data?: { list?: ArticleListItem[] } }>(
  `${config.public.apiBase}/api/post/article/guest/list`,
  {
    query: {
      pageNum: 1,
      pageSize: 10
    },
    default: () => ({ data: { list: [] } })
  }
)

const articles = computed(() => data.value?.data?.list || [])

const handleRowClick = (item: ArticleListItem) => {
  return navigateTo({
    path: '/article/detail',
    query: {
      id: item.id
    }
  })
}
</script>
