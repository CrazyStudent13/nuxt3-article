// robots.txt：允许全站抓取并指向 sitemap（地址从请求头推导，兼容开发/生产环境）
export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || 'localhost'
  const proto = getRequestHeader(event, 'x-forwarded-proto') || 'http'

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${proto}://${host}/sitemap.xml\n`
})
