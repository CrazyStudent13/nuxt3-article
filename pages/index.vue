<template>
  <div class="home-layout">
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

      <!-- 无限滚动：哨兵进入视口自动追加；出错时显示手动重试 -->
      <div ref="sentinelRef" class="feed-sentinel" />
      <div v-if="loadError" class="feed-loadmore">
        <button class="loadmore-btn" type="button" :disabled="loading" @click="loadMore">
          {{ loading ? '加载中…' : '加载失败，点击重试' }}
        </button>
      </div>
      <p v-if="articles.length && finished && loadedMore" class="feed-end">已经到底了</p>
    </div>

    <!-- 右侧信息栏：页脚信息块（掘金式） -->
    <aside class="home-aside">
      <div class="info-card">
        <CommonFooterInfo />
      </div>
    </aside>
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

const { articles, total: articleTotal, loading, loadError, finished, loadedMore, loadMore } = useArticleFeed(
  data,
  queryParams
)

// ---------- 无限滚动：哨兵进入视口自动加载下一页，追加后若仍在视口内继续加载 ----------
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const maybeLoadMore = () => {
  if (loading.value || finished.value || loadError.value) {
    return
  }
  const el = sentinelRef.value
  if (el && el.getBoundingClientRect().top < window.innerHeight + 200) {
    loadMore().then(() => maybeLoadMore())
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        maybeLoadMore()
      }
    },
    { rootMargin: '200px' }
  )
  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

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
// 首页双栏：信息流 + 右侧站点信息栏（掘金式）
.home-layout {
  display: flex;
  align-items: flex-start;
  gap: 20px;

  .feed-panel {
    flex: 1;
    min-width: 0;
  }
}

.home-aside {
  position: sticky;
  top: 76px;
  flex-shrink: 0;
  width: 280px;

  .info-card {
    padding: 20px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
  }
}

// 无限滚动哨兵：仅撑起触发区域
.feed-sentinel {
  height: 1px;
}

@media (max-width: 1000px) {
  .home-aside {
    display: none;
  }
}
</style>
