<!-- 全局确认弹窗：Element MessageBox 同款形态（标题/正文/取消/确定），配合 composables/useConfirm 的 confirmAction() 使用，挂载在 app.vue -->
<template>
  <Teleport to="body">
    <div v-if="state.open" class="confirm-overlay" @click.self="handleCancel">
      <div class="confirm-modal" :class="{ danger: state.danger }">
        <button class="modal-close" type="button" aria-label="关闭" @click="handleCancel">×</button>
        <h2 v-if="state.title" class="confirm-title">{{ state.title }}</h2>
        <p class="confirm-message">{{ state.message }}</p>
        <div class="confirm-actions">
          <button class="btn ghost" type="button" @click="handleCancel">{{ state.cancelText }}</button>
          <button class="btn primary" type="button" @click="handleConfirm">{{ state.confirmText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const state = useConfirm()

const handleCancel = () => resolveConfirm(false)
const handleConfirm = () => resolveConfirm(true)

// 打开期间支持 ESC 取消
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleCancel()
  }
}
watch(
  () => state.value.open,
  (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }
)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="less" scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
}

.confirm-modal {
  position: relative;
  width: 420px;
  max-width: calc(100vw - 32px);
  padding: 24px;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);

  .modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 0 4px;
    border: 0;
    background-color: transparent;
    font-size: 20px;
    line-height: 24px;
    color: var(--color-text-3);
    cursor: pointer;

    &:hover {
      color: var(--color-text-1);
    }
  }

  .confirm-title {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .confirm-message {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: var(--color-text-2);
    word-break: break-all;
  }

  .confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;

    .btn {
      padding: 7px 20px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;

      &.ghost {
        border: 1px solid var(--color-border);
        background-color: transparent;
        color: var(--color-text-2);

        &:hover {
          border-color: var(--color-text-3);
          color: var(--color-text-1);
        }
      }

      // 删除类操作确定钮红色（danger 在 modal 根元素），普通操作主色
      &.primary {
        border: 0;
        background-color: var(--color-primary);
        color: #fff;

        &:hover {
          background-color: var(--color-primary-hover);
        }
      }
    }
  }

  // 删除类操作：确定钮红色
  &.danger .confirm-actions .btn.primary {
    background-color: #d1242f;

    &:hover {
      background-color: #b01e27;
    }
  }
}
</style>
