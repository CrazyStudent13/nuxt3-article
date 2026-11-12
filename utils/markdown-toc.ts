// 从 Markdown 源码提取标题大纲（文章详情页目录用）
// 与 MdViewer 的渲染约定一致：只认 ATX 标题（# ~ ######，# 后必须有空格）
export interface TocHeading {
  level: number // 1-6
  text: string // 纯文本标题（去掉行内标记，供目录展示）
}

export const extractMarkdownHeadings = (content?: string): TocHeading[] => {
  if (!content) {
    return []
  }
  // 剥离围栏代码块，避免 ``` 内的 # 注释被误认为标题
  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`]*`/g, (m) => m.replace(/`/g, ''))

  const headings: TocHeading[] = []
  for (const line of stripped.split('\n')) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (!match) {
      continue
    }
    // 拷贝到局部变量再判空：noUncheckedIndexedAccess 下捕获组是 string | undefined
    const level = match[1]
    const raw = match[2]
    if (!level || !raw) {
      continue
    }
    const text = raw
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接只留文字
      .replace(/[*_~]/g, '') // 强调标记
      .trim()
    headings.push({ level: level.length, text })
  }
  return headings
}
