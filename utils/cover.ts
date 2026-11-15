// 封面地址补全：后端可能返回相对路径（/profile/...），需要拼上服务器地址
export const toCoverUrl = (apiBase: string, cover?: string) => {
  if (!cover) {
    return ''
  }
  return /^https?:\/\//.test(cover) ? cover : `${apiBase}${cover}`
}
