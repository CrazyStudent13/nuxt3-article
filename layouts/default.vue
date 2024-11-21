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
  min-height: 100vh;
  margin: 20px auto;
}
</style>
