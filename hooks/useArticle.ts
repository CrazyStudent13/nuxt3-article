// 草稿直接发布
export function draftToPublish(articleId: string) {
  ElMessageBox.confirm('您确定要发布文章吗?', '提示', {
    confirmButtonText: '发布',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(() => {
      ElMessage({ type: 'success', message: '发布成功' })
      setTimeout(() => {
        window.close()
      }, 1000)
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '取消发布' })
    })
}

// 直接发布
export function toPublish(articleId: string) {}

// 删除文章
export function toDelete(articleId: string) {}

// 草稿保存
export function draftSave(articleId: string) {}

// 草稿删除
export function draftDelete(articleId: string) {}
