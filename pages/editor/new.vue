<template>
  <div class="editor-page">
    <!-- 顶栏：返回站点 + 标题 + 草稿箱 + 发布 -->
    <header class="editor-topbar">
      <NuxtLink to="/" class="editor-brand" title="返回首页">
        <span class="brand-logo">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
          </svg>
        </span>
        <span class="brand-name">游戏速递</span>
      </NuxtLink>

      <input
        v-model="title"
        class="title-input"
        type="text"
        maxlength="64"
        placeholder="输入文章标题..."
        @input="topTip = ''"
      />

      <span class="save-hint">{{ saveHint }}</span>

      <div class="draft-wrap">
        <button class="draft-btn" type="button" @click="draftOpen = !draftOpen">
          草稿箱<span v-if="myDrafts.length" class="draft-count">{{ myDrafts.length }}</span>
        </button>
        <div v-if="draftOpen" class="draft-panel">
          <template v-if="myDrafts.length">
            <div
              v-for="item in myDrafts"
              :key="item.id"
              class="draft-item"
              :class="{ current: item.id === currentDraftId }"
              @click="loadDraft(item)"
            >
              <span class="draft-item-title">{{ item.title || '无标题' }}</span>
              <span class="draft-item-time">{{ formatDraftTime(item.updateTime) }}</span>
              <button class="draft-item-del" type="button" title="删除草稿" @click.stop="removeDraft(item)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6H4V4h4V4a1 1 0 0 1 1-1zm1 2v1h4V5h-4zM7 6v14h10V6H7zm2 2h2v10H9V8zm4 0h2v10h-2V8z" />
                </svg>
              </button>
            </div>
          </template>
          <p v-else class="draft-empty">暂无草稿，内容会自动保存到这里</p>
        </div>
      </div>

      <button class="publish-btn" type="button" @click="openPublish">发布</button>
    </header>
    <p v-if="topTip" class="top-tip">{{ topTip }}</p>

    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <button class="tool-btn tool-text" type="button" title="标题" @click="cycleHeading">H</button>
      <button class="tool-btn tool-text" type="button" title="加粗 (Ctrl+B)" @click="wrapInline('**', '**', '加粗文本')"><b>B</b></button>
      <button class="tool-btn tool-text" type="button" title="斜体 (Ctrl+I)" @click="wrapInline('*', '*', '斜体文本')"><i>I</i></button>

      <span class="tool-divider" />

      <button class="tool-btn tool-text" type="button" title="引用" @click="toggleLinePrefix('> ')">”</button>
      <button class="tool-btn" type="button" title="链接" @click="insertLink">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
      <button class="tool-btn" type="button" title="上传图片" :disabled="imgUploading" @click="imgInput?.click()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </button>
      <input ref="imgInput" class="img-input" type="file" accept="image/*" @change="handleImgChange" />

      <span class="tool-divider" />

      <button class="tool-btn tool-text tool-code" type="button" title="行内代码" @click="wrapInline('`', '`', '代码')"><span>&lt;/&gt;</span></button>
      <button class="tool-btn" type="button" title="代码块" @click="insertCodeBlock">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </button>

      <span class="tool-divider" />

      <button class="tool-btn" type="button" title="无序列表" @click="toggleLinePrefix('- ')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <line x1="9" y1="6" x2="21" y2="6" />
          <line x1="9" y1="12" x2="21" y2="12" />
          <line x1="9" y1="18" x2="21" y2="18" />
          <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <button class="tool-btn tool-text" type="button" title="有序列表" @click="toggleOrderedList">1.</button>
      <button class="tool-btn" type="button" title="表格" @click="insertTable">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      </button>
      <button class="tool-btn tool-text" type="button" title="分割线" @click="insertHr">—</button>
    </div>

    <!-- 左写右预览 -->
    <div class="editor-body">
      <textarea
        ref="taRef"
        v-model="content"
        class="editor-input"
        placeholder="输入文章内容，支持 Markdown 语法，可直接粘贴图片…"
        @keydown="handleShortcut"
        @paste="handlePaste"
      />
      <div class="editor-preview">
        <MdViewer :value="content" />
      </div>
    </div>

    <!-- 底部状态栏 -->
    <footer class="editor-status">
      <span>字数 {{ charCount }}</span>
      <span>行数 {{ lineCount }}</span>
      <span class="status-hint">文章将自动保存至草稿箱</span>
    </footer>

    <!-- 发布弹窗 -->
    <Teleport to="body">
      <div v-if="publishOpen" class="publish-overlay" @click.self="publishOpen = false">
        <div class="publish-modal">
          <div class="modal-head">
            <h2>发布文章</h2>
            <button class="modal-close" type="button" @click="publishOpen = false">×</button>
          </div>

          <label class="modal-row">
            <span class="row-label">封面</span>
            <span class="row-field">
              <button class="cover-box" type="button" :disabled="coverUploading" @click="coverInput?.click()">
                <img v-if="publishForm.cover" class="cover-img" :src="coverPreview" alt="封面" />
                <span v-else class="cover-placeholder">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {{ coverUploading ? '上传中…' : '上传封面' }}
                </span>
              </button>
              <button v-if="publishForm.cover" class="cover-remove" type="button" @click="publishForm.cover = ''">移除</button>
              <input ref="coverInput" class="img-input" type="file" accept="image/*" @change="handleCoverChange" />
            </span>
          </label>

          <label class="modal-row">
            <span class="row-label">专栏</span>
            <span class="row-field">
              <select v-model="publishForm.subjectId" class="form-input">
                <option value="" disabled>{{ subjectsLoading ? '专栏加载中…' : '请选择专栏' }}</option>
                <option v-for="s in subjects" :key="s.id" :value="String(s.id)">{{ s.title }}</option>
              </select>
            </span>
          </label>

          <label class="modal-row">
            <span class="row-label">简介</span>
            <span class="row-field">
              <textarea
                v-model="publishForm.desc"
                class="form-input form-textarea"
                rows="4"
                maxlength="255"
                placeholder="展示在文章列表的摘要，留空则不填"
              />
            </span>
          </label>

          <p v-if="publishTip" class="form-tip tip-error">{{ publishTip }}</p>

          <div class="modal-actions">
            <button class="btn ghost" type="button" @click="publishOpen = false">取消</button>
            <button class="btn primary" type="button" :disabled="publishing" @click="confirmPublish">
              {{ publishing ? '发布中…' : '确认发布' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

// 写文章是独立全屏流程：ssr 关闭（依赖 token），使用 editor 布局（无站头站脚）
definePageMeta({
  layout: 'editor'
})

const config = useRuntimeConfig()
const { user, fetchUserInfo } = useUser()
const { openLogin } = useAuthModal()

// ---------- 登录守卫 ----------
onMounted(() => {
  if (!getToken()) {
    openLogin()
    return navigateTo('/')
  }
  if (!user.value) {
    fetchUserInfo().catch(() => {})
  }
  loadDrafts()
})

// ---------- 编辑内容 ----------
const title = ref('')
const content = ref('')
const taRef = ref<HTMLTextAreaElement | null>(null)
const topTip = ref('')
const charCount = computed(() => content.value.replace(/\s/g, '').length)
const lineCount = computed(() => (content.value ? content.value.split('\n').length : 0))

let topTipTimer: ReturnType<typeof setTimeout> | null = null
const setTopTip = (message: string) => {
  topTip.value = message
  if (topTipTimer) {
    clearTimeout(topTipTimer)
  }
  topTipTimer = setTimeout(() => (topTip.value = ''), 3000)
}

// 选区替换：写回 v-model 并在渲染后恢复焦点与光标
const replaceRange = (start: number, end: number, text: string, caretStart?: number, caretEnd?: number) => {
  const el = taRef.value
  if (!el) {
    return
  }
  content.value = el.value.slice(0, start) + text + el.value.slice(end)
  nextTick(() => {
    el.focus()
    const s = caretStart ?? start + text.length
    const e = caretEnd ?? start + text.length
    el.setSelectionRange(s, e)
  })
}

// 行内包裹：加粗 / 斜体 / 行内代码
const wrapInline = (before: string, after: string, placeholder: string) => {
  const el = taRef.value
  if (!el) {
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = el.value.slice(start, end)
  const inner = selected || placeholder
  const caretStart = start + before.length
  replaceRange(start, end, before + inner + after, caretStart, caretStart + inner.length)
}

// 选区扩展到整行后逐行处理（引用 / 列表 / 标题）
const transformLines = (transform: (line: string, index: number) => string) => {
  const el = taRef.value
  if (!el) {
    return
  }
  const value = el.value
  let start = el.selectionStart
  const end = el.selectionEnd
  while (start > 0 && value[start - 1] !== '\n') {
    start--
  }
  const lines = value.slice(start, end).split('\n')
  const text = lines.map(transform).join('\n')
  replaceRange(start, end, text, start, start + text.length)
}

// 标题：无 → # → ## → ### → 无 循环（按首行当前级别推进）
const cycleHeading = () => {
  const el = taRef.value
  if (!el) {
    return
  }
  const lineStart = el.value.lastIndexOf('\n', el.selectionStart - 1) + 1
  const currentLine = el.value.slice(lineStart, el.selectionEnd)
  const level = currentLine.match(/^(#{1,3})\s/)
  const next = level ? (level[1].length >= 3 ? '' : '#'.repeat(level[1].length + 1) + ' ') : '# '
  transformLines((line) => next + line.replace(/^#{1,3}\s/, ''))
}

// 引用 / 无序列表：有前缀则去掉，没有则加上
const toggleLinePrefix = (prefix: string) => {
  transformLines((line) => {
    if (line.startsWith(prefix)) {
      return line.slice(prefix.length)
    }
    return prefix + line
  })
}

// 有序列表：按行编号 1. 2. 3.，已编号则还原
const toggleOrderedList = () => {
  let index = 0
  transformLines((line) => {
    const stripped = line.replace(/^\d+\.\s/, '')
    if (stripped !== line) {
      return stripped
    }
    index += 1
    return `${index}. ${line}`
  })
}

// 链接：选中文本作为标题，弹窗输入地址
const insertLink = () => {
  const el = taRef.value
  if (!el) {
    return
  }
  const selected = el.value.slice(el.selectionStart, el.selectionEnd)
  const url = window.prompt('请输入链接地址', 'https://')
  if (!url || url === 'https://') {
    return
  }
  wrapInline('[', `](${url})`, selected || '链接标题')
}

// 代码块
const insertCodeBlock = () => {
  const el = taRef.value
  if (!el) {
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = el.value.slice(start, end)
  const text = `\n\`\`\`\n${selected || '// 代码'}\n\`\`\`\n`
  replaceRange(start, end, text)
}

// 表格模板
const insertTable = () => {
  const el = taRef.value
  if (!el) {
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const text = `\n| 表头1 | 表头2 | 表头3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n`
  replaceRange(start, end, text)
}

// 分割线
const insertHr = () => {
  const el = taRef.value
  if (!el) {
    return
  }
  replaceRange(el.selectionStart, el.selectionEnd, '\n\n---\n\n')
}

// 快捷键：Ctrl+B / Ctrl+I
const handleShortcut = (event: KeyboardEvent) => {
  if (!(event.ctrlKey || event.metaKey)) {
    return
  }
  const key = event.key.toLowerCase()
  if (key === 'b') {
    event.preventDefault()
    wrapInline('**', '**', '加粗文本')
  } else if (key === 'i') {
    event.preventDefault()
    wrapInline('*', '*', '斜体文本')
  }
}

// ---------- 图片上传（工具栏按钮 + 粘贴） ----------
const imgInput = ref<HTMLInputElement | null>(null)
const imgUploading = ref(false)

const uploadImage = async (file: File, path: string) => {
  const form = new FormData()
  form.append('file', file)
  form.append('path', path)
  const res = await apiFetch<{ url: string }>('/api/common/upload', { method: 'POST', body: form })
  return res.data?.url || ''
}

const insertImage = (file: File) => {
  const el = taRef.value
  if (!el) {
    return Promise.resolve()
  }
  if (!/^image\//.test(file.type)) {
    setTopTip('请选择图片文件')
    return Promise.resolve()
  }
  if (file.size > 10 * 1024 * 1024) {
    setTopTip('图片不能超过 10MB')
    return Promise.resolve()
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  imgUploading.value = true
  return uploadImage(file, 'article/content')
    .then((url) => {
      if (!url) {
        setTopTip('图片上传失败')
        return
      }
      // 用绝对地址插入，保证编辑器预览与文章详情页都能直接显示
      const abs = toCoverUrl(config.public.apiBase, url)
      replaceRange(start, end, `![${file.name}](${abs})`)
    })
    .catch((error: any) => {
      setTopTip(error?.message || '图片上传失败')
    })
    .finally(() => {
      imgUploading.value = false
      if (imgInput.value) {
        imgInput.value.value = ''
      }
    })
}

const handleImgChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    insertImage(file)
  }
}

// 粘贴截图直接上传
const handlePaste = (event: ClipboardEvent) => {
  const file = Array.from(event.clipboardData?.files || []).find((f) => /^image\//.test(f.type))
  if (file) {
    event.preventDefault()
    insertImage(file)
  }
}

// ---------- 草稿箱（localStorage 自动保存） ----------
interface DraftItem {
  id: string
  userId: number
  title: string
  content: string
  updateTime: number
}

const DRAFT_KEY = 'article-drafts'
const drafts = ref<DraftItem[]>([])
const currentDraftId = ref('')
const draftOpen = ref(false)
const saveHint = ref('')

const myDrafts = computed(() => drafts.value.filter((d) => d.userId === user.value?.userId))

const formatDraftTime = (time: number) => dayjs(time).format('MM-DD HH:mm')

const loadDrafts = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]')
    drafts.value = Array.isArray(raw) ? raw : []
  } catch {
    drafts.value = []
  }
}

const persistDrafts = () => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.value))
}

const saveCurrentDraft = () => {
  if (!title.value.trim() && !content.value.trim()) {
    return
  }
  const userId = user.value?.userId
  if (!userId) {
    return
  }
  const existing = currentDraftId.value ? drafts.value.find((d) => d.id === currentDraftId.value) : null
  if (existing) {
    existing.title = title.value
    existing.content = content.value
    existing.updateTime = Date.now()
  } else {
    currentDraftId.value = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    drafts.value.unshift({
      id: currentDraftId.value,
      userId,
      title: title.value,
      content: content.value,
      updateTime: Date.now()
    })
  }
  persistDrafts()
  saveHint.value = `已自动保存至草稿箱 ${dayjs().format('HH:mm')}`
}

// 输入防抖自动保存
let saveTimer: ReturnType<typeof setTimeout> | null = null
watch([title, content], () => {
  if (saveTimer) {
    clearTimeout(saveTimer)
  }
  saveTimer = setTimeout(saveCurrentDraft, 800)
})

const loadDraft = (item: DraftItem) => {
  title.value = item.title
  content.value = item.content
  currentDraftId.value = item.id
  draftOpen.value = false
  saveHint.value = `已载入草稿 ${formatDraftTime(item.updateTime)}`
}

const removeDraft = (item: DraftItem) => {
  drafts.value = drafts.value.filter((d) => d.id !== item.id)
  persistDrafts()
  if (currentDraftId.value === item.id) {
    currentDraftId.value = ''
  }
}

// 点击面板外关闭草稿箱
onMounted(() => {
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
const onDocClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (draftOpen.value && !target.closest('.draft-wrap')) {
    draftOpen.value = false
  }
}

// ---------- 发布 ----------
const publishOpen = ref(false)
const publishing = ref(false)
const publishTip = ref('')
const subjects = ref<any[]>([])
const subjectsLoading = ref(false)
const publishForm = reactive({ subjectId: '', cover: '', desc: '' })
const coverInput = ref<HTMLInputElement | null>(null)
const coverUploading = ref(false)

const coverPreview = computed(() => toCoverUrl(config.public.apiBase, publishForm.cover))

// 简介：取正文纯文本前 100 字作为默认摘要
const autoDesc = () => {
  const plain = content.value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.slice(0, 100)
}

const fetchSubjects = async () => {
  subjectsLoading.value = true
  try {
    const res = await apiFetch<{ list?: any[] }>('/api/post/subject/guest/list', {
      query: { pageNum: 1, pageSize: 50 }
    })
    subjects.value = res.data?.list || []
  } catch {
    subjects.value = []
    publishTip.value = '专栏列表加载失败，请稍后重试'
  } finally {
    subjectsLoading.value = false
  }
}

const openPublish = () => {
  if (!title.value.trim()) {
    setTopTip('请先输入文章标题')
    return
  }
  if (!content.value.trim()) {
    setTopTip('请先输入文章内容')
    return
  }
  publishTip.value = ''
  publishForm.subjectId = ''
  publishForm.desc = autoDesc()
  publishOpen.value = true
  fetchSubjects()
}

const handleCoverChange = async (event: Event) => {
  const inputEl = event.target as HTMLInputElement
  const file = inputEl.files?.[0]
  inputEl.value = ''
  if (!file) {
    return
  }
  if (!/^image\//.test(file.type)) {
    publishTip.value = '请选择图片文件'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    publishTip.value = '图片不能超过 10MB'
    return
  }
  coverUploading.value = true
  try {
    const url = await uploadImage(file, 'article/cover')
    publishForm.cover = url
    publishTip.value = ''
  } catch (error: any) {
    publishTip.value = error?.message || '封面上传失败'
  } finally {
    coverUploading.value = false
  }
}

const confirmPublish = async () => {
  if (!publishForm.subjectId) {
    publishTip.value = '请选择专栏'
    return
  }
  publishing.value = true
  publishTip.value = ''
  try {
    // 直接以已发布状态创建（后端 create 透传 publishStatus，一步到位）
    const res = await apiFetch<{ id: number }>('/api/post/article', {
      method: 'POST',
      body: {
        title: title.value.trim(),
        subjectId: Number(publishForm.subjectId),
        desc: publishForm.desc.trim() || undefined,
        content: content.value,
        cover: publishForm.cover || undefined,
        source: '0',
        publishStatus: '2',
        publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const newId = res.data?.id
    // 发布成功后清掉对应本地草稿
    if (currentDraftId.value) {
      drafts.value = drafts.value.filter((d) => d.id !== currentDraftId.value)
      persistDrafts()
    }
    publishOpen.value = false
    return navigateTo({ path: '/article/detail', query: { id: String(newId) } })
  } catch (error: any) {
    publishTip.value = error?.message || '发布失败，请稍后重试'
  } finally {
    publishing.value = false
  }
}
</script>

<style lang="less" scoped>
.editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

// ---------- 顶栏 ----------
.editor-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 60px;
  padding: 0 20px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);

  .editor-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    .brand-logo {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background-image: var(--gradient-brand);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      white-space: nowrap;
    }
  }

  .title-input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background-color: transparent;
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text-1);

    &::placeholder {
      color: var(--color-text-3);
    }
  }

  .save-hint {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--color-text-3);
    white-space: nowrap;
  }

  .draft-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .draft-btn {
    padding: 5px 14px;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-sm);
    background-color: transparent;
    font-size: 13px;
    color: var(--color-primary);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-light);
    }

    .draft-count {
      margin-left: 4px;
    }
  }

  .draft-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 300px;
    max-height: 360px;
    overflow-y: auto;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-2);
    z-index: 20;

    .draft-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      cursor: pointer;
      border-bottom: 1px solid var(--color-border-light);
      transition: background-color 0.15s ease;

      &:hover {
        background-color: var(--color-bg);
      }

      &.current {
        .draft-item-title {
          color: var(--color-primary);
        }
      }

      .draft-item-title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        color: var(--color-text-1);
      }

      .draft-item-time {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--color-text-3);
      }

      .draft-item-del {
        flex-shrink: 0;
        display: flex;
        padding: 2px;
        border: 0;
        background-color: transparent;
        color: var(--color-text-3);
        cursor: pointer;
        transition: color 0.15s ease;

        &:hover {
          color: #d1242f;
        }
      }
    }

    .draft-empty {
      padding: 24px 14px;
      font-size: 12px;
      color: var(--color-text-3);
      text-align: center;
    }
  }

  .publish-btn {
    flex-shrink: 0;
    padding: 6px 20px;
    border: 0;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    font-size: 13px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-hover);
    }
  }
}

.top-tip {
  padding: 6px 20px;
  font-size: 12px;
  color: #d1242f;
  background-color: var(--color-surface);
}

// ---------- 工具栏 ----------
.editor-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 44px;
  padding: 0 12px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  overflow-x: auto;

  .tool-btn {
    flex-shrink: 0;
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

    &:hover:not(:disabled) {
      background-color: var(--color-bg);
      color: var(--color-text-1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.tool-text {
      font-size: 14px;
      font-weight: 600;
      font-family: Georgia, serif;

      i {
        font-weight: 400;
      }
    }

    &.tool-code {
      font-size: 11px;
      font-family: Consolas, Monaco, monospace;
      font-weight: 400;
    }
  }

  .tool-divider {
    flex-shrink: 0;
    width: 1px;
    height: 16px;
    margin: 0 6px;
    background-color: var(--color-border-light);
  }

  .img-input {
    display: none;
  }
}

// ---------- 编辑区 ----------
.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;

  .editor-input {
    flex: 1;
    min-width: 0;
    padding: 24px 32px;
    border: 0;
    outline: none;
    resize: none;
    background-color: var(--color-surface);
    font-size: 15px;
    line-height: 1.9;
    font-family: inherit;
    color: var(--color-text-1);
    caret-color: var(--color-primary);

    &::placeholder {
      color: var(--color-text-3);
    }
  }

  .editor-preview {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: 24px 40px;
    background-color: var(--color-surface);
    border-left: 1px solid var(--color-border-light);
  }
}

// ---------- 状态栏 ----------
.editor-status {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 28px;
  padding: 0 20px;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border-light);
  font-size: 12px;
  color: var(--color-text-3);

  .status-hint {
    margin-left: auto;
  }
}

// ---------- 发布弹窗 ----------
.publish-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);

  .publish-modal {
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
      width: 160px;
      height: 90px;
      padding: 0;
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-sm);
      background-color: var(--color-bg);
      cursor: pointer;
      overflow: hidden;
      transition: border-color 0.2s ease;

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
    }

    .cover-remove {
      padding: 0;
      border: 0;
      background-color: transparent;
      font-size: 12px;
      color: var(--color-text-3);
      cursor: pointer;

      &:hover {
        color: #d1242f;
      }
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
  }
}

@media (max-width: 900px) {
  .editor-body .editor-preview {
    display: none;
  }
}

@media (max-width: 640px) {
  .editor-topbar .title-input {
    font-size: 17px;
  }

  .editor-topbar .save-hint {
    display: none;
  }
}
</style>
