// 图片裁剪统一入口：各上传点（头像/封面/正文图）选择文件后先经 cropImage 弹出裁剪框，
// 用户旋转/缩放确认后拿到带扩展名的 File 再走各自的上传请求；取消则 Promise reject('cancel')
// 输出统一 WebP（质量 0.9，同观感体积减 30-50%）；浏览器不支持 WebP 编码时 canvas 会回落 PNG，按实际类型命名
export interface CropOptions {
  title?: string
  aspectRatio?: number // 宽高比：1=头像，16/9=封面；不传=自由裁剪
}

interface CropState {
  open: boolean
  src: string
  title: string
  aspectRatio?: number
}

export const useImageCrop = () =>
  useState<CropState>('image-crop-state', () => ({ open: false, src: '', title: '裁剪图片' }))

// 模块级 Promise 句柄：同一时刻只会有一个裁剪流程
let pendingResolve: ((file: File) => void) | null = null
let pendingReject: ((reason?: unknown) => void) | null = null
let activeObjectUrl = ''

export const cropImage = (file: File, options: CropOptions = {}): Promise<File> => {
  const state = useImageCrop()
  if (state.value.open) {
    return Promise.reject(new Error('已有裁剪任务进行中'))
  }
  activeObjectUrl = URL.createObjectURL(file)
  state.value = {
    open: true,
    src: activeObjectUrl,
    title: options.title || '裁剪图片',
    aspectRatio: options.aspectRatio
  }
  return new Promise((resolve, reject) => {
    pendingResolve = resolve
    pendingReject = reject
  })
}

export const confirmCrop = (blob: Blob) => {
  const state = useImageCrop()
  const isWebp = blob.type === 'image/webp'
  const ext = isWebp ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : 'png'
  state.value.open = false
  // 包成 File 保留扩展名，上传点无需感知裁剪流程
  pendingResolve?.(new File([blob], `cropped-${Date.now()}.${ext}`, { type: blob.type || 'image/png' }))
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
