<!-- 创作者中心-专栏管理：标题搜索 + 新建/编辑专栏（弹窗）+ 行卡列表 -->
<template>
  <div class="creator-column">
    <div class="feed-panel">
      <div class="feed-header">
        <span class="feed-title">专栏</span>
        <div class="header-tools">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
            </svg>
            <input v-model="keyword" type="search" placeholder="请输入标题关键字" />
          </div>
          <button class="new-btn" type="button" @click="openCreate">新建专栏</button>
        </div>
      </div>

      <div v-if="rows.length" class="row-list">
        <CreatorColumnRow
          v-for="row in rows"
          :key="row.id"
          :column-info="row"
          @view="goView(row)"
          @edit="openEdit(row)"
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

    <!-- 新建/编辑专栏弹窗：保存成功后刷新列表 -->
    <CreatorColumnEditModal v-if="editOpen" :column="editingColumn" @close="editOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'creator'
})

// 管理端专栏列表返回字段（articleCount 为该专栏下文章数）
type ColumnRowData = {
  id: number
  title?: string
  desc?: string
  cover?: string
  createTime?: string
  articleCount?: number
}

const { user, isLoggedIn } = useUser()

const PAGE_SIZE = 20

const keyword = ref('')
const searchKeyword = ref('')
const rows = ref<ColumnRowData[]>([])
const total = ref(0)
const pageNum = ref(1)
const loading = ref(false)
const loadError = ref('')
const finished = computed(() => rows.value.length >= total.value)

// 拉取当前用户的专栏列表（前端固定带 userId，只管自己的专栏）
const loadList = async (reset = true) => {
  if (!user.value) {
    return
  }
  loading.value = true
  if (reset) {
    loadError.value = ''
  }
  try {
    const res = await apiFetch<{ list?: ColumnRowData[]; total?: number }>('/api/post/subject/list', {
      query: {
        userId: user.value.userId,
        pageNum: pageNum.value,
        pageSize: PAGE_SIZE,
        orderByColumn: 'createTime',
        isAsc: 'descending',
        ...(searchKeyword.value ? { title: searchKeyword.value } : {})
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

// 登录态就绪后拉取（布局侧守卫登录后才渲染本页）
watch(
  isLoggedIn,
  (val) => {
    if (val) {
      loadList(true)
    }
  },
  { immediate: true }
)

const emptyText = computed(() => {
  if (loadError.value) {
    return loadError.value
  }
  if (searchKeyword.value) {
    return `没有找到标题包含「${searchKeyword.value}」的专栏`
  }
  return '还没有专栏，创建一个把相关文章整理起来吧'
})

// ---------- 新建 / 编辑弹窗 ----------
const editOpen = ref(false)
const editingColumn = ref<ColumnRowData | null>(null)

const openCreate = () => {
  editingColumn.value = null
  editOpen.value = true
}

const openEdit = (row: ColumnRowData) => {
  editingColumn.value = row
  editOpen.value = true
}

const onSaved = () => {
  editOpen.value = false
  pageNum.value = 1
  return loadList(true)
}

// 查看公开专栏详情
const goView = (row: ColumnRowData) => {
  return navigateTo({ path: '/column/detail', query: { id: String(row.id) } })
}

// 删除：软删除，二次确认后从列表移除（前端只对自己的专栏展示该按钮）
const removeRow = async (row: ColumnRowData) => {
  if (!window.confirm(`确定删除专栏「${row.title}」吗？删除后不可恢复。`)) {
    return
  }
  try {
    await apiFetch(`/api/post/subject/${row.id}`, { method: 'DELETE' })
    rows.value = rows.value.filter((item) => item.id !== row.id)
    total.value = Math.max(0, total.value - 1)
  } catch (error: any) {
    alert(error?.message || '删除失败，请稍后重试')
  }
}
</script>

<style lang="less" scoped>
.header-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

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

.new-btn {
  padding: 6px 16px;
  border: 0;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-hover);
  }
}

@media (max-width: 640px) {
  .search-box {
    width: 150px;
  }
}
</style>
