<template>
  <!-- 顶部登录头像 -->
  <NuxtLink v-if="isLoginShow" to="/login" class="enter">登录</NuxtLink>
  <el-dropdown v-else @command="handleCommand">
    <el-avatar shape="square" :size="30" :fit="'fill'" :src="userInfo.avatar" class="avatar" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="(item, index) in actionList" :key="index" :command="item.value">
          <div class="action-item">
            <el-icon>
              <User v-if="item.value === 'space'" />
              <Edit v-if="item.value === 'write'" />
            </el-icon>
            <span>{{ item.title }}</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="logout" divided class="logout">
          <div class="action-item">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出登录</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import useUserStore from '@/stores/user'
const userStore = useUserStore()
const userInfo = userStore.$state

const isLoginShow = ref(false)

// 监听 token 变化
watch(
  () => userInfo,
  (val) => {
    const { token } = val
    isLoginShow.value = token === '' || typeof token === 'undefined' || token === null
  },
  { immediate: true, deep: true }
)

const router = useRouter()

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
      userStore.Logout()
      break
    case 'login':
      router.push({
        path: '/login'
      })
      break
  }
}
</script>

<style lang="less" scoped>
.avatar {
  margin-left: 10px;
  cursor: pointer;
}

.enter {
  line-height: 32px;
  color: white;
  cursor: pointer;
  text-decoration: none;
}

.action-item {
  display: flex;
  align-items: center;
  cursor: pointer;

  .el-icon {
    margin-right: 10px;
  }
}

.logout {
  margin-top: 20px;
}
</style>
