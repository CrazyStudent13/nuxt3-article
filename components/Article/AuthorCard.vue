<!-- 文章详情页右侧作者信息卡：头像 + 昵称 + 文章/阅读/获赞三栏统计（掘金式布局，暂无签名数据先省略） -->
<template>
  <div class="author-card">
    <div class="author-head">
      <NuxtLink
        class="author-link"
        :title="`查看 ${authorName} 的空间`"
        :to="{ path: '/user/space', query: { id: String(props.author.userId || '') } }"
      >
        <span class="avatar">
          <img v-if="avatarUrl" :src="avatarUrl" :alt="authorName" />
          <span v-else class="avatar-fallback">{{ authorName.slice(0, 1) }}</span>
        </span>
        <span class="name">{{ authorName }}</span>
      </NuxtLink>
    </div>

    <div class="author-stats">
      <div class="stat">
        <span class="num">{{ stats.total }}</span>
        <span class="label">文章</span>
      </div>
      <div class="stat">
        <span class="num">{{ stats.reads }}</span>
        <span class="label">阅读</span>
      </div>
      <div class="stat">
        <span class="num">{{ stats.likes }}</span>
        <span class="label">获赞</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AuthorInfo {
  userId?: number
  nickName?: string
  avatar?: string
}

const props = withDefaults(
  defineProps<{
    author?: AuthorInfo
  }>(),
  {
    author: () => ({})
  }
)

const config = useRuntimeConfig()
const authorName = computed(() => props.author.nickName || '佚名')
const avatarUrl = computed(() => toCoverUrl(config.public.apiBase, props.author.avatar))

// 统计数据来自 guest 文章列表按 userId 过滤：total 即文章数，readNum/likeNum 求和即累计阅读/获赞
// 站内规模小 pageSize 100 够用；父组件保证仅在有 userId 时渲染本卡片
const { data } = await useFetch<{ data?: { list?: Array<{ readNum?: number; likeNum?: number }>; total?: number } | null }>(`${config.public.apiBase}/api/post/article/guest/list`, {
  query: computed(() => ({ userId: props.author.userId, pageNum: 1, pageSize: 100 })),
  immediate: !!props.author.userId,
  default: () => ({ data: null })
})

const stats = computed(() => {
  const list = data.value?.data?.list || []
  return {
    total: data.value?.data?.total || 0,
    reads: list.reduce((sum, item) => sum + (item.readNum || 0), 0),
    likes: list.reduce((sum, item) => sum + (item.likeNum || 0), 0)
  }
})
</script>

<style lang="less" scoped>
.author-card {
  padding: 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.author-head {
  .author-link {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    flex-shrink: 0;
    width: 46px;
    height: 46px;
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
      font-size: 18px;
      color: #fff;
      background-image: var(--gradient-brand);
    }
  }

  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-1);
    transition: color 0.2s ease;
  }

  .author-link:hover .name {
    color: var(--color-primary);
  }
}

.author-stats {
  display: flex;
  margin-top: 14px;

  .stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .num {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
    }

    .label {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
}
</style>
