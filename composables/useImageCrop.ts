// 图片裁剪统一入口：各上传点（头像/封面/正文图）选择文件后先经 cropImage 弹出裁剪框，
// 用户旋转/缩放确认后拿到带扩展名的 File 再走各自的上传请求；取消则 Promise reject('cancel')
export interface CropOptions {
  title?: string
  aspectRatio?: number // 宽高比：1=头像，16/9=封面；不传=自由裁剪
  type?: string // 输出格式跟随源文件（jpeg/webp），默认 png
}

interface CropState {
  open: boolean
  src: string
  title: string
  aspectRatio?: number
  type: string
}

export const useImageCrop = () =>
  useState<CropState>('image-crop-state', () => ({ open: false, src: '', title: '裁剪图片', type: 'image/png' }))

// 模块级 Promise 句柄：同一时刻只会有一个裁剪流程
let pendingResolve: ((file: File) => void) | null = null
let pendingReject: ((reason?: unknown) => void) | null = null
let activeObjectUrl = ''

export const cropImage = (file: File, options: CropOptions = {}): Promise<File> => {
  const state = useImageCrop()
  if (state.value.open) {
    return Promise.reject(new Error('已有裁剪任务进行中'))
  }
  const outputType = /^image\/(jpe?g|webp)$/.test(file.type) ? file.type : 'image/png'
  activeObjectUrl = URL.createObjectURL(file)
  state.value = {
    open: true,
    src: activeObjectUrl,
    title: options.title || '裁剪图片',
    aspectRatio: options.aspectRatio,
    type: outputType
  }
  return new Promise((resolve, reject) => {
    pendingResolve = resolve
    pendingReject = reject
  })
}

export const confirmCrop = (blob: Blob) => {
  const state = useImageCrop()
  const ext = state.value.type === 'image/jpeg' ? 'jpg' : state.value.type === 'image/webp' ? 'webp' : 'png'
  state.value.open = false
  // 包成 File 保留扩展名，上传点无需感知裁剪流程
  pendingResolve?.(new File([blob], `cropped-${Date.now()}.${ext}`, { type: state.value.type }))
  cleanup()
}

export const cancelCrop = () => {
  const state = useImageCrop()
  state.value.open = false
  pendingReject?.(new Error('cancel'))
  cleanup()
}

const cleanup = () => {
  pendingResolve = null
  pendingReject = null
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl)
    activeObjectUrl = ''
  }
}
