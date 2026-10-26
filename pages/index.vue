<template>
  <div class="feed-panel">
    <div class="feed-header">
      <h1 class="feed-title">
        <template v-if="searchTitle">搜索“{{ searchTitle }}”</template>
        <template v-else>最新文章</template>
      </h1>
      <NuxtLink v-if="searchTitle" to="/" class="feed-more">清除搜索</NuxtLink>
      <span v-else-if="articleTotal" class="feed-more">共 {{ articleTotal }} 篇</span>
    </div>

    <template v-if="articles.length">
      <article-card
        v-for="item in articles"
        :key="item.id || item.title"
        :card-info="item"
        @click="handleRowClick(item)"
      />
    </template>
    <p v-else class="feed-empty">
      {{ searchTitle ? `未找到与“${searchTitle}”相关的文章` : '暂无文章，敬请期待' }}
    </p>
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

const route = useRoute()
const config = useRuntimeConfig()
const searchTitle = computed(() => ((route.query.title as string) || '').trim())

useSeoMeta({
  title: () =>
    searchTitle.value ? `“${searchTitle.value}” 的搜索结果 - 游戏速递` : '游戏速递 - 专注分享游戏资讯与玩家攻略',
  ogTitle: '游戏速递',
  description: '专注分享游戏资讯，玩家攻略，游戏存档的快乐小站，希望为玩家们提供更好的游戏体验。',
  ogDescription: '专注分享游戏资讯，玩家攻略，游戏存档的快乐小站'
})

const queryParams = computed(() => ({
  pageNum: 1,
  pageSize: 10,
  ...(searchTitle.value ? { title: searchTitle.value } : {})
}))

const { data } = await useFetch<{ data?: { list?: ArticleListItem[]; total?: number } }>(
  `${config.public.apiBase}/api/post/article/guest/list`,
  {
    query: queryParams,
    default: () => ({ data: { list: [], total: 0 } })
  }
)

const articles = computed(() => data.value?.data?.list || [])
const articleTotal = computed(() => data.value?.data?.total || articles.value.length)

const handleRowClick = (item: ArticleListItem) => {
  return navigateTo({
    path: '/article/detail',
    query: {
      id: item.id
    }
  })
}
</script>
