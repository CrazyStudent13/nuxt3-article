<template>
  <el-card shadow="always" :body-style="{ padding: ' 24px 32px' }">
    <template #header>
      <h1 class="title">{{ article.model.title }}</h1>
      <el-descriptions>
        <el-descriptions-item label="发布时间">{{ article.model.publishTime }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ article.model.createTime }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ article.model.author || '-' }}</el-descriptions-item>
      </el-descriptions>
    </template>
    <!-- card body -->
    <MdViewer :value="article.model.content" />
  </el-card>
</template>

<script setup>
import dayjs from 'dayjs'

const article = reactive({
  model: {},
  request: async () => {
    const { data } = await useFetch('http://111.229.29.214:8080/game/article/guest/detail?gameId=31')

    article.model = data.value.data
    article.model.publishTime = dayjs(article.model.publishTime).format('YYYY-MM-DD HH:mm:ss')
    article.model.createTime = dayjs(article.model.createTime).format('YYYY-MM-DD HH:mm:ss')
  }
})

// 调用请求方法以获取数据
article.request()
</script>

<style lang="less" scoped>
.title {
  margin: 20px 0;
}
</style>
