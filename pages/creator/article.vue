<!-- 创作者中心-文章管理：状态 tab + 标题搜索 + 分页列表，操作含 编辑/下架/发布/删除 -->
<template>
  <div class="creator-article">
    <div class="feed-panel">
      <div class="tab-bar">
        <div class="tab-items">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            type="button"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="tab-tools">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
            </svg>
            <input v-model="keyword" type="search" placeholder="请输入标题关键字" />
          </div>
        </div>
      </div>

      <div v-if="rows.length" class="row-list">
        <CreatorArticleRow
          v-for="row in rows"
          :key="row.id"
          :article="row"
          :subject-name="subjectMap[row.subjectId ?? 0]"
          @edit="goEdit(row)"
          @toggle="togglePublish(row)"
          @remove="removeRow(row)"
        />
      </div>
      <CommonEmptyState v-else-if="!loading">{{ emptyText }}</CommonEmptyState>

      <div v-if="rows.length && !finished" class="feed-loadmore">
        <button class="loadmore-btn" type="button" :disabled="loading" @click="loadMore">
          {{ loading ? '加载中…' : '加载更多' }}
        </button>
      </div>
      <div v-else-if="rows.length && finished" class="feed-end">已经到底了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

definePageMeta({
  layout: 'creator'
})

// 管理端列表返回的实体字段（publishStatus：0 草稿 / 1 待发布 / 2 已发布 / 3 已下架）
type ArticleRowData = {
  id: number
  title?: string
  subjectId?: number
  publishStatus?: string
  readNum?: number
  likeNum?: number
  commentNum?: number
  createTime?: string
  publishTime?: string | null
}

const { user, isLoggedIn } = useUser()

const PAGE_SIZE = 20

// 状态 tab：草稿/待发布当前发文链路不会产生，不放假 tab
const tabs = [
  { key: 'all', label: '全部' },
  { key: '2', label: '已发布' },
  { key: '3', label: '已下架' }
] as const
type TabKey = (typeof tabs)[number]['key']

const activeTab = ref<TabKey>('all')
const keyword = ref('')
const searchKeyword = ref('')
const rows = ref<ArticleRowData[]>([])
const total = ref(0)
const pageNum = ref(1)
const loading = ref(false)
const loadError = ref('')
const finished = computed(() => rows.value.length >= total.value)

// 拉取当前用户的文章列表（前端固定带 userId，只管自己的内容）
const loadList = async (reset = true) => {
  if (!user.value) {
    return
  }
  loading.value = true
  if (reset) {
    loadError.value = ''
  }
  try {
    const res = await apiFetch<{ list?: ArticleRowData[]; total?: number }>('/api/post/article/list', {
      query: {
        userId: user.value.userId,
        pageNum: pageNum.value,
        pageSize: PAGE_SIZE,
        orderByColumn: 'createTime',
        isAsc: 'descending',
        ...(searchKeyword.value ? { title: searchKeyword.value } : {}),
        ...(activeTab.value !== 'all' ? { publishStatus: activeTab.value } : {})
      }
    })
    const list = res.data?.list || []
    rows.value = reset ? list : rows.value.concat(list)
    total.value = res.data?.total ?? rows.value.length
  } catch (error: any) {
    loadError.value = error?.message || '加载失败，请稍后重试'
    if (!reset) {
      alert(loadError.value)
    }
  } finally {
    loading.value = false
  }
}

const switchTab = (key: TabKey) => {
  if (activeTab.value === key) {
    return
  }
  activeTab.value = key
  pageNum.value = 1
  return loadList(true)
}

// 标题搜索：输入防抖 400ms 后真正生效
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(keyword, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    searchKeyword.value = value.trim()
  }, 400)
})

watch(searchKeyword, () => {
  pageNum.value = 1
  return loadList(true)
})

const loadMore = () => {
  pageNum.value += 1
  return loadList(false)
}

// 专栏名映射：一次拉全量自己的专栏，行卡按 subjectId 查名（查不到则不展示，孤儿引用兜底）
const subjectMap = ref<Record<number, string>>({})
const loadSubjects = async () => {
  if (!user.value) {
    return
  }
  try {
    const res = await apiFetch<{ list?: { id: number; title: string }[] }>('/api/post/subject/list', {
      query: { userId: user.value.userId, pageNum: 1, pageSize: 100 }
    })
    const map: Record<number, string> = {}
    for (const item of res.data?.list || []) {
      map[item.id] = item.title
    }
    subjectMap.value = map
  } catch {
    // 专栏名映射失败不阻塞文章列表
  }
}

// 登录态就绪后拉取（布局侧守卫登录后才渲染本页）
watch(
  isLoggedIn,
  (val) => {
    if (val) {
      loadList(true)
      loadSubjects()
    }
  },
  { immediate: true }
)

const emptyText = computed(() => {
  if (loadError.value) {
    return loadError.value
  }
  if (searchKeyword.value) {
    return `没有找到标题包含「${searchKeyword.value}」的文章`
  }
  if (activeTab.value === '3') {
    return '还没有已下架的文章'
  }
  if (activeTab.value === '2') {
    return '还没有已发布的文章，去写一篇吧'
  }
  return '还没有文章，去写一篇吧'
})

// 编辑：进编辑器载入（guest 详情只开放已发布文章，故编辑入口只对已发布展示）
const goEdit = (row: ArticleRowData) => {
  return navigateTo({ path: '/editor/new', query: { id: String(row.id) } })
}

// 下架 / 重新发布：后端 PUT 为补丁式更新，只传状态字段（title/subjectId 为 DTO 必填）不影响内容
const togglePublish = async (row: ArticleRowData) => {
  const target = row.publishStatus === '2' ? '3' : '2'
  try {
    await apiFetch('/api/post/article', {
      method: 'PUT',
      body: { id: row.id, title: row.title, subjectId: row.subjectId, publishStatus: target }
    })
    row.publishStatus = target
    if (target === '2' && !row.publishTime) {
      row.publishTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  } catch (error: any) {
    alert(error?.message || '操作失败，请稍后重试')
  }
}

// 删除：软删除，二次确认后从列表移除
const removeRow = async (row: ArticleRowData) => {
  if (!window.confirm(`确定删除文章「${row.title}」吗？删除后不可恢复。`)) {
    return
  }
  try {
    await apiFetch(`/api/post/article/${row.id}`, { method: 'DELETE' })
    rows.value = rows.value.filter((item) => item.id !== row.id)
    total.value = Math.max(0, total.value - 1)
  } catch (error: any) {
    alert(error?.message || '删除失败，请稍后重试')
  }
}
</script>

<style lang="less" scoped>
// 标题搜索框：小圆边（space 页定稿审美），focus 变主题色
.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 240px;
  padding: 6px 10px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
  color: var(--color-text-3);
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: var(--color-primary);
  }

  svg {
    flex-shrink: 0;
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background-color: transparent;
    font-size: 13px;
    color: var(--color-text-1);

    &::placeholder {
      color: var(--color-text-3);
    }
  }
}

@media (max-width: 640px) {
  .search-box {
    width: 150px;
  }
}
</style>
