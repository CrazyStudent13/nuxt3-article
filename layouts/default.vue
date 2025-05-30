<template>
  <div class="app">
    <AppHeader />

    <div>
      <slot />
    </div>

    <AppFooter />
  </div>
</template>

<style lang="less" scoped>
.app {
  background-color: #f2f3f5;
}
</style>
