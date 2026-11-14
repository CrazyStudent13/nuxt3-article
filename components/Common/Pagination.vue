<!-- 通用分页器：掘金式 ‹ 1 2 … n › 页码按钮组，页数 ≤1 时整体隐藏；配合管理列表页使用 -->
<template>
  <nav v-if="pageCount > 1" class="pager" aria-label="分页">
    <button class="pager-btn" type="button" :disabled="page <= 1" aria-label="上一页" @click="go(page - 1)">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <template v-for="(item, index) in items" :key="`${item}-${index}`">
      <span v-if="item === '...'" class="pager-ellipsis">…</span>
      <button v-else class="pager-btn page-num" type="button" :class="{ active: item === page }" @click="go(item)">
        {{ item }}
      </button>
    </template>

    <button class="pager-btn" type="button" :disabled="page >= pageCount" aria-label="下一页" @click="go(page + 1)">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  page: number
  total: number
  pageSize?: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const size = computed(() => props.pageSize || 20)
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / size.value)))

// 页码序列：总页数 ≤7 全显，否则保留首尾 + 当前页 ±1，间隙用省略号
const items = computed<(number | '...')[]>(() => {
  const count = pageCount.value
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1)
  }
  const wanted = new Set(
    [1, count, props.page - 1, props.page, props.page + 1].filter((p) => p >= 1 && p <= count)
  )
  const sorted = [...wanted].sort((a, b) => a - b)
  const out: (number | '...')[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) {
      out.push('...')
    }
    out.push(p)
    prev = p
  }
  return out
})

const go = (target: number) => {
  if (target < 1 || target > pageCount.value || target === props.page) {
    return
  }
  emit('update:page', target)
}
</script>

<style lang="less" scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;

  .pager-btn {
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    font-size: 13px;
    color: var(--color-text-2);
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover:not(:disabled):not(.active) {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &.active {
      border-color: var(--color-primary);
      background-color: var(--color-primary);
      color: #fff;
      cursor: default;
    }
  }

  .pager-ellipsis {
    padding: 0 2px;
    font-size: 13px;
    color: var(--color-text-3);
  }
}
</style>
