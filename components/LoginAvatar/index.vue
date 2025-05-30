<template>
  <!-- 顶部登录头像 -->
  <div>
    <div v-if="userInfo?.state">
      <NuxtLink to="/login" class="login">登录</NuxtLink>
    </div>
    <div v-else>
      <el-dropdown @command="handleCommand">
        <el-avatar shape="square" :size="30" :fit="'fill'" :src="userInfo.avatar" class="avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, index) in actionList" :key="index" :command="item.value">
              <div class="action-item">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided class="logout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const userInfo = reactive({
  state: false,
  avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
})

const actionList = [
  { value: 'space', icon: 'el-icon-user', title: '个人中心' },
  { value: 'write', icon: 'el-icon-edit', title: '文章发布' }
]

const handleCommand = (command) => {
  console.log(command)
  switch (command) {
    case 'write':
      router.push({
        path: '/article/write'
      })
      console.log('文章发布')
      break
    case 'space':
      router.push({
        path: '/user/space'
      })
      console.log('个人中心')
      break
    case 'logout':
      console.log('退出登录')
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
