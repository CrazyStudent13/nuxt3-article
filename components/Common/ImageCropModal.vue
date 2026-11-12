<!-- 全局图片裁剪弹窗：配合 composables/useImageCrop 的 cropImage() 使用，挂载在 app.vue 跨布局可用 -->
<template>
  <Teleport to="body">
    <div v-if="state.open" class="crop-overlay" @click.self="handleCancel">
      <div class="crop-modal">
        <div class="modal-head">
          <h2>{{ state.title }}</h2>
          <button class="modal-close" type="button" @click="handleCancel">×</button>
        </div>

        <div class="crop-stage">
          <img ref="imgRef" :src="state.src" alt="裁剪预览" />
        </div>

        <!-- 工具：旋转 / 缩放 / 重置 -->
        <div class="crop-tools">
          <button class="tool" type="button" title="向左旋转 90°" @click="rotate(-90)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button class="tool" type="button" title="向右旋转 90°" @click="rotate(90)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
          <button class="tool" type="button" title="放大" @click="zoom(0.1)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="11" y1="8" x2="11" y2="14" />
            </svg>
          </button>
          <button class="tool" type="button" title="缩小" @click="zoom(-0.1)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button class="tool tool-text" type="button" title="恢复原图" @click="reset">重置</button>
        </div>

        <div class="modal-actions">
          <button class="btn ghost" type="button" @click="handleCancel">取消</button>
          <button class="btn primary" type="button" :disabled="confirming" @click="handleConfirm">
            {{ confirming ? '处理中…' : '确认裁剪' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const state = useImageCrop()
const imgRef = ref<HTMLImageElement | null>(null)
const confirming = ref(false)

let cropper: Cropper | null = null

// 弹窗打开时懒加载 cropperjs（避免 SSR 引入），关闭时销毁实例并回收预览地址
watch(
  () => state.value.open,
  async (open) => {
    if (!open) {
      cropper?.destroy()
      cropper = null
      return
    }
    await nextTick()
    if (!imgRef.value) {
      return
    }
    const CropperCtor = (await import('cropperjs')).default
    cropper = new CropperCtor(imgRef.value, {
      aspectRatio: state.value.aspectRatio ?? NaN, // NaN 即自由比例
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.9,
      background: false
    })
  }
)

const rotate = (deg: number) => cropper?.rotate(deg)
const zoom = (ratio: number) => cropper?.zoom(ratio)
const reset = () => cropper?.reset()

const handleCancel = () => cancelCrop()

// 裁剪结果导出为 Blob（尺寸上限 1600，格式跟随源文件），交回给调用方上传
const handleConfirm = () => {
  if (!cropper || confirming.value) {
    return
  }
  confirming.value = true
  const canvas = cropper.getCroppedCanvas({
    maxWidth: 1600,
    maxHeight: 1600,
    imageSmoothingQuality: 'high'
  })
  if (!canvas) {
    confirming.value = false
    return
  }
  canvas.toBlob(
    (blob) => {
      confirming.value = false
      if (blob) {
        confirmCrop(blob)
      }
    },
    state.value.type || 'image/png',
    0.92
  )
}

onBeforeUnmount(() => {
  cropper?.destroy()
  cropper = null
})
</script>

<style lang="less" scoped>
.crop-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
}

.crop-modal {
  width: 560px;
  max-width: calc(100vw - 32px);
  padding: 16px 20px;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-1);
  }

  .modal-close {
    padding: 0 4px;
    border: 0;
    background-color: transparent;
    font-size: 20px;
    line-height: 24px;
    color: var(--color-text-3);
    cursor: pointer;

    &:hover {
      color: var(--color-text-1);
    }
  }
}

.crop-stage {
  height: 360px;
  background-color: var(--color-bg);
  border-radius: var(--radius-sm);
  overflow: hidden;

  img {
    display: block;
    max-width: 100%;
  }
}

.crop-tools {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;

  .tool {
    width: 34px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: transparent;
    color: var(--color-text-2);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    &:hover {
      background-color: var(--color-bg);
      color: var(--color-text-1);
    }

    &.tool-text {
      width: auto;
      padding: 0 12px;
      font-size: 13px;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;

  .btn {
    padding: 7px 18px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.ghost {
      border: 1px solid var(--color-border);
      background-color: transparent;
      color: var(--color-text-2);

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
    }

    &.primary {
      border: 0;
      background-color: var(--color-primary);
      color: #fff;

      &:hover:not(:disabled) {
        background-color: var(--color-primary-hover);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: 640px) {
  .crop-stage {
    height: 260px;
  }
}
</style>
