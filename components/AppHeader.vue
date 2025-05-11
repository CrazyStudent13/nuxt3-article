<template>
  <header class="header">
    <nav class="header-left header-item" role="navigation">
      <NuxtLink v-for="(item, key) in header.data" :key="key" :to="`${item.path}`" class="link">
        {{ item.title }}
      </NuxtLink>
    </nav>
    <div class="header-right header-item">
      <NuxtLink to="/login" class="login">登录</NuxtLink>
      <!-- <el-icon class="login"><User /></el-icon> -->
    </div>
  </header>
</template>
<script setup>
const header = reactive({
  data: [
    { title: '新闻', path: '/' },
    { title: '攻略', path: '/article/list' }
    // { title: '存档', path: '/gameSL/list' }
    // { title: '关于', path: '/about' }
  ]
})
</script>

<style lang="less" scoped>
.header {
  position: sticky;
  top: 0;
  background-color: #020420;
  z-index: 999;
  height: 55px;
  display: flex;
  justify-content: space-around;

  &-item {
    box-sizing: border-box;
    margin: 0px auto;
    padding: 12px 5px;
  }

  & a {
    color: #fff;
    line-height: 24px;
    transition: color 0.15s ease;
    display: inline-block;
    vertical-align: middle;
    font-weight: 300;
    letter-spacing: 0.075em;
    margin-right: 1.8em;
    text-decoration: none;

    &:hover {
      color: #00dc82;
    }

    &.active {
      color: #00dc82;
    }

    &:nth-child(6) {
      margin-right: 0;
    }
  }
}
</style>
