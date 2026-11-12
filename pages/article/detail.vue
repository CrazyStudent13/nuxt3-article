<template>
  <div class="detail">
    <NuxtLink to="/" class="back">← 返回文章列表</NuxtLink>

    <template v-if="article.title || article.content">
      <div class="detail-layout">
        <article class="panel">
          <h1 class="title">{{ article.title || '无标题' }}</h1>

          <!-- 作者栏：头像 + 昵称 + 时间/阅读量 + 专栏入口 -->
          <div class="author-bar">
            <span class="avatar">
              <img v-if="avatarUrl" :src="avatarUrl" :alt="authorName" />
              <span v-else class="avatar-fallback">{{ authorName.slice(0, 1) }}</span>
            </span>
            <span class="author-info">
              <span class="name">{{ authorName }}</span>
              <span class="sub">
                <span v-if="publishLabel">发布于 {{ publishLabel }}</span>
                <span v-if="readLabel">{{ readLabel }} 阅读</span>
              </span>
            </span>
            <NuxtLink
              v-if="subject.title && article.subjectId"
              class="subject-badge"
              :to="{ path: '/column/detail', query: { id: String(article.subjectId) } }"
            >
              《{{ subject.title }}》
            </NuxtLink>
          </div>

          <img v-if="coverUrl" class="cover" :src="coverUrl" :alt="article.title" />

          <div class="panel-body">
            <MdViewer :value="article.content" />
          </div>
        </article>

        <!-- 右侧目录：文章有标题大纲时才出现 -->
        <aside v-if="hasToc" class="toc-aside">
          <ArticleToc :content="article.content" />
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

const { data } = await useFetch<{ data?: ArticleDetail }>(
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
const { data: subjectRes } = await useFetch<{ data?: SubjectDetail }>(
  `${config.public.apiBase}/api/post/subject/guest/detail`,
  {
    query: computed(() => ({ id: String(article.value.subjectId || '') })),
    default: () => ({ data: null })
  }
)
const subject = computed(() => subjectRes.value?.data || {})

const authorName = computed(() => article.value.userInfo?.nickName || article.value.author || '佚名')
const avatarUrl = computed(() => toCoverUrl(config.public.apiBase, article.value.userInfo?.avatar))
const coverUrl = computed(() => toCoverUrl(config.public.apiBase, article.value.cover))
// publishTime 常为 null，回退 createTime
const publishLabel = computed(() => article.value.publishTime || article.value.createTime)
const readLabel = computed(() => (typeof article.value.readNum === 'number' ? String(article.value.readNum) : ''))

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
.back {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--color-text-3);
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
}

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

// 右侧目录：吸顶跟随，窄屏隐藏
.toc-aside {
  position: sticky;
  top: 76px;
  flex-shrink: 0;
  width: 240px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-1);
  margin-bottom: 16px;
}

.author-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);

  .avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #fff;
      background-image: var(--gradient-brand);
    }
  }

  .author-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sub {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 12px;
      color: var(--color-text-3);
    }
  }

  .subject-badge {
    flex-shrink: 0;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 4px 12px;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary-light);
    font-size: 12px;
    color: var(--color-primary);
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
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

  .subject-badge {
    display: none;
  }
}
</style>
