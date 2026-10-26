import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  app: {
    head: {
      title: '游戏速递',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: '单机游戏,游戏资讯,游戏攻略,游戏评测' },
        { name: 'description', content: '专注分享游戏资讯，玩家攻略，游戏存档的快乐小站，希望为玩家们提供更好的游戏体验。' }
      ],
      link: []
    }
  },
  css: ['/assets/style/tokens.less', '/assets/style/base.less'],
  routeRules: {
    // 首页即文章列表，旧列表地址重定向过去
    '/article/list': { redirect: { to: '/', statusCode: 301 } }
  },
  runtimeConfig: {
    public: {
      // 后端服务器地址：接口路径与封面等静态资源的共同前缀
      // 通过环境变量 NUXT_PUBLIC_API_BASE 注入（见 .env.example），代码中不保存真实地址
      apiBase: ''
    }
  }
})
