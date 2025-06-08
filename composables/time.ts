// 全局封装一些时间类方法

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 使用本地化语言

// 参考链接：https://blog.csdn.net/Warminlove/article/details/133268060

const timeFromNow = (time: string) => {
  let nowtimes = new Date().getTime()
  let times = new Date(time).getTime()
  if (times <= nowtimes - 7 * 24 * 60 * 60 * 1000) {
    return dayjs(time).format('MM-DD')
  } else if (nowtimes - times < 60 * 1000) {
    return Math.floor((nowtimes - times) / 1000) + '秒前'
  } else {
    return dayjs(time).fromNow().replace(' ', '')
  }
}

export default {
  $dayjs: dayjs,
  $timeFromNow: timeFromNow
}
