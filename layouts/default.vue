<template>
  <div>
    <AppHeader />

    <div class="main-container">
      <slot />
    </div>

    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100vh;
}
</style>
