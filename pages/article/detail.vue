<template>
  <div class="main-container">
    <el-card shadow="always" :body-style="{ padding: ' 24px 32px' }">
      <template #header>
        <h1 class="title">{{ article.model?.title }}</h1>
        <el-descriptions>
          <el-descriptions-item label="发布时间">{{ article.model?.publishTime }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ article.model?.author || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>
      <!-- card body -->
      <MdViewer :value="article.model.content" />

      <el-backtop :right="50" :bottom="50" />
    </el-card>
  </div>
</template>

<script setup>
import { getArticleDetail } from '@/api/article'

const article = reactive({
  model: {
    title: '',
    publishTime: '',
    createTime: ''
  },
  request: async () => {
    const { data } = await getArticleDetail(article.model.id)
    const result = data

    article.model = result

    article.model.publishTime = time.$dayjs(article.model.publishTime).format('YYYY-MM-DD HH:mm:ss')
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
