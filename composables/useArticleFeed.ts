// 文章信息流「加载更多」：首页、专栏详情页共用
// 第 1 页由页面的 useFetch SSR 直出，这里负责后续页的客户端追加；
// filters（标题搜索 / subjectId）变化时清空追加区，展示层回退到 useFetch 拉取的新首页数据
interface ArticlePageEnvelope {
  code: number
  msg: string
  data?: { list?: any[]; total?: number }
}

export const useArticleFeed = (
  initial: Ref<{ data?: { list?: any[]; total?: number } } | null>,
  filters: ComputedRef<Record<string, any>>,
  pageSize = 10
) => {
  const config = useRuntimeConfig()

  const appended = ref<any[]>([])
  const lastPage = ref(1)
  const lastPageShort = ref(false)
  const loading = ref(false)
  const loadError = ref('')

  const articles = computed(() => {
    const first = initial.value?.data?.list || []
    return appended.value.length ? [...first, ...appended.value] : first
  })

  const total = computed(() => initial.value?.data?.total || 0)

  // 是否已到底：优先信后端 total，缺失时按「上一页不满一页」判定
  const finished = computed(() => {
    if (total.value) {
      return articles.value.length >= total.value
    }
    return lastPageShort.value
  })

  const loadMore = async () => {
    if (loading.value || finished.value) {
      return
    }
    loading.value = true
    loadError.value = ''
    try {
      const res = await $fetch<ArticlePageEnvelope>(`${config.public.apiBase}/api/post/article/guest/list`, {
        query: { ...filters.value, pageNum: lastPage.value + 1, pageSize }
      })
      if (res.code !== 200) {
        throw new Error(res.msg || '加载失败')
      }
      const list = res.data?.list || []
      appended.value.push(...list)
      lastPage.value += 1
      if (list.length < pageSize) {
        lastPageShort.value = true
      }
    } catch (error: any) {
      loadError.value = error?.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  // 点过「加载更多」才展示「到底了」提示，单页小列表不出现
  const loadedMore = computed(() => appended.value.length > 0)

  watch(filters, () => {
    appended.value = []
    lastPage.value = 1
    lastPageShort.value = false
    loadError.value = ''
  })

  return { articles, total, loading, loadError, finished, loadedMore, loadMore }
}
