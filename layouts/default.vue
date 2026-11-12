<template>
  <div class="app">
    <AppHeader />

    <main class="app-main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style lang="less" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 24px 16px 40px;
}
</style>
