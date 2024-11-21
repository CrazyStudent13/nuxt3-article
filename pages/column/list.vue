<template>
  <div v-for="(item, index) in column.list" :key="index" @click="column.handleRowClick(item)">
    <article-column-card :card-info="item" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const column = reactive({
  list: [
    {
      title: '盘点2024必看的好看电视剧',
      cover: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      date: '2023-05-01',
      author: '小片片',
      read: 123,
      like: 123,
      share: 123,
      content:
        '前不久解说了《庭外·盲区》，大家普遍对后续剧情不是很满意。也有很多小伙伴想起了和《庭外》同编剧的另一部剧《白夜追凶》。《庭外》没有达到《白夜追凶》的高度有点可惜。所以今天就让我们重新回顾一下，那部在上映时震惊观众的9分好剧吧。关注微信公众号：小片片说大片，更多宠粉福利等你来！'
    }
  ],
  handleRowClick: (row: any) => {
    // console.log(row, '测试>>')
    // 路由跳转

    router.push({
      path: '/column/detail',
      query: {
        id: row.id
      }
    })
  }
})

for (let i = 0; i < 20; i++) {
  column.list.push({
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

<style lang="less" scoped></style>
