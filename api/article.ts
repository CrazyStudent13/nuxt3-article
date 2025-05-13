import request from '@/utils/request'

// 获取文章列表
export function getArticleList(data: any) {
  return request({
    url: '/game/article/guest/list',
    params: data
  })
}

// 获取文章详情
export function getArticleDetail(id: string) {
  return request({
    url: `/game/article/guest/detail`,
    params: {
      gameId: id
    }
  })
}
