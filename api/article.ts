import request from '@/utils/request'

// 获取文章列表
export function getArticleList(data: any) {
  return request.get({
    url: '/game/article/guest/list',
    data
  })
}

// 获取文章详情
export function getArticleDetail(id: string) {
  return request.get({
    url: `/game/article/guest/detail`,
    data: {
      gameId: id
    }
  })
}
