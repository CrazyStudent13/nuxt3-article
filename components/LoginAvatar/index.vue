<template>
  <!-- 顶部登录头像 -->
  <div>
    <div v-if="userInfo.state">
      <NuxtLink to="/login" class="login">登录</NuxtLink>
    </div>
    <div v-else>
      <el-dropdown @command="handleCommand">
        <el-avatar shape="square" :size="30" :fit="'fill'" :src="userInfo.avatar" class="avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="write">文章发布</el-dropdown-item>
            <el-dropdown-item command="space">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided class="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
const userInfo = reactive({
  state: false,
  avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
})

const handleCommand = (command: string) => {
  console.log(command)
  switch (command) {
    case 'write':
      break
    case 'space':
      break
    case 'logout':
      break
  }
}
</script>

<style lang="less" scoped>
.avatar {
  margin-left: 10px;
  cursor: pointer;
}

.logout {
  margin-top: 20px;
}
</style>
