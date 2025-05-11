<template>
  <div class="app">
    <AppHeader />

    <div class="main-container">
      <slot />
    </div>

    <AppFooter />
  </div>
</template>

<style lang="less" scoped>
.app {
  background-color: #f2f3f5;
}

.main-container {
  max-width: 800px;
  min-height: calc(100vh - 111px);
  margin: 0 auto;
  padding: 20px 0;
}
</style>
