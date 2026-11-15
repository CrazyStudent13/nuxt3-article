<!-- 文章详情页左侧悬浮工具栏：点赞/评论/收藏/举报为占位（后端未就绪），分享=复制链接，回顶部按滚动距离显现 -->
<template>
  <div class="action-bar">
    <!-- 点赞：占位 -->
    <button class="action-btn" type="button" title="点赞" @click="showTip('点赞功能即将上线')">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      <span v-if="likeNum > 0" class="action-badge">{{ likeNum }}</span>
    </button>

    <!-- 评论：占位 -->
    <button class="action-btn" type="button" title="评论" @click="showTip('评论功能即将上线')">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span v-if="commentNum > 0" class="action-badge">{{ commentNum }}</span>
    </button>

    <!-- 收藏：占位 -->
    <button class="action-btn" type="button" title="收藏" @click="showTip('收藏功能即将上线')">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>

    <!-- 分享：复制文章链接 -->
    <button class="action-btn" type="button" title="分享" @click="shareLink">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>

    <!-- 举报：占位 -->
    <button class="action-btn" type="button" title="举报" @click="showTip('举报功能即将上线')">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </button>

    <!-- 回顶部：滚动超过一屏才出现 -->
    <button v-show="showTop" class="action-btn top-btn" type="button" title="回顶部" @click="backTop">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>

    <span v-if="tip" class="action-tip">{{ tip }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    likeNum?: number
    commentNum?: number
  }>(),
  {
    likeNum: 0,
    commentNum: 0
  }
)

// 占位功能的轻提示，2 秒自动消失
const tip = ref('')
let tipTimer: ReturnType<typeof setTimeout> | null = null
const showTip = (message: string) => {
  tip.value = message
  if (tipTimer) {
    clearTimeout(tipTimer)
  }
  tipTimer = setTimeout(() => (tip.value = ''), 2000)
}

// 分享：复制当前文章链接；clipboard 失败（页面未聚焦等）时降级 execCommand
const shareLink = async () => {
  const url = window.location.href
  const copyViaExec = () => {
    const temp = document.createElement('textarea')
    temp.value = url
    temp.style.position = 'fixed'
    temp.style.opacity = '0'
    document.body.appendChild(temp)
    temp.select()
    const ok = document.execCommand('copy')
    temp.remove()
    return ok
  }
  let copied = false
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url)
      copied = true
    } catch {
      copied = false
    }
  }
  if (!copied) {
    copied = copyViaExec()
  }
  showTip(copied ? '链接已复制，快去分享吧' : '复制失败，请手动复制地址栏链接')
}

// 滚动超过一屏显示回顶部；直接在 scroll 回调里算（同目录高亮逻辑，不依赖 rAF）
const showTop = ref(false)
const onScroll = () => {
  showTop.value = window.scrollY > window.innerHeight
}
const backTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (tipTimer) {
    clearTimeout(tipTimer)
  }
})
</script>

<style lang="less" scoped>
// 固定定位挂在正文列左侧空白区，不占布局宽度；视口不够宽时整体隐藏
.action-bar {
  position: fixed;
  left: calc(50% - 596px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  .action-btn {
    position: relative;
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    color: var(--color-text-2);
    cursor: pointer;
    transition:
      color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      color: var(--color-primary);
      box-shadow: 0 2px 10px rgba(79, 107, 255, 0.25);
    }

    .action-badge {
      position: absolute;
      top: -7px;
      right: -7px;
      min-width: 19px;
      height: 19px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      background-color: var(--color-bg);
      border: 1px solid var(--color-border-light);
      font-size: 11px;
      line-height: 1;
      color: var(--color-text-3);
    }
  }

  .top-btn {
    margin-top: 6px;
  }

  .action-tip {
    position: absolute;
    left: 50%;
    bottom: -34px;
    transform: translateX(-50%);
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    background-color: rgba(0, 0, 0, 0.75);
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    z-index: 10;
  }
}

@media (max-width: 1200px) {
  .action-bar {
    display: none;
  }
}
</style>
