// 独立的辅助函数
export function appendParam(result: string[], key: string, value: any) {
  if (value !== null && value !== '' && typeof value !== 'undefined') {
    result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  }
}

// 独立的递归处理函数
export function walk(obj: any, path: string[], result: string[]) {
  if (obj === null || typeof obj !== 'object') {
    appendParam(result, path.join(']['), obj)
    return
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      walk(obj[key], [...path, key], result)
    }
  }
}
