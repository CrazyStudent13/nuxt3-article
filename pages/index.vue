<template>
  <div class="article-list">
    <div class="article-list-main">
      <div v-for="(item, index) in article.list" :key="index" @click="article.handleRowClick(item)">
        <article-list-card :card-info="item" />
      </div>
    </div>

    <div class="article-list-pagination">
      <el-pagination
        v-model:current-page="article.pageNum"
        v-model:page-size="article.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="article.total"
        @size-change="article.handleSizeChange"
        @current-change="article.handleCurrentChange"
      />
    </div>

    <el-backtop :right="50" :bottom="50" />
  </div>
</template>

<script setup>
import { getArticleList } from '@/api/article'

const article = reactive({
  list: [],
  pageSize: 10,
  pageNum: 1,
  total: 0,
  request: async () => {
    const params = {
      title: '',
      pageNum: article.pageNum,
      pageSize: article.pageSize
    }

    const { data } = await getArticleList(params)
    const result = data.value.data

    // const url = `http://111.229.29.214:8080/game/article/guest/list?title=测试&pageNum=${article.pageNum}&pageSize=${article.pageSize}`
    // const { data } = await useFetch(url)
    // const result = data.value.data

    article.total = result.total
    article.list = result.list
  },
  handleRowClick: (item) => {
    console.log(item, '测试')
    useRouter().push({
      path: '/article/detail',
      query: {
        id: item.articleId
      }
    })
  },
  handleSizeChange: (val) => {
    article.pageSize = val
    article.request()
  },
  handleCurrentChange: (val) => {
    article.pageNum = val
    article.request()
  }
})

// 调用请求方法以获取数据
article.request()
</script>

<style lang="less" scoped>
.article-list {
  margin: 20px 0;
  &-pagination {
    padding: 8px 16px;
    background: #ffffff;
    text-align: center;
  }
}
</style>
