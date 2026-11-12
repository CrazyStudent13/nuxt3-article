<template>
  <div class="detail">
    <template v-if="article.title || article.content">
      <div class="detail-layout">
        <article class="panel">
          <h1 class="title">{{ article.title || '无标题' }}</h1>

          <!-- 元信息行：作者 时间 阅读 专栏，编辑入口靠右（仅作者本人可见），掘金式单行 -->
          <div class="meta-line">
            <span class="meta-author">{{ authorName }}</span>
            <span v-if="publishLabel" class="meta-item">{{ publishLabel }}</span>
            <span v-if="readLabel" class="meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {{ readLabel }} 阅读
            </span>
            <NuxtLink
              v-if="subject.title && article.subjectId"
              class="meta-subject"
              target="_blank"
              :to="{ path: '/column/detail', query: { id: String(article.subjectId) } }"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {{ subject.title }}
            </NuxtLink>
            <span v-if="canEdit" class="meta-actions">
              <button class="edit-btn" type="button" @click="goEdit">编辑</button>
              <button class="del-btn" type="button" :disabled="deleting" @click="removeArticle">
                {{ deleting ? '删除中…' : '删除' }}
              </button>
            </span>
          </div>

          <img v-if="coverUrl" class="cover" :src="coverUrl" :alt="article.title" />

          <div class="panel-body">
            <MdViewer :value="article.content" />
          </div>
        </article>

        <!-- 右侧信息栏：作者卡 + 目录 + 相关推荐（吸顶跟随，窄屏隐藏） -->
        <aside v-if="hasToc || article.userInfo?.userId || article.subjectId" class="toc-aside">
          <ArticleAuthorCard v-if="article.userInfo?.userId" :author="article.userInfo" />
          <ArticleToc v-if="hasToc" :content="article.content" />
          <ArticleRelatedCard :subject-id="article.subjectId" :exclude-id="article.id" />
        </aside>
      </div>
    </template>
    <div v-else class="panel panel-empty">
      <p class="feed-empty">文章不存在或已下架</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

type ArticleDetail = {
  id?: number | string
  title?: string
  desc?: string
  subjectId?: number | string
  cover?: string
  readNum?: number
  publishTime?: string | null
  createTime?: string
  author?: string
  content?: string
  userInfo?: {
    userId?: number
    nickName?: string
    avatar?: string
  }
}

type SubjectDetail = {
  title?: string
}

const config = useRuntimeConfig()
const route = useRoute()
const articleId = computed(() => (route.query.id as string) || '')

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const formatted = dayjs(value).format('YYYY-MM-DD HH:mm')
  return formatted === 'Invalid Date' ? '' : formatted
}

const { data } = await useFetch<{ data?: ArticleDetail | null }>(
  `${config.public.apiBase}/api/post/article/guest/detail`,
  {
    query: {
      id: articleId
    },
    default: () => ({ data: null })
  }
)

const article = computed(() => {
  const model = data.value?.data || {}

  return {
    ...model,
    title: model.title || '',
    content: model.content || '',
    publishTime: formatDateTime(model.publishTime),
    createTime: formatDateTime(model.createTime)
  }
})

// 专栏信息：文章带 subjectId 时取标题做入口徽标（拿不到标题则不展示）
const { data: subjectRes } = await useFetch<{ data?: SubjectDetail | null }>(
  `${config.public.apiBase}/api/post/subject/guest/detail`,
  {
    query: computed(() => ({ id: String(article.value.subjectId || '') })),
    default: () => ({ data: null })
  }
)
const subject = computed(() => subjectRes.value?.data || {})

const authorName = computed(() => article.value.userInfo?.nickName || article.value.author || '佚名')
const coverUrl = computed(() => toCoverUrl(config.public.apiBase, article.value.cover))
// publishTime 常为 null，回退 createTime
const publishLabel = computed(() => article.value.publishTime || article.value.createTime)
const readLabel = computed(() => (typeof article.value.readNum === 'number' ? String(article.value.readNum) : ''))

// 编辑/删除入口：仅当前登录用户是文章作者时可见
const { user, fetchUserInfo } = useUser()
const canEdit = computed(
  () => !!user.value?.userId && !!article.value.userInfo?.userId && user.value.userId === article.value.userInfo.userId
)
const goEdit = () => navigateTo({ path: '/editor/new', query: { id: String(article.value.id || '') } })

// 删除后回首页（需 post:article:remove 权限，失败透传后端 msg）
const deleting = ref(false)
const removeArticle = async () => {
  if (!window.confirm(`确定删除「${article.value.title || '无标题'}」吗？删除后不可恢复。`)) {
    return
  }
  deleting.value = true
  try {
    await apiFetch(`/api/post/article/${article.value.id}`, { method: 'DELETE' })
    return navigateTo('/')
  } catch (error: any) {
    window.alert(error?.message || '删除失败，请稍后重试')
  } finally {
    deleting.value = false
  }
}

// 登录态恢复（编辑按钮依赖 user.userId 比对）
onMounted(() => {
  if (getToken() && !user.value) {
    fetchUserInfo().catch(() => {})
  }
})

// 右侧目录开关：文章带标题大纲才展示
const hasToc = computed(() => extractMarkdownHeadings(article.value.content).length > 0)

useSeoMeta({
  title: () => (article.value.title ? `${article.value.title} - 游戏速递` : '文章详情 - 游戏速递'),
  ogTitle: () => article.value.title || '文章详情',
  description: () => article.value.desc || article.value.title || '游戏速递的文章详情页。',
  ogImage: () => coverUrl.value || undefined
})
</script>

<style lang="less" scoped>
.detail-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
}

.panel {
  flex: 1;
  min-width: 0;
  max-width: 820px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 36px 44px;

  &.panel-empty {
    padding: 0;
  }
}

// 右侧信息栏：作者卡 + 目录，吸顶跟随，窄屏隐藏
.toc-aside {
  position: sticky;
  top: 76px;
  flex-shrink: 0;
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-1);
  margin-bottom: 16px;
}

// 掘金式元信息行：纯文本+小图标，头像与统计归右侧作者卡
.meta-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding-bottom: 18px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 13px;
  color: var(--color-text-2);

  .meta-author {
    font-weight: 600;
    color: var(--color-text-1);
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--color-text-3);
  }

  .meta-subject {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-3);
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }

  .meta-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;

    .edit-btn,
    .del-btn {
      padding: 2px 4px;
      border: 0;
      background-color: transparent;
      font-size: 13px;
      cursor: pointer;
      transition: opacity 0.2s ease;

      &:hover:not(:disabled) {
        opacity: 0.75;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .edit-btn {
      color: var(--color-primary);
    }

    .del-btn {
      color: #d1242f;
    }
  }
}

.cover {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
}

@media (max-width: 1000px) {
  .toc-aside {
    display: none;
  }
}

@media (max-width: 640px) {
  .panel {
    padding: 24px 20px;
  }

  .title {
    font-size: 22px;
  }

  .meta-line .meta-subject {
    display: none;
  }
}
</style>
