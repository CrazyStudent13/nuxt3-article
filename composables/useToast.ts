// 全局轻提示：showToast(message) 顶部居中出现，2 秒自动消失（替代原生 alert）
// 配合 app.vue 的 CommonToast 使用；后一条消息覆盖前一条
interface ToastState {
  open: boolean
  message: string
}

export const useToast = () => useState<ToastState>('toast-state', () => ({ open: false, message: '' }))

let timer: ReturnType<typeof setTimeout> | null = null

export const showToast = (message: string, duration = 2000) => {
  const state = useToast()
  state.value = { open: true, message }
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    state.value = { ...state.value, open: false }
  }, duration)
}
