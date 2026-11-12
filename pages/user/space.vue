<template>
  <div class="space-page">
    <!-- 资料卡：纯展示，编辑入口在设置页 -->
    <div class="feed-panel profile-panel">
      <div class="profile-head">
        <span class="avatar-static">
          <img v-if="avatarUrl" class="avatar" :src="avatarUrl" alt="头像" />
          <span v-else class="avatar avatar-fallback">{{ avatarFallback }}</span>
        </span>

        <div class="profile-info">
          <h2 class="profile-name">{{ user?.nickName || user?.userName }}</h2>
          <dl class="profile-fields">
            <div class="field-row"><dt>账号</dt><dd>{{ user?.userName }}</dd></div>
            <div class="field-row"><dt>昵称</dt><dd>{{ user?.nickName || '未设置' }}</dd></div>
            <div class="field-row"><dt>性别</dt><dd>{{ sexLabel }}</dd></div>
            <div class="field-row"><dt>注册时间</dt><dd>{{ registerTime }}</dd></div>
            <div class="field-row"><dt>个性签名</dt><dd>{{ signature }}</dd></div>
          </dl>
        </div>

        <div class="profile-actions">
          <button class="btn ghost" type="button" @click="goSettings">编辑资料</button>
        </div>
      </div>
    </div>

    <!-- 内容卡：我的文章等 -->
    <div class="feed-panel content-panel">
      <div class="tab-bar">
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

      <template v-if="activeTab === 'article'">
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
        <p v-else class="feed-empty">{{ articlesLoading ? '加载中…' : '还没有发布过文章' }}</p>
      </template>
      <p v-else class="feed-empty">该功能暂未开放，敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const config = useRuntimeConfig()
const { user, fetchUserInfo } = useUser()
const { openLogin } = useAuthModal()

const signature = '我们暂时还没有开放签名系统，敬请期待！'

// ---------- 页面守卫：未登录弹登录框回首页；token 有效但 state 为空则恢复 ----------
onMounted(async () => {
  if (!getToken()) {
    openLogin()
    return navigateTo('/')
  }
  if (!user.value) {
    try {
      await fetchUserInfo()
    } catch {
      return navigateTo('/')
    }
  }
  loadMyArticles()
})

// ---------- 资料展示 ----------
const avatarUrl = computed(() => toCoverUrl(config.public.apiBase, user.value?.avatar))
const avatarFallback = computed(() => (user.value?.nickName || user.value?.userName || '用户').slice(0, 1))
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

// ---------- 我的文章 ----------
const tabs = [
  { key: 'article', label: '我的文章' },
  { key: 'like', label: '点赞' },
  { key: 'notice', label: '通知' }
]
const activeTab = ref('article')
const articles = ref<any[]>([])

const goArticle = (item: any) => {
  return navigateTo({
    path: '/article/detail',
    query: { id: item.id }
  })
}

// ---------- 我的文章：排序（最新/热门走后端白名单排序参数）+ 列表 ----------
// 编辑/删除入口在文章详情页 meta 行（仅作者可见），卡片保持纯浏览
const sortOptions = [
  { key: 'new', label: '最新', orderByColumn: 'createTime', isAsc: 'descending' },
  { key: 'hot', label: '热门', orderByColumn: 'readNum', isAsc: 'descending' }
]
const activeSort = ref('new')
const articlesLoading = ref(true)

const loadMyArticles = async () => {
  const userId = user.value?.userId
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
    articles.value = res.data?.list || []
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
