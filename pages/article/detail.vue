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

    <el-backtop :right="50" :bottom="50" />
  </el-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { getArticleDetail } from '@/api/article'

const article = reactive({
  model: {},
  request: async () => {
    const res = await getArticleDetail(article.model.id)
    const result = res.data

    console.log(result)
    // article.model = result

    // article.model.publishTime = dayjs(article.model.publishTime).format('YYYY-MM-DD HH:mm:ss')
    // article.model.createTime = dayjs(article.model.createTime).format('YYYY-MM-DD HH:mm:ss')
  }
})

// 调用请求方法以获取数据
const route = useRoute()
article.model.id = route.query.id //拿到传递参数

article.request()
</script>

<style lang="less" scoped>
.title {
  margin: 20px 0;
}
</style>
