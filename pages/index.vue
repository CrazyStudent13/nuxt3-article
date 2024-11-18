<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useServerHead({
  htmlAttrs: { lang: 'zh-CN' }
})
useSeoMeta({
  titleTemplate: '游戏速递',
  description: '专注于游戏资讯，玩家攻略，游戏存档分享的小站，希望为玩家们提供更好的游戏体验。'
})
</script>
