<template>
  <div class="main-container">
    <el-card shadow="never" :body-style="{ padding: '20px' }">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-avatar :size="60" src="https://empty" class="avatar" @error="errorHandler">
            <img :src="userInfo.avatar" />
          </el-avatar>
        </el-col>
        <el-col :span="21">
          <el-descriptions :column="3">
            <template #title>
              <h3>{{ userInfo.name }}</h3>
            </template>
            <el-descriptions-item label="Uid">{{ userInfo.Uid }}</el-descriptions-item>
            <el-descriptions-item label="注册邮箱">{{ userInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ userInfo.registerTime }}</el-descriptions-item>
            <el-descriptions-item>
              {{ userInfo.signature }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <br />

    <el-tabs v-model="activeName" type="border-card" tab-position="top">
      <el-tab-pane v-for="item in panes" :key="item.key" :label="item.label" :name="item.key">
        <div class="panel-content">{{ item.name }}</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const userInfo = {
  name: '叶远川',
  avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
  Uid: '1796629',
  email: '10000000000@qq.com',
  registerTime: '2021-01-01',
  signature: '不过是些许风霜罢了'
}

const activeName = ref('1')

const panes = [
  {
    key: '1',
    label: '文章',
    name: 'article'
  },
  {
    key: '2',
    label: '评论',
    name: 'comment'
  },
  {
    key: '3',
    label: '收藏',
    name: 'favorite'
  },
  {
    key: '4',
    label: '点赞',
    name: 'like'
  },
  {
    key: '6',
    label: '关注',
    name: 'follow'
  },
  {
    key: '5',
    label: '通知',
    name: 'notice'
  }
  // {
  //   key: '7',
  //   label: '黑名单',
  //   name: 'blacklist'
  // }
]

const errorHandler = () => {
  return true
}
</script>

<style lang="less" scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto;
}

.userInfo {
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 100%;
    margin: 4px 0;

    .icon {
      margin: 2px;
    }
  }
}

.panel-content {
  min-height: 55vh;
}
</style>
