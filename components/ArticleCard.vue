<template>
  <el-card shadow="hover" class="card">
    <div class="article-row">
      <div class="article-row-cover">
        <el-image style="width: 120px; height: 120px" :src="props.article.cover" fit="fill" />
      </div>
      <div class="article-row-text">
        <h3>{{ props.article.title }}</h3>
        <p class="article-row-text-item content">{{ props.article.content }}</p>
        <p class="article-row-text-item article-row-text-footer">
          <span class="date">发布时间：{{ props.article.date }}</span>
          <span class="author">作者：{{ props.article.author || '暂无作者' }}</span>
          <span class="author">阅读量：{{ props.article.read || '暂无作者' }}</span>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const props = defineProps({
  article: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 18px;
}

.article-row {
  height: 120px;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  cursor: pointer;

  &-cover {
    width: 100px;
    margin-right: 30px;
  }

  &-text {
    font-size: 14px;

    &-item {
      display: inline-block;
      margin: 4px 0;
    }

    .content {
      font-size: 12px;
      line-height: 22px;
      color: #606266;
    }

    &-footer {
      display: flex;
      color: #909399;
      margin-top: 8px;
      font-size: 12px;

      .date {
        margin-right: 20px;
      }
      .author {
        margin-left: 20px;
      }
    }
  }
}
</style>
