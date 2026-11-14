<!-- 全局轻提示：顶部居中白卡 + 类型色图标（Element message 同款形态），配合 composables/useToast 使用，挂载在 app.vue -->
<template>
  <Teleport to="body">
    <Transition name="toast-fade" :duration="200">
      <div v-if="state.open" class="global-toast" :class="`type-${state.type}`" :role="state.type === 'error' ? 'alert' : 'status'">
        <!-- 类型图标：error 叉 / success 勾 / warning 三角叹号 / info 圆 i（全站描边规范） -->
        <span class="toast-icon" aria-hidden="true">
          <svg v-if="state.type === 'error'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <svg v-else-if="state.type === 'success'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="8 12.5 11 15.5 16 9.5" />
          </svg>
          <svg v-else-if="state.type === 'warning'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <span class="toast-text">{{ state.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const state = useToast()
</script>

<style lang="less" scoped>
.global-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: 13px;
  line-height: 18px;
  color: var(--color-text-1);
  white-space: nowrap;
  box-shadow: var(--shadow-2);
  pointer-events: none;

  .toast-icon {
    display: flex;
    align-items: center;
  }

  // 类型配色：图标 + 边框同色系（Element message 语义）
  &.type-error {
    border-color: rgba(209, 36, 47, 0.4);

    .toast-icon {
      color: #d1242f;
    }
  }

  &.type-warning {
    border-color: rgba(230, 131, 45, 0.4);

    .toast-icon {
      color: #e6832d;
    }
  }

  &.type-success {
    border-color: rgba(63, 176, 96, 0.4);

    .toast-icon {
      color: #3fb060;
    }
  }

  &.type-info {
    border-color: var(--color-border);

    .toast-icon {
      color: var(--color-text-2);
    }
  }
}

// 深色模式下类型色提亮保证可读
html.dark &.type-error .toast-icon {
  color: #f16a6a;
}

html.dark &.type-warning .toast-icon {
  color: #f0a04b;
}

html.dark &.type-success .toast-icon {
  color: #5ec97e;
}

// 显式 duration（Vue 按 setTimeout 结算，不依赖 transitionend），深浅主题均可读
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
