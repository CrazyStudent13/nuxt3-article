<!-- 创作者中心专栏新建/编辑弹窗：标题+简介+封面（16:9 裁剪上传）；新建必须显式传 publishStatus='2'（后端默认 '0'，公开站不显示） -->
<template>
  <Teleport to="body">
    <div class="column-overlay" @click.self="emit('close')">
      <div class="column-modal">
        <div class="modal-head">
          <h2>{{ isEdit ? '编辑专栏' : '新建专栏' }}</h2>
          <button class="modal-close" type="button" @click="emit('close')">×</button>
        </div>

        <label class="modal-row">
          <span class="row-label">标题</span>
          <span class="row-field">
            <input v-model="form.title" class="form-input" type="text" maxlength="64" placeholder="请输入专栏标题" />
          </span>
        </label>

        <label class="modal-row">
          <span class="row-label">简介</span>
          <span class="row-field">
            <textarea
              v-model="form.desc"
              class="form-input form-textarea"
              rows="4"
              maxlength="255"
              placeholder="介绍一下这个专栏的内容，留空则不填"
            />
          </span>
        </label>

        <label class="modal-row">
          <span class="row-label">封面</span>
          <span class="row-field">
            <button class="cover-box" type="button" :disabled="coverUploading" @click="coverInput?.click()">
              <img v-if="form.cover" class="cover-img" :src="coverPreview" alt="封面" />
              <span v-else class="cover-placeholder">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {{ coverUploading ? '上传中…' : '上传封面' }}
              </span>
              <!-- 悬浮移除：已选封面时 hover 显现，点击不触发更换 -->
              <span v-if="form.cover && !coverUploading" class="cover-remove" role="button" tabindex="-1" @click.stop="form.cover = ''">移除</span>
            </button>
            <input ref="coverInput" class="img-input" type="file" accept="image/*" @change="handleCoverChange" />
          </span>
        </label>

        <p v-if="tip" class="form-tip tip-error">{{ tip }}</p>

        <div class="modal-actions">
          <button class="btn ghost" type="button" @click="emit('close')">取消</button>
          <button class="btn primary" type="button" :disabled="submitting" @click="confirmSubmit">
            {{ submitting ? '保存中…' : isEdit ? '保存修改' : '确认创建' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// 编辑时传入的行数据（预填表单），新建时为 null
type ColumnRowData = {
  id: number
  title?: string
  desc?: string
  cover?: string
}

const props = defineProps<{
  column?: ColumnRowData | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const config = useRuntimeConfig()

const isEdit = computed(() => !!props.column?.id)

const form = reactive({ title: '', desc: '', cover: '' })
const tip = ref('')
const submitting = ref(false)
const coverUploading = ref(false)
const coverInput = ref<HTMLInputElement | null>(null)

// 编辑模式用行数据预填
onMounted(() => {
  if (props.column) {
    form.title = props.column.title || ''
    form.desc = props.column.desc || ''
    form.cover = props.column.cover || ''
  }
})

const coverPreview = computed(() => toCoverUrl(config.public.apiBase, form.cover))

// 封面上传：裁剪 16:9 后传 common/upload（专栏封面归档到 subject/cover 目录）
const uploadImage = async (file: File, path: string) => {
  const uploadForm = new FormData()
  uploadForm.append('file', file)
  uploadForm.append('path', path)
  const res = await apiFetch<{ url: string }>('/api/common/upload', { method: 'POST', body: uploadForm })
  return res.data?.url || ''
}

const handleCoverChange = async (event: Event) => {
  const inputEl = event.target as HTMLInputElement
  const file = inputEl.files?.[0]
  inputEl.value = '' // 允许连续选择同一文件
  if (!file) {
    return
  }
  if (!/^image\//.test(file.type)) {
    tip.value = '请选择图片文件'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    tip.value = '图片不能超过 10MB'
    return
  }
  coverUploading.value = true
  tip.value = ''
  try {
    const cropped = await cropImage(file, { title: '裁剪专栏封面', aspectRatio: 16 / 9 })
    form.cover = await uploadImage(cropped, 'subject/cover')
  } catch (error: any) {
    // 取消裁剪静默结束，其余报错提示
    if (error?.message !== 'cancel') {
      tip.value = error?.message || '封面上传失败'
    }
  } finally {
    coverUploading.value = false
  }
}

const confirmSubmit = async () => {
  const title = form.title.trim()
  if (!title) {
    tip.value = '请输入专栏标题'
    return
  }
  submitting.value = true
  tip.value = ''
  try {
    if (isEdit.value && props.column) {
      // 编辑为补丁式更新，不传 publishStatus（保持原状态）
      await apiFetch('/api/post/subject', {
        method: 'PUT',
        body: { id: props.column.id, title, desc: form.desc.trim() || undefined, cover: form.cover || undefined }
      })
    } else {
      // 新建必须显式发布（后端默认 publishStatus='0' 草稿，guest 列表只显示 '2'）
      await apiFetch('/api/post/subject', {
        method: 'POST',
        body: { title, desc: form.desc.trim() || undefined, cover: form.cover || undefined, publishStatus: '2' }
      })
    }
    emit('saved')
  } catch (error: any) {
    tip.value = error?.message || '保存失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="less" scoped>
// 弹窗骨架与编辑器发布弹窗同款
.column-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
}

.column-modal {
  width: 480px;
  max-width: calc(100vw - 32px);
  padding: 20px 24px;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;

    h2 {
      font-size: 17px;
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

  .modal-row {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;

    .row-label {
      flex-shrink: 0;
      width: 48px;
      padding-top: 8px;
      font-size: 13px;
      color: var(--color-text-2);
      text-align: right;
    }

    .row-field {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .cover-box {
    width: 240px;
    height: 135px;
    padding: 0;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s ease;
    position: relative;

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
    }

    &:disabled {
      cursor: wait;
    }

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 12px;
      color: var(--color-text-3);
    }

    .cover-remove {
      position: absolute;
      right: 6px;
      bottom: 6px;
      padding: 3px 10px;
      border: 0;
      border-radius: var(--radius-sm);
      background-color: rgba(0, 0, 0, 0.55);
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition:
        opacity 0.2s ease,
        background-color 0.2s ease;

      &:hover {
        background-color: rgba(209, 36, 47, 0.8);
      }
    }
  }

  &:hover .cover-remove {
    opacity: 1;
  }

  .form-input {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    font-size: 13px;
    color: var(--color-text-1);
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: var(--color-primary);
    }
  }

  .form-textarea {
    resize: vertical;
    line-height: 1.7;
  }

  .form-tip {
    margin: 0 0 4px 60px;
    font-size: 12px;

    &.tip-error {
      color: #d1242f;
    }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;

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
          border-color: var(--color-text-3);
          color: var(--color-text-1);
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
}

.img-input {
  display: none;
}
</style>
