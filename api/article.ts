// 获取文章列表
export function getArticleList(data: any) {
  return request({
    url: '/game/article/guest/list',
    method: 'get',
    params: data
  })
}

// 获取文章详情
export function getArticleDetail(id: string) {
  return request({
    url: `/game/article/guest/detail`,
    method: 'get',
    params: {
      gameId: id
    }
  })
}
