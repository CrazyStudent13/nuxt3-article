// 站点地图：静态路由 + 文章/专栏全量（guest 接口分页拉取）
// 站点部署在境外服务器，origin 从请求头推导，无需硬编码域名
interface SitemapUrl {
  loc: string
  lastmod?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const host = getRequestHeader(event, 'host') || 'localhost'
  const proto = getRequestHeader(event, 'x-forwarded-proto') || 'http'
  const origin = `${proto}://${host}`

  const urls: SitemapUrl[] = [
    { loc: `${origin}/` },
    { loc: `${origin}/column/list` },
    { loc: `${origin}/about` },
    { loc: `${origin}/agreement` },
    { loc: `${origin}/privacy` }
  ]

  try {
    const apiBase = config.public.apiBase
    // 文章全量分页拉取
    let page = 1
    for (;;) {
      const res: any = await $fetch(`${apiBase}/api/post/article/guest/list`, {
        query: { pageNum: page, pageSize: 100 }
      })
      const list: any[] = res?.data?.list || []
      for (const item of list) {
        urls.push({ loc: `${origin}/article/detail?id=${item.id}`, lastmod: item.createTime })
      }
      const total: number = res?.data?.total || 0
      if (!list.length || page * 100 >= total) {
        break
      }
      page += 1
    }

    // 专栏
    const res: any = await $fetch(`${apiBase}/api/post/subject/guest/list`, {
      query: { pageNum: 1, pageSize: 100 }
    })
    for (const item of res?.data?.list || []) {
      urls.push({ loc: `${origin}/column/detail?id=${item.id}`, lastmod: item.createTime })
    }
  } catch {
    // 后端不可达时至少返回静态路由，不让 sitemap 整体 500
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''
      return `  <url><loc>${u.loc}</loc>${lastmod}</url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`
})
