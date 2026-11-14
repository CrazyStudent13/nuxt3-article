<!-- 全局轻提示：顶部居中黑色胶囊（掘金式），配合 composables/useToast 的 showToast() 使用，挂载在 app.vue -->
<template>
  <Teleport to="body">
    <Transition name="toast-fade" :duration="200">
      <div v-if="state.open" class="global-toast" role="status">{{ state.message }}</div>
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
  padding: 10px 20px;
  border-radius: var(--radius-full);
  background-color: rgba(0, 0, 0, 0.75);
  font-size: 13px;
  line-height: 18px;
  color: #fff;
  white-space: nowrap;
  box-shadow: var(--shadow-2);
  pointer-events: none;
}

// 显式 duration（Vue 按 setTimeout 结算，不依赖 transitionend），深浅主题下黑底白字均可读
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
