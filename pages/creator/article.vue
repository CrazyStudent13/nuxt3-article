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
            {{ tab.label }}{{ countText(tab.key) }}
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
      <CommonEmptyState v-else>{{ loading ? '加载中…' : emptyText }}</CommonEmptyState>

      <CommonPagination v-if="rows.length" v-model:page="pageNum" :total="total" :page-size="PAGE_SIZE" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'creator'
})

// 管理端列表返回的实体字段（publishStatus：0 草稿 / 1 待发布 / 2 已发布 / 3 已下架；
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

const { user, isLoggedIn } = useUser()

const PAGE_SIZE = 20
// 审核中 tab 的合并查询拉取上限：后端 auditStatus 仅支持单值，两个状态各拉一次在前端合并分页
const AUDIT_FETCH_SIZE = 100

// 状态 tab：待发布当前发文链路不会产生，不放假 tab；草稿箱/审核中按用户习惯放已发布左侧
const tabs = [
  { key: 'all', label: '全部' },
  { key: '0', label: '草稿箱' },
  { key: 'auditing', label: '审核中' },
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

// 各 tab 的文章数量：进页与写操作后刷新（只取 total，pageSize=1 最小开销）；审核中 = 审核中 + 审核失败 之和
const counts = ref<Record<TabKey, number> | null>(null)
const countText = (key: TabKey) => {
  const value = counts.value?.[key]
  return value === undefined ? '' : `（${value}）`
}
const loadCounts = async () => {
  if (!user.value) {
    return
  }
  try {
    const base = { userId: user.value.userId, pageNum: 1, pageSize: 1 }
    const countQuery = (overrides: Record<string, any>) =>
      apiFetch<{ list?: ArticleRowData[]; total?: number }>('/api/post/article/list', {
        query: { ...base, ...overrides }
      }).then((res) => res.data?.total ?? 0)
    const [all, published, draft, offline, auditing, rejected] = await Promise.all([
      countQuery({}),
      countQuery({ publishStatus: '2' }),
      countQuery({ publishStatus: '0' }),
      countQuery({ publishStatus: '3' }),
      countQuery({ auditStatus: '1' }),
      countQuery({ auditStatus: '3' })
    ])
    counts.value = { all, '2': published, '0': draft, '3': offline, auditing: auditing + rejected }
  } catch {
    // 数量加载失败不阻塞列表，tab 不显示括号数字
  }
}

// 组装基础查询条件（userId 固定只查自己的文章）
const buildQuery = (overrides: Record<string, any>) => {
  return {
    userId: user.value?.userId,
    pageNum: pageNum.value,
    pageSize: PAGE_SIZE,
    orderByColumn: 'createTime',
    isAsc: 'descending',
    ...(searchKeyword.value ? { title: searchKeyword.value } : {}),
    ...overrides
  }
}

// 拉取当前页数据：审核中 tab 合并「审核中 + 审核失败」两个状态后前端分页，其余按 publishStatus 直查
const loadList = async () => {
  if (!user.value) {
    return
  }
  loading.value = true
  try {
    if (activeTab.value === 'auditing') {
      const base = {
        userId: user.value.userId,
        pageNum: 1,
        pageSize: AUDIT_FETCH_SIZE,
        orderByColumn: 'createTime',
        isAsc: 'descending',
        ...(searchKeyword.value ? { title: searchKeyword.value } : {})
      }
      const [auditing, rejected] = await Promise.all([
        apiFetch<{ list?: ArticleRowData[]; total?: number }>('/api/post/article/list', {
          query: { ...base, auditStatus: '1' }
        }),
        apiFetch<{ list?: ArticleRowData[]; total?: number }>('/api/post/article/list', {
          query: { ...base, auditStatus: '3' }
        })
      ])
      const merged = [...(auditing.data?.list || []), ...(rejected.data?.list || [])].sort((a, b) =>
        (b.createTime || '').localeCompare(a.createTime || '')
      )
      total.value = merged.length
      rows.value = merged.slice((pageNum.value - 1) * PAGE_SIZE, pageNum.value * PAGE_SIZE)
    } else {
      const res = await apiFetch<{ list?: ArticleRowData[]; total?: number }>('/api/post/article/list', {
        query: buildQuery(activeTab.value === 'all' ? {} : { publishStatus: activeTab.value })
      })
      rows.value = res.data?.list || []
      total.value = res.data?.total ?? rows.value.length
    }
  } catch (error: any) {
    loadError.value = error?.message || '加载失败，请稍后重试'
    rows.value = []
    showToast(loadError.value)
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
  rows.value = []
  return loadList()
}

// 标题搜索：输入防抖 400ms 后真正生效
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(keyword, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    const next = value.trim()
    if (next === searchKeyword.value) {
      return
    }
    searchKeyword.value = next
  }, 400)
})

watch(searchKeyword, () => {
  pageNum.value = 1
  rows.value = []
  return loadList()
})

// 分页翻页
watch(pageNum, () => {
  return loadList()
})

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
      loadList()
      loadSubjects()
      loadCounts()
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
  if (activeTab.value === '2') {
    return '还没有已发布的文章，去写一篇吧'
  }
  if (activeTab.value === '0') {
    return '草稿箱是空的，写文章时的内容会自动保存在这里'
  }
  if (activeTab.value === 'auditing') {
    return '没有审核中的文章'
  }
  if (activeTab.value === '3') {
    return '还没有已下架的文章'
  }
  return '还没有文章，去写一篇吧'
})

// 编辑：进编辑器载入（guest 详情只开放已发布文章，编辑入口由行卡控制）
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
    loadCounts()
    return loadList()
  } catch (error: any) {
    showToast(error?.message || '操作失败，请稍后重试')
  }
}

// 删除：软删除，确认弹窗后刷新当前页
const removeRow = async (row: ArticleRowData) => {
  const ok = await confirmAction({
    title: '删除文章',
    message: `确定删除文章「${row.title}」吗？删除后不可恢复。`,
    confirmText: '删除',
    danger: true
  })
  if (!ok) {
    return
  }
  try {
    await apiFetch(`/api/post/article/${row.id}`, { method: 'DELETE' })
    loadCounts()
    return loadList()
  } catch (error: any) {
    showToast(error?.message || '删除失败，请稍后重试')
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
