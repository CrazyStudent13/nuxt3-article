// 全站主题初始化：启动时恢复用户偏好并监听系统主题变化
// 首屏防闪烁由 nuxt.config 的内联脚本负责，这里补上后续的状态与响应
export default defineNuxtPlugin(() => {
  useTheme().init()
})
