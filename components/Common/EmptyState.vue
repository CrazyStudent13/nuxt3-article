<!-- 通用空态插画：掘金式单图 + 提示文案，文案走默认插槽 -->
<template>
  <div class="empty-state">
    <svg class="illus" viewBox="0 0 160 120" fill="none" aria-hidden="true">
      <!-- 文档纸 -->
      <rect x="28" y="16" width="72" height="90" rx="6" fill="#E3EAFF" />
      <rect x="40" y="30" width="48" height="6" rx="3" fill="#B9C6F5" />
      <rect x="40" y="44" width="36" height="6" rx="3" fill="#CBD5FF" />
      <rect x="40" y="58" width="42" height="6" rx="3" fill="#CBD5FF" />
      <rect x="40" y="72" width="30" height="6" rx="3" fill="#CBD5FF" />
      <!-- 放大镜 -->
      <circle cx="104" cy="72" r="17" fill="#FFFFFF" stroke="#4F6BFF" stroke-width="5" />
      <line x1="116" y1="85" x2="132" y2="101" stroke="#4F6BFF" stroke-width="6" stroke-linecap="round" />
      <!-- 点缀 -->
      <circle cx="122" cy="28" r="3" fill="#F5C542" />
      <circle cx="134" cy="42" r="2.5" fill="#F5C542" />
      <circle cx="112" cy="18" r="2" fill="#B9C6F5" />
    </svg>
    <p class="text"><slot /></p>
  </div>
</template>

<style lang="less" scoped>
.empty-state {
  padding: 40px 20px 48px;
  text-align: center;

  .illus {
    width: 150px;
    height: auto;
  }

  .text {
    margin-top: 14px;
    font-size: 14px;
    color: var(--color-text-3);
  }
}
</style>
