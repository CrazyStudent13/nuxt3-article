<template>
  <!-- 顶部登录头像 -->
  <NuxtLink to="/login" class="login">登录</NuxtLink>
  <!-- <NuxtLink v-if="userInfo?.state" to="/login" class="login">登录</NuxtLink>
  <el-dropdown v-else @command="handleCommand">
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
  </el-dropdown> -->
</template>

<script setup>
// import { useUserStore } from '@/stores/user'
// const userStore = useUserStore()

// onMounted(() => {
//   console.log('用户信息测试', userStore.token, '？？？？')
// })

const router = useRouter()
const userInfo = reactive({
  state: true,
  avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
})

const actionList = [
  { value: 'space', icon: 'el-icon-user', title: '个人中心' },
  { value: 'write', icon: 'el-icon-edit', title: '文章发布' }
]
// todo：这个方法后续要集成到cat-tools中，避免现状
// 定义一个全局变量来保存打开的窗口对象（可以放在 pinia/vuex 或 window 全局上）
const openedWindows = {}

const openInSameTab = (url, windowName) => {
  // 如果已经打开过，就 focus 已有的窗口
  if (openedWindows[windowName] && !openedWindows[windowName].closed) {
    openedWindows[windowName].focus()
  } else {
    // 否则新建窗口并保存引用
    const newWindow = window.open(url, windowName)
    if (newWindow) {
      openedWindows[windowName] = newWindow
    }
  }
}
const handleCommand = (command) => {
  console.log(command)
  switch (command) {
    case 'write':
      openInSameTab('/article/write', 'articleWrite')
      break
    case 'space':
      router.push({
        path: '/user/space'
      })
      console.log('个人中心')
      break
    case 'logout':
      console.log('退出登录')
      window.close()
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
