<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- 全局弹窗：挂布局之外，编辑器等独立布局也能用 -->
  <ClientOnly>
    <AuthModal />
  </ClientOnly>
  <CommonImageCropModal />
</template>
