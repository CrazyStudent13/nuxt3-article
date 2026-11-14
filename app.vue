<!-- 应用根组件：NuxtLayout 布局出口+NuxtPage；全局弹窗挂布局之外（登录/确认/Toast 包 ClientOnly 规避 SSR 水合差异），编辑器等独立布局也能用 -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- 全局弹窗：挂布局之外，编辑器等独立布局也能用 -->
  <ClientOnly>
    <AuthModal />
    <CommonConfirmModal />
    <CommonToast />
  </ClientOnly>
  <CommonImageCropModal />
</template>
