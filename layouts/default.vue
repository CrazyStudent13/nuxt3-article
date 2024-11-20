<template>
  <div>
    <AppHeader />

    <div class="main-container">
      <slot />
    </div>

    <AppFooter />
  </div>
</template>

<style lang="less" scoped>
.main-container {
  max-width: 800px;
  min-height: 100vh;
  margin: 20px auto;
}
</style>
