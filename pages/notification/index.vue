<!-- 通知中心页：左侧四分类竖栏（评论/赞和收藏/新增粉丝/系统通知）+ 右侧列表；系统通知接 /api/system/notice/list（Markdown 内容超 3 行收起、就地展开，分页），其余分类后端未建占位空态；tab 状态同步 ?query，全站唯一通知入口（头部铃铛同款分类） -->
<template>
  <div class="notification-page">
    <div class="notice-panel">
      <!-- 左侧分类菜单 -->
      <aside class="notice-menu">
        <button
          v-for="cat in noticeCats"
          :key="cat.key"
          class="menu-item"
          :class="{ active: activeTab === cat.key }"
          type="button"
          @click="switchCat(cat.key)"
        >
          <span class="menu-icon" v-html="cat.icon" />
          {{ cat.label }}
        </button>
      </aside>

      <!-- 右侧内容区 -->
      <section class="notice-main">
        <!-- 系统通知：真实列表 -->
        <template v-if="activeTab === 'system'">
          <template v-if="notices.length">
            <article v-for="item in notices" :key="item.noticeId" class="notice-item">
              <div class="notice-head">
                <span class="notice-badge" :class="item.noticeType === '2' ? 'is-announce' : 'is-info'">
                  {{ item.noticeType === '2' ? '公告' : '通知' }}
                </span>
                <h3 class="notice-title">{{ item.noticeTitle || '系统消息' }}</h3>
                <time class="notice-time">{{ formatTime(item.createTime) }}</time>
              </div>
              <div
                v-if="item.noticeContent"
                class="notice-body"
                :class="{ collapsed: !expandedMap[item.noticeId] }"
                :data-nid="item.noticeId"
              >
                <MdViewer :value="item.noticeContent" />
              </div>
              <button
                v-if="overflowMap[item.noticeId]"
                class="notice-toggle"
                type="button"
                @click="toggleExpand(item.noticeId)"
              >
                {{ expandedMap[item.noticeId] ? '收起' : '展开' }}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ flip: expandedMap[item.noticeId] }" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </article>
            <CommonPagination v-model:page="page" :total="total" :page-size="PAGE_SIZE" />
          </template>
          <CommonEmptyState v-else-if="loading" text="加载中…" />
          <CommonEmptyState v-else-if="errorMsg">{{ errorMsg }}</CommonEmptyState>
          <CommonEmptyState v-else>暂无系统通知</CommonEmptyState>
        </template>

        <!-- 其余分类：互动功能未建，占位空态 -->
        <CommonEmptyState v-else>{{ activeCat.label }}功能即将上线，敬请期待</CommonEmptyState>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface NoticeItem {
  noticeId: number
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
  createTime: string
}

// ---------- 分类清单：与头部铃铛下拉一致（私信工作量大暂缓），icon 为全站规范的内联描边 SVG ----------
const noticeCats = [
  {
    key: 'comment',
    label: '评论',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
  },
  {
    key: 'like',
    label: '赞和收藏',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  },
  {
    key: 'follower',
    label: '新增粉丝',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
  },
  {
    key: 'system',
    label: '系统通知',
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
  }
] as const

type NoticeTab = (typeof noticeCats)[number]['key']

const route = useRoute()
const { openLogin } = useAuthModal()

// ---------- tab 状态：?tab= 同步（非法值回落系统通知），铃铛下拉可带分类直达 ----------
const normalizeTab = (value: unknown): NoticeTab => {
  const key = String(value || 'system')
  return (noticeCats.find((cat) => cat.key === key)?.key || 'system') as NoticeTab
}

const activeTab = ref<NoticeTab>(normalizeTab(route.query.tab))
const activeCat = computed(() => noticeCats.find((cat) => cat.key === activeTab.value) || noticeCats[noticeCats.length - 1]!)

watch(
  () => route.query.tab,
  (value) => {
    activeTab.value = normalizeTab(value)
  }
)

const switchCat = (key: NoticeTab) => {
  if (key === activeTab.value) {
    return
  }
  return navigateTo({ path: '/notification', query: key === 'system' ? {} : { tab: key } })
}

// ---------- 系统通知列表：分页拉取，status='1'（已关闭）前端过滤；403 等业务错误降级为空态提示 ----------
const PAGE_SIZE = 10
const page = ref(1)
const total = ref(0)
const notices = ref<NoticeItem[]>([])
const loading = ref(false)
const errorMsg = ref('')

const loadNotices = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await apiFetch<{ list?: NoticeItem[]; total?: number }>('/api/system/notice/list', {
      query: { pageNum: page.value, pageSize: PAGE_SIZE }
    })
    notices.value = (res.data?.list || []).filter((item) => item.status === '0')
    total.value = res.data?.total || 0
  } catch (error: any) {
    notices.value = []
    total.value = 0
    errorMsg.value = error?.message || '通知加载失败'
  } finally {
    loading.value = false
  }
  await nextTick()
  measureOverflow()
}

watch(
  activeTab,
  (tab) => {
    if (tab === 'system') {
      page.value = 1
      loadNotices()
    }
  },
  { immediate: true }
)

watch(page, loadNotices)

// ---------- 内容展开/收起：Markdown 长文默认收起（72px），渲染后量 scrollHeight 决定是否出「展开」按钮 ----------
const expandedMap = ref<Record<number, boolean>>({})
const overflowMap = ref<Record<number, boolean>>({})

const COLLAPSED_HEIGHT = 72

const measureOverflow = () => {
  const map: Record<number, boolean> = {}
  document.querySelectorAll<HTMLElement>('.notice-body[data-nid]').forEach((el) => {
    const nid = Number(el.dataset.nid)
    if (Number.isFinite(nid)) {
      map[nid] = el.scrollHeight > COLLAPSED_HEIGHT + 2
    }
  })
  overflowMap.value = map
}

const toggleExpand = (noticeId: number) => {
  expandedMap.value = { ...expandedMap.value, [noticeId]: !expandedMap.value[noticeId] }
}

const formatTime = (value?: string) => {
  if (!value) {
    return ''
  }
  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')
  return formatted === 'Invalid Date' ? '' : formatted
}

// ---------- 登录守卫：未登录弹登录框并回首页（与个人空间页同策略） ----------
onMounted(() => {
  if (!getToken()) {
    openLogin()
    return navigateTo('/')
  }
})
</script>

<style lang="less" scoped>
// 宽度交给 default 布局的 app-main（1100px 容器，与头部 logo/退出同缘对齐），页面只做垂直微调
// 高度撑满视口剩余空间：100vh - 头部61 - app-main 上下padding 64 - 页面自身 padding 12
.notification-page {
  min-height: calc(100vh - 137px);
  display: flex;
  flex-direction: column;
  padding: 4px 0 8px;
}

.notice-panel {
  flex: 1;
  // 左菜单与右列表两张独立卡片、中间 16px 间距——对齐站点「多卡片+间距」的模块语言；stretch 等高拉满
  display: flex;
  align-items: stretch;
  gap: 16px;
}

// 左侧分类竖栏（与设置页 200px 菜单同规格），高度贴合菜单内容
.notice-menu {
  flex-shrink: 0;
  width: 200px;
  padding: 12px 8px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: transparent;
    font-size: 14px;
    color: var(--color-text-2);
    text-align: left;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    .menu-icon {
      display: flex;
      align-items: center;
      color: var(--color-text-3);
      transition: color 0.2s ease;
    }

    &:hover {
      color: var(--color-text-1);
      background-color: var(--color-bg);
    }

    &.active {
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      font-weight: 500;

      .menu-icon {
        color: var(--color-primary);
      }
    }
  }
}

.notice-main {
  flex: 1;
  min-width: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.notice-item {
  padding: 16px 20px;

  & + .notice-item {
    border-top: 1px solid var(--color-border-light);
  }
}

.notice-head {
  display: flex;
  align-items: center;
  gap: 8px;

  .notice-badge {
    flex-shrink: 0;
    padding: 1px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    line-height: 18px;

    // 通知=品牌蓝浅底；公告=橙色浅底
    &.is-info {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
    }

    &.is-announce {
      background-color: rgba(230, 132, 41, 0.12);
      color: #e68429;
    }
  }

  .notice-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .notice-time {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--color-text-3);
  }
}

.notice-body {
  margin-top: 10px;

  // 卡片内 Markdown 不带纸面底色（github 主题深底色比卡片更深会形成色块），文字配色仍随站点主题
  :deep(.markdown-body) {
    background-color: transparent;
  }

  // 收起态：限高 + 底部渐隐提示还有内容
  &.collapsed {
    max-height: 72px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
  }
}

.notice-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 0;
  border: 0;
  background-color: transparent;
  font-size: 13px;
  color: var(--color-primary);
  cursor: pointer;

  svg {
    transition: transform 0.2s ease;

    &.flip {
      transform: rotate(180deg);
    }
  }
}

// 分页器与最后一条目之间的间距（条目自带 border-top 充当分隔线）
.notice-main :deep(.pager) {
  padding: 14px 0 16px;
}

// 窄屏：左菜单变横向滚动条
@media (max-width: 768px) {
  .notice-panel {
    flex-direction: column;
  }

  .notice-menu {
    width: 100%;
    display: flex;
    gap: 4px;
    overflow-x: auto;
    padding: 8px;

    .menu-item {
      width: auto;
      flex-shrink: 0;
      white-space: nowrap;
    }
  }
}
</style>
