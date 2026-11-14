// 全局轻提示：showToast(message, type, duration) 顶部居中出现，2 秒自动消失（替代原生 alert）
// 分类型展示（Element message 同款语义）：error 红 / warning 橙 / success 绿 / info 灰
// 配合 app.vue 的 CommonToast 使用；后一条消息覆盖前一条
export type ToastType = 'info' | 'success' | 'warning' | 'error'

interface ToastState {
  open: boolean
  message: string
  type: ToastType
}

export const useToast = () =>
  useState<ToastState>('toast-state', () => ({ open: false, message: '', type: 'info' }))

let timer: ReturnType<typeof setTimeout> | null = null

export const showToast = (message: string, type: ToastType = 'info', duration = 2000) => {
  const state = useToast()
  state.value = { open: true, message, type }
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    state.value = { ...state.value, open: false }
  }, duration)
}
