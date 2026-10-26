<template>
  <div class="markdown-body">
    <div v-html="resultStr"></div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import ClipboardJS from 'clipboard'
import 'highlight.js/styles/github-dark.css'
import '@/assets/style/github-markdown.less'
import '@/assets/style/markdown.less'

const props = withDefaults(
  defineProps<{
    value?: string
  }>(),
  {
    value: ''
  }
)

let clipboard: ClipboardJS | null = null

const escapeTextarea = (value: string) => value.replace(/<\/textarea>/g, '&lt;/textarea>')

// 接口返回的内容可能被引号包裹，仅在两端引号匹配时才剥离，避免截断正常内容
const normalizeContent = (value: string) => {
  let temp = value

  const wrappedBy =
    (temp.length >= 2 && temp.startsWith('"') && temp.endsWith('"')) ||
    (temp.length >= 2 && temp.startsWith("'") && temp.endsWith("'"))

  if (wrappedBy) {
    temp = temp.slice(1, -1)
  }

  return temp.replace(/\\n/g, '\n')
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    const codeIndex = Date.now() + Math.floor(Math.random() * 10000000)
    let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`
    const linesLength = str.split(/\n/).length - 1
    let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'

    for (let index = 0; index < linesLength; index++) {
      linesNum += '<span></span>'
    }

    linesNum += '</span>'

    if (lang && hljs.getLanguage(lang)) {
      try {
        const preCode = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        html += preCode

        if (linesLength) {
          html += `<b class="name">${lang}</b>`
        }

        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position:absolute;top:-9999px;left:-9999px;z-index:-9999;" id="copy${codeIndex}">${escapeTextarea(str)}</textarea>`
      } catch (error) {
        console.error(error)
      }
    }

    html += md.utils.escapeHtml(str)
    return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position:absolute;top:-9999px;left:-9999px;z-index:-9999;" id="copy${codeIndex}">${escapeTextarea(str)}</textarea>`
  }
})

onMounted(() => {
  clipboard = new ClipboardJS('.copy-btn')
  clipboard.on('success', (event) => {
    event.clearSelection()
    const trigger = event.trigger as HTMLElement | undefined
    if (trigger) {
      trigger.textContent = '已复制'
      trigger.classList.add('copied')
      setTimeout(() => {
        trigger.textContent = '复制'
        trigger.classList.remove('copied')
      }, 1500)
    }
  })
  clipboard.on('error', (event) => {
    console.error('Action:', event.action)
    console.error('Trigger:', event.trigger)
  })
})

onBeforeUnmount(() => {
  clipboard?.destroy()
  clipboard = null
})

const resultStr = computed(() => {
  const val = props.value

  if (!val) {
    return ''
  }

  const tempStr = normalizeContent(val)
  return md.render(tempStr)
})
</script>

<style lang="less">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}

.hljs {
  padding: 12px 2px 12px 40px !important;
  border-radius: 5px !important;
  position: relative;
  font-size: 14px !important;
  line-height: 22px !important;
  overflow: hidden !important;

  code {
    display: block !important;
    margin: 0 10px !important;
    overflow-x: auto !important;

    &::-webkit-scrollbar {
      z-index: 11;
      width: 6px;
    }

    &::-webkit-scrollbar:horizontal {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      width: 6px;
      background: #666;
    }

    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background: #1e1e1e;
    }

    &::-webkit-scrollbar-track-piece {
      background: #1e1e1e;
      width: 6px;
    }
  }

  .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 12px;
    bottom: 12px;
    left: 0;
    font-size: 100%;
    width: 40px;
    text-align: center;
    letter-spacing: -1px;
    border-right: 1px solid rgba(0, 0, 0, 0.35);
    user-select: none;
    counter-reset: linenumber;

    span {
      pointer-events: none;
      display: block;
      counter-increment: linenumber;

      &:before {
        content: counter(linenumber);
        color: #999;
        display: block;
        text-align: center;
      }
    }
  }

  b.name {
    position: absolute;
    top: 2px;
    right: 50px;
    z-index: 10;
    color: #999;
    pointer-events: none;
  }
}

.hljs {
  position: relative;

  .copy-btn {
    position: absolute;
    right: 16px;
    top: 0;
    z-index: 99;
    color: #333;
    padding: 4px 8px;
    cursor: pointer;
    background-color: #fff;
    border: 0;
    border-radius: 4px;
    font-size: 12px;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }

    &.copied {
      color: var(--color-primary);
    }
  }
}
</style>
