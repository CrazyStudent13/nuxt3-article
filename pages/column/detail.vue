<template>
  <div class="column">
    <div class="column-header">
      <div class="column-header-title">
        <h2>《{{ column.detail.title }}》</h2>
      </div>

      <div class="column-header-content">
        <div class="cover">
          <el-image style="width: 120px; height: 120px" :src="column.detail.cover" fit="fill" />
        </div>
        <div class="content">
          <p>{{ column.detail.content }}</p>
        </div>

        <div class="column-header-content-footer">
          <span class="author">订阅量：{{ column.detail.subCount }}</span>
          <span class="total">文章总量：{{ column.detail.total }}</span>
          <span class="read">阅读量：{{ column.detail.read }}</span>
          <span class="share">分享量：{{ column.detail.share }}</span>
          <span class="date">创建时间：{{ column.detail.date }}</span>
        </div>
      </div>

      <div v-if="false" class="column-header-footer">
        <div class="action">
          <el-button type="primary" size="small">修改介绍</el-button>
          <el-button type="primary" size="small">管理内容</el-button>
        </div>
        <div class="sub">
          <el-button type="primary" size="small" icon="star">订阅</el-button>
        </div>
      </div>
    </div>

    <div class="column-content">
      <div class="column-content-action"></div>

      <div v-for="(item, index) in column.articleList" :key="index">
        <article-list-card :card-info="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const column = reactive({
  detail: {
    title: '盘点2024好看的电视剧',
    content: '一人四角，狂飙演技，刑侦白月光回归！苦等七年！第二季终于来了！白夜追凶2最悬疑不是它的剧情，而是它的定档时间。',
    author: '小片片',
    subCount: 124,
    total: 123,
    date: '2023-05-01',
    read: 123,
    like: 123,
    share: 100,
    cover: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
  },
  articleList: [
    {
      title: '白夜追凶2开播啦！！！',
      cover: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      date: '2023-05-01',
      author: '小片片',
      read: 123,
      like: 123,
      share: 123,
      content:
        '前不久解说了《庭外·盲区》，大家普遍对后续剧情不是很满意。也有很多小伙伴想起了和《庭外》同编剧的另一部剧《白夜追凶》。《庭外》没有达到《白夜追凶》的高度有点可惜。所以今天就让我们重新回顾一下，那部在上映时震惊观众的9分好剧吧。关注微信公众号：小片片说大片，更多宠粉福利等你来！'
    }
  ]
})

for (let i = 0; i < 20; i++) {
  column.articleList.push({
    title: '白夜追凶2开播啦！！！',
    cover: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    date: '2023-05-01',
    author: '小片片',
    read: 123,
    like: 123,
    share: 123,
    content:
      '前不久解说了《庭外·盲区》，大家普遍对后续剧情不是很满意。也有很多小伙伴想起了和《庭外》同编剧的另一部剧《白夜追凶》。《庭外》没有达到《白夜追凶》的高度有点可惜。所以今天就让我们重新回顾一下，那部在上映时震惊观众的9分好剧吧。关注微信公众号：小片片说大片，更多宠粉福利等你来！'
  })
}
</script>

<style lang="less" scoped>
.column {
  &-header {
    padding: 16px 20px;
    margin-bottom: 20px;
    background-color: white;

    &-title {
      margin-bottom: 16px;
    }

    &-content {
      position: relative;
      height: 130px;

      .cover {
        float: left;
        margin-right: 20px;
      }

      .content {
        height: 75px;
        font-size: 14px;
        line-height: 22px;
        color: #606266;
      }

      &-footer {
        margin-top: 20px;
        font-size: 12px;
        line-height: 20px;

        span {
          color: #909399;
          margin-right: 20px;
        }

        .date {
          float: right;
          text-align: right;
          margin-right: 0;
        }
      }
    }

    &-footer {
      border-top: 1px solid #cccccc;
      padding-top: 8px;

      .action {
        float: right;
      }
    }
  }
}
</style>
