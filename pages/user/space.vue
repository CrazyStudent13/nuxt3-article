<template>
  <div class="space-page">
    <!-- 资料卡：自己的空间展示完整字段，他人空间只展示公开信息 -->
    <div class="feed-panel profile-panel">
      <div class="profile-head">
        <span class="avatar-static">
          <img v-if="avatarUrl" class="avatar" :src="avatarUrl" alt="头像" />
          <span v-else class="avatar avatar-fallback">{{ avatarFallback }}</span>
        </span>

        <div class="profile-info">
          <h2 class="profile-name">{{ profileName }}</h2>
          <!-- 他人空间：公开统计（自己/他人同一套展示） -->
          <div v-if="!isSelf" class="profile-stats">
            <span class="stat"><b>{{ spaceStats.total }}</b> 文章</span>
            <span class="stat"><b>{{ spaceStats.reads }}</b> 阅读</span>
            <span class="stat"><b>{{ spaceStats.likes }}</b> 获赞</span>
          </div>
          <!-- 仅自己可见的账号信息；自己的文章数据未来走专门的个人数据入口 -->
          <dl v-if="isSelf" class="profile-fields">
            <div class="field-row"><dt>账号</dt><dd>{{ user?.userName }}</dd></div>
            <div class="field-row"><dt>昵称</dt><dd>{{ user?.nickName || '未设置' }}</dd></div>
            <div class="field-row"><dt>性别</dt><dd>{{ sexLabel }}</dd></div>
            <div class="field-row"><dt>注册时间</dt><dd>{{ registerTime }}</dd></div>
            <div class="field-row"><dt>个性签名</dt><dd>{{ signature }}</dd></div>
          </dl>
        </div>

        <div v-if="isSelf" class="profile-actions">
          <button class="btn ghost" type="button" @click="goSettings">编辑资料</button>
        </div>
      </div>
    </div>

    <!-- 内容卡：文章 / 专栏 tab 统一，点赞/通知仅本人空间占位 -->
    <div class="feed-panel content-panel">
      <div class="tab-bar">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="tab-item"
          :class="{ active: activeTab === t.key }"
          type="button"
          @click="switchTab(t.key)"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 文章 tab：标题搜索 + 时间正/倒序切换 -->
      <template v-if="activeTab === 'article'">
        <div class="list-toolbar">
          <input
            v-model="keyword"
            class="article-search"
            type="search"
            placeholder="搜索文章标题"
            maxlength="64"
            @input="onKeywordInput"
          />
          <button class="time-toggle" type="button" @click="toggleTimeOrder">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ flip: timeOrder === 'asc' }" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            {{ timeOrder === 'desc' ? '时间倒序' : '时间正序' }}
          </button>
        </div>

        <template v-if="articles.length">
          <article-card
            v-for="item in articles"
            :key="item.id || item.title"
            :card-info="item"
            @click="goArticle(item)"
          />
        </template>
        <p v-else class="feed-empty">
          {{
            articlesLoading
              ? '加载中…'
              : keyword
                ? `未找到与“${keyword}”相关的文章`
                : isSelf
                  ? '还没有发布过文章'
                  : 'TA 还没有发布过文章'
          }}
        </p>
      </template>

      <!-- 专栏 tab：复用 ColumnCard 行列表 -->
      <template v-else-if="activeTab === 'subject'">
        <div v-if="subjects.length" class="column-list">
          <column-card
            v-for="item in subjects"
            :key="item.id || item.title"
            :column-info="item"
            @click="goColumn(item)"
          />
        </div>
        <p v-else class="feed-empty">{{ subjectsLoading ? '加载中…' : isSelf ? '还没有创建专栏' : 'TA 还没有创建专栏' }}</p>
      </template>

      <p v-else class="feed-empty">该功能暂未开放，敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const config = useRuntimeConfig()
const route = useRoute()
const { user, fetchUserInfo } = useUser()
const { openLogin } = useAuthModal()

const signature = '我们暂时还没有开放签名系统，敬请期待！'

// ---------- 空间归属：带 ?id= 看他人空间（guest 公开数据），否则是自己的 ----------
const targetUserId = computed(() => {
  const raw = Number(route.query.id)
  if (Number.isFinite(raw) && raw > 0) {
    return raw
  }
  return user.value?.userId ?? null
})
const isSelf = computed(() => !!user.value?.userId && user.value.userId === targetUserId.value)

// 他人资料来自文章列表携带的 userInfo（后端仅公开昵称与头像）
const spaceProfile = ref<{ nickName?: string; avatar?: string }>({})
const spaceStats = ref({ total: 0, reads: 0, likes: 0 })

// ---------- 页面初始化：自己的空间要求登录，他人空间公开可看 ----------
const initSpace = () => {
  // 切换空间时清掉搜索词，避免上一位的过滤条件带到下一位
  keyword.value = ''
  loadMyArticles()
}

onMounted(() => {
  if (route.query.id && !isSelf.value) {
    initSpace()
    return
  }
  if (!getToken()) {
    openLogin()
    return navigateTo('/')
  }
  if (!user.value) {
    fetchUserInfo()
      .then(initSpace)
      .catch(() => {
        navigateTo('/')
      })
  } else {
    initSpace()
  }
})

// SPA 内切换不同用户空间时重载
watch(targetUserId, (val, old) => {
  if (val !== old && val) {
    initSpace()
  }
})

// ---------- 资料展示 ----------
const profileName = computed(() =>
  isSelf.value ? user.value?.nickName || user.value?.userName || '用户' : spaceProfile.value.nickName || `用户 ${targetUserId.value}`
)
const avatarUrl = computed(() => {
  const raw = isSelf.value ? user.value?.avatar : spaceProfile.value.avatar
  return toCoverUrl(config.public.apiBase, raw)
})
const avatarFallback = computed(() => profileName.value.slice(0, 1))
const sexLabel = computed(() => {
  const map: Record<string, string> = { '0': '男', '1': '女' }
  return map[user.value?.sex ?? ''] || '保密'
})
const registerTime = computed(() => {
  const value = user.value?.createTime
  if (!value) {
    return '未知'
  }
  const formatted = dayjs(value).format('YYYY-MM-DD')
  return formatted === 'Invalid Date' ? '未知' : formatted
})

const goSettings = () => {
  return navigateTo('/user/settings')
}

// ---------- 内容 tab：文章/专栏统一，点赞/通知仅本人占位 ----------
const tabs = computed(() => {
  const base = [
    { key: 'article', label: '文章' },
    { key: 'subject', label: '专栏' }
  ]
  return isSelf.value ? [...base, { key: 'like', label: '点赞' }, { key: 'notice', label: '通知' }] : base
})
const activeTab = ref('article')
const articles = ref<any[]>([])
const articlesLoading = ref(true)

// ---------- 文章列表：标题搜索（后端 LIKE）+ 时间正/倒序（后端排序参数），输入 400ms 防抖 ----------
const keyword = ref('')
const timeOrder = ref<'desc' | 'asc'>('desc')
let keywordTimer: ReturnType<typeof setTimeout> | null = null

const loadMyArticles = async () => {
  const userId = targetUserId.value
  if (!userId) {
    return
  }
  articlesLoading.value = true
  try {
    const res = await apiFetch<{ list?: any[]; total?: number }>('/api/post/article/guest/list', {
      query: {
        userId,
        pageNum: 1,
        pageSize: 50,
        orderByColumn: 'createTime',
        isAsc: timeOrder.value === 'desc' ? 'descending' : 'ascending',
        ...(keyword.value.trim() ? { title: keyword.value.trim() } : {})
      }
    })
    const list = res.data?.list || []
    articles.value = list
    // 公开统计（自己/他人同一套）+ 他人资料从文章携带的 userInfo 取
    if (!isSelf.value) {
      const info = list[0]?.userInfo
      if (info?.nickName || info?.avatar) {
        spaceProfile.value = { nickName: info.nickName, avatar: info.avatar }
      }
    }
    spaceStats.value = {
      total: res.data?.total || 0,
      reads: list.reduce((sum, item) => sum + (item.readNum || 0), 0),
      likes: list.reduce((sum, item) => sum + (item.likeNum || 0), 0)
    }
  } catch {
    articles.value = []
  } finally {
    articlesLoading.value = false
  }
}

const onKeywordInput = () => {
  if (keywordTimer) {
    clearTimeout(keywordTimer)
  }
  keywordTimer = setTimeout(() => loadMyArticles(), 400)
}

const toggleTimeOrder = () => {
  timeOrder.value = timeOrder.value === 'desc' ? 'asc' : 'desc'
  loadMyArticles()
}

// ---------- 专栏 tab：guest subject list 原生支持 userId 过滤，首次进入 tab 才拉取 ----------
const subjects = ref<any[]>([])
const subjectsLoading = ref(false)
const subjectsLoaded = ref(false)

const loadMySubjects = async () => {
  const userId = targetUserId.value
  if (!userId) {
    return
  }
  subjectsLoading.value = true
  try {
    const res = await apiFetch<{ list?: any[]; total?: number }>('/api/post/subject/guest/list', {
      query: { userId, pageNum: 1, pageSize: 50 }
    })
    subjects.value = res.data?.list || []
  } catch {
    subjects.value = []
  } finally {
    subjectsLoading.value = false
    subjectsLoaded.value = true
  }
}

const switchTab = (key: string) => {
  if (activeTab.value === key) {
    return
  }
  activeTab.value = key
  if (key === 'subject' && !subjectsLoaded.value) {
    loadMySubjects()
  }
}

const goArticle = (item: any) => {
  return navigateTo({
    path: '/article/detail',
    query: { id: item.id }
  })
}

const goColumn = (item: any) => {
  return navigateTo({
    path: '/column/detail',
    query: { id: item.id }
  })
}
</script>

<style lang="less" scoped>
.space-page {
  padding: 4px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-panel {
  padding: 24px;
}

.profile-head {
  display: flex;
  gap: 20px;
  align-items: flex-start;

  .avatar-static {
    flex-shrink: 0;
    line-height: 0;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-full);
    object-fit: cover;
    background-color: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;

    &.avatar-fallback {
      background-image: var(--gradient-brand);
      color: #fff;
      line-height: 64px;
      text-align: center;
    }
  }

  .profile-info {
    flex: 1;
    min-width: 0;

    .profile-name {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-text-1);
      margin-bottom: 10px;
    }

    .profile-fields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px 24px;
      margin: 0;

      .field-row {
        display: flex;
        gap: 8px;
        font-size: 13px;
        line-height: 22px;

        dt {
          flex-shrink: 0;
          color: var(--color-text-3);

          &::after {
            content: '：';
          }
        }

        dd {
          margin: 0;
          color: var(--color-text-1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .profile-stats {
      display: flex;
      gap: 24px;
      font-size: 13px;
      color: var(--color-text-2);

      .stat b {
        font-size: 16px;
        color: var(--color-text-1);
        margin-right: 4px;
      }
    }
  }

  .profile-actions {
    flex-shrink: 0;

    .btn.ghost {
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      border: 1px solid var(--color-border);
      background-color: var(--color-surface);
      color: var(--color-text-2);
      cursor: pointer;
      transition:
        border-color 0.2s ease,
        color 0.2s ease;

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
    }
  }
}

// 文章列表工具条：标题搜索 + 时间正/倒序切换
.list-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 0;

  .article-search {
    flex: 0 1 280px;
    padding: 6px 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-full);
    background-color: var(--color-bg);
    font-size: 13px;
    color: var(--color-text-1);
    outline: none;
    transition: border-color 0.2s ease;

    &::placeholder {
      color: var(--color-text-3);
    }

    &:focus {
      border-color: var(--color-primary);
    }
  }

  .time-toggle {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    font-size: 13px;
    color: var(--color-text-2);
    cursor: pointer;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    svg {
      transition: transform 0.2s ease;

      &.flip {
        transform: rotate(180deg);
      }
    }
  }
}

// 专栏行列表容器（ColumnCard 自带行分隔线）
.column-list {
  overflow: hidden;
}

// 内容卡
.content-panel {
  min-height: 320px;

  .tab-bar {
    display: flex;
    gap: 4px;
    padding: 8px 20px 0;
    border-bottom: 1px solid var(--color-border-light);

    .tab-item {
      padding: 10px 16px;
      border: 0;
      background-color: transparent;
      font-size: 14px;
      color: var(--color-text-2);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition:
        color 0.2s ease,
        border-color 0.2s ease;

      &:hover {
        color: var(--color-text-1);
      }

      &.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
        font-weight: 500;
      }
    }
  }

  .feed-empty {
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
