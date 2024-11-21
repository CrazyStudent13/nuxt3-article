<template>
  <header class="header">
    <nav class="inner" role="navigation">
      <NuxtLink v-for="(item, key) in header.data" :key="key" :to="`${item.path}`">
        {{ item.title }}
      </NuxtLink>
    </nav>
  </header>
</template>
<script setup>
const header = reactive({
  data: [
    { title: '文章', path: '/article/list' },
    { title: '专栏', path: '/column/list' }
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

  .inner {
    max-width: 800px;
    box-sizing: border-box;
    margin: 0px auto;
    padding: 12px 5px;
    display: flex;
    place-items: center;
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
