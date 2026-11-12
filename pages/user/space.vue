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
          <dl v-if="isSelf" class="profile-fields">
            <div class="field-row"><dt>账号</dt><dd>{{ user?.userName }}</dd></div>
            <div class="field-row"><dt>昵称</dt><dd>{{ user?.nickName || '未设置' }}</dd></div>
            <div class="field-row"><dt>性别</dt><dd>{{ sexLabel }}</dd></div>
            <div class="field-row"><dt>注册时间</dt><dd>{{ registerTime }}</dd></div>
            <div class="field-row"><dt>个性签名</dt><dd>{{ signature }}</dd></div>
          </dl>
          <!-- 他人空间：昵称 + 公开统计（guest 接口仅有昵称/头像/文章数据） -->
          <div v-else class="profile-stats">
            <span class="stat"><b>{{ spaceStats.total }}</b> 文章</span>
            <span class="stat"><b>{{ spaceStats.reads }}</b> 阅读</span>
            <span class="stat"><b>{{ spaceStats.likes }}</b> 获赞</span>
          </div>
        </div>

        <div v-if="isSelf" class="profile-actions">
          <button class="btn ghost" type="button" @click="goSettings">编辑资料</button>
        </div>
      </div>
    </div>

    <!-- 内容卡：文章列表（他人空间只有文章，点赞/通知仅在本人空间出现） -->
    <div class="feed-panel content-panel">
      <div v-if="isSelf" class="tab-bar">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="tab-item"
          :class="{ active: activeTab === t.key }"
          type="button"
          @click="activeTab = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <template v-if="isSelf ? activeTab === 'article' : true">
        <!-- 排序：最新 / 热门（掘金式胶囊切换，排序走后端参数） -->
        <div class="sort-bar">
          <button
            v-for="s in sortOptions"
            :key="s.key"
            class="sort-pill"
            :class="{ active: activeSort === s.key }"
            type="button"
            @click="switchSort(s.key)"
          >
            {{ s.label }}
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
        <p v-else class="feed-empty">{{ articlesLoading ? '加载中…' : isSelf ? '还没有发布过文章' : 'TA 还没有发布过文章' }}</p>
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

// ---------- 文章列表（本人/他人共用，排序走后端参数） ----------
const tabs = [
  { key: 'article', label: '我的文章' },
  { key: 'like', label: '点赞' },
  { key: 'notice', label: '通知' }
]
const activeTab = ref('article')
const articles = ref<any[]>([])
const articlesLoading = ref(true)

const sortOptions = [
  { key: 'new', label: '最新', orderByColumn: 'createTime', isAsc: 'descending' },
  { key: 'hot', label: '热门', orderByColumn: 'readNum', isAsc: 'descending' }
]
const activeSort = ref('new')

const loadMyArticles = async () => {
  const userId = targetUserId.value
  if (!userId) {
    return
  }
  const opt = sortOptions.find((s) => s.key === activeSort.value)
  articlesLoading.value = true
  try {
    const res = await apiFetch<{ list?: any[]; total?: number }>('/api/post/article/guest/list', {
      query: {
        userId,
        pageNum: 1,
        pageSize: 50,
        ...(opt ? { orderByColumn: opt.orderByColumn, isAsc: opt.isAsc } : {})
      }
    })
    const list = res.data?.list || []
    articles.value = list
    // 他人空间：从文章携带的 userInfo 取头像昵称，从列表算公开统计
    if (!isSelf.value) {
      const info = list[0]?.userInfo
      if (info?.nickName || info?.avatar) {
        spaceProfile.value = { nickName: info.nickName, avatar: info.avatar }
      }
      spaceStats.value = {
        total: res.data?.total || 0,
        reads: list.reduce((sum, item) => sum + (item.readNum || 0), 0),
        likes: list.reduce((sum, item) => sum + (item.likeNum || 0), 0)
      }
    }
  } catch {
    articles.value = []
  } finally {
    articlesLoading.value = false
  }
}

const switchSort = (key: string) => {
  if (activeSort.value === key) {
    return
  }
  activeSort.value = key
  loadMyArticles()
}

const goArticle = (item: any) => {
  return navigateTo({
    path: '/article/detail',
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

// 排序胶囊（掘金式：最新 / 热门）
.sort-bar {
  display: flex;
  gap: 10px;
  padding: 12px 20px 0;

  .sort-pill {
    padding: 4px 14px;
    border: 0;
    border-radius: var(--radius-full);
    background-color: var(--color-bg);
    font-size: 13px;
    color: var(--color-text-2);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      color: var(--color-text-1);
    }

    &.active {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 500;
    }
  }
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
