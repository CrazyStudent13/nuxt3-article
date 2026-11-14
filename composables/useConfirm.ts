// 全局确认弹窗：confirmAction(options) 返回 Promise<boolean>（确定 true / 取消 false）
// 配合 app.vue 的 CommonConfirmModal 使用；模式对齐 useImageCrop：useState state + 模块级 Promise 句柄
export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean // 确定按钮红色（删除类操作）
}

interface ConfirmState {
  open: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  danger: boolean
}

export const useConfirm = () =>
  useState<ConfirmState>('confirm-state', () => ({
    open: false,
    title: '',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    danger: false
  }))

// 模块级 Promise 句柄：同一时刻只会有一个确认流程
let resolver: ((value: boolean) => void) | null = null

export const confirmAction = (options: ConfirmOptions): Promise<boolean> => {
  const state = useConfirm()
  // 上一次弹窗未决时先按取消结算，避免 Promise 悬挂
  if (resolver) {
    resolver(false)
    resolver = null
  }
  state.value = {
    open: true,
    title: options.title || '',
    message: options.message,
    confirmText: options.confirmText || '确定',
    cancelText: options.cancelText || '取消',
    danger: !!options.danger
  }
  return new Promise((resolve) => {
    resolver = resolve
  })
}

export const resolveConfirm = (result: boolean) => {
  const state = useConfirm()
  state.value.open = false
  resolver?.(result)
  resolver = null
}
