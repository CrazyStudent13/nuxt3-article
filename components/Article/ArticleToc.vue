<!-- 文章详情页右侧目录卡片：提取 Markdown 标题大纲生成目录，支持点击滚动定位、滚动跟随高亮、收起/展开 -->
<template>
  <nav class="toc-card">
    <div class="toc-head">
      <span class="toc-title">目录</span>
      <button class="toc-toggle" type="button" @click="collapsed = !collapsed">
        {{ collapsed ? '展开' : '收起' }}
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="{ flip: collapsed }"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>

    <div v-show="!collapsed" class="toc-list-wrap">
      <button
        v-for="(item, index) in items"
        :key="index"
        class="toc-item"
        :class="[`lvl-${item.level}`, { active: index === activeIndex }]"
        :style="{ paddingLeft: `${(item.level - 1) * 14 + 4}px` }"
        type="button"
        @click="scrollTo(index)"
      >
        {{ item.text }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 文章目录：SSR 先按 Markdown 源码渲染大纲，挂载后以渲染出的 DOM 标题为准做校正
// （引用/列表里的标题等边角情况 Markdown 提取可能漏掉，以实际 DOM 对齐才能保证点击/高亮不错位）
const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: ''
  }
)

const items = ref(extractMarkdownHeadings(props.content))
const collapsed = ref(false)
const activeIndex = ref(0)

let headingEls: HTMLElement[] = []

const collect = () => {
  const body = document.querySelector('.detail .panel-body')
  if (!body) {
    return
  }
  const els = Array.from(body.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[]
  if (!els.length) {
    return
  }
  headingEls = els
  const domItems = els.map((el) => ({
    level: Number(el.tagName.slice(1)),
    text: (el.textContent || '').trim()
  }))
  const mdItems = extractMarkdownHeadings(props.content)
  const mismatch =
    domItems.length !== mdItems.length ||
    domItems.some((d, i) => d.level !== mdItems[i]?.level || d.text !== mdItems[i]?.text)
  if (mismatch) {
    items.value = domItems
  }
}

const scrollTo = (index: number) => {
  const el = headingEls[index]
  if (!el) {
    return
  }
  activeIndex.value = index
  const top = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top, behavior: 'smooth' })
}

// 滚动高亮：取视口顶部以上最近的标题；触底时强制点亮最后一项
// 直接在 scroll 回调里算（十几处 getBoundingClientRect 开销可忽略），不依赖 rAF
const onScroll = () => {
  if (!headingEls.length) {
    return
  }
  // 用 findLastIndex 避免下标访问（noUncheckedIndexedAccess 下 headingEls[i] 会报红）
  let idx = headingEls.findLastIndex((el) => el.getBoundingClientRect().top <= 80)
  if (idx < 0) {
    idx = 0
  }
  const doc = document.documentElement
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
    idx = headingEls.length - 1
  }
  activeIndex.value = idx
}

onMounted(() => {
  collect()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// 详情页路由复用同一组件实例（query 变化不重建），内容变了要重新采集
watch(
  () => props.content,
  async () => {
    activeIndex.value = 0
    await nextTick()
    collect()
    onScroll()
  }
)
</script>

<style lang="less" scoped>
.toc-card {
  padding: 14px 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
}

.toc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  .toc-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .toc-toggle {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 4px;
    border: 0;
    background-color: transparent;
    font-size: 12px;
    color: var(--color-text-3);
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
      color: var(--color-primary);
    }

    svg {
      transition: transform 0.2s ease;

      &.flip {
        transform: rotate(180deg);
      }
    }
  }
}

.toc-list-wrap {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.toc-item {
  display: block;
  width: 100%;
  padding: 5px 4px;
  border: 0;
  border-radius: var(--radius-sm);
  background-color: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: var(--color-text-2);
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-text-1);
  }

  &.active {
    color: var(--color-primary);
    font-weight: 600;
  }

  &.lvl-1 {
    font-weight: 600;
  }
}
</style>
