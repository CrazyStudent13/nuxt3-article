<template>
  <div v-for="(item, index) in article.list" :key="index">
    <article-list-card :card-info="item" />
  </div>
</template>

<script setup>
const article = reactive({
  list: [],
  request: async () => {
    const { data } = await useFetch('http://111.229.29.214:8080/game/article/guest/list?title=测试&pageNum=1&pageSize=10')

    article.list = data.value.data.list
    console.log(article.list, 'haha h')
  }
})

// 调用请求方法以获取数据
article.request()
</script>

<style lang="less" scoped></style>
