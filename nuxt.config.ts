import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  app: {
    head: {
      title: '游戏速递',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: '单机游戏,游戏资讯,游戏攻略,游戏评测' },
        { name: 'description', content: '专注分享游戏资讯，玩家攻略，游戏存档的快乐小站，希望为玩家们提供更好的游戏体验。' }
      ],
      link: []
    }
  },
  css: ['/assets/style/base.less', 'element-plus/dist/index.css'],
  modules: ['@element-plus/nuxt'],
  elementPlus: {
    defaultLocale: 'zh-cn'
  }
})
