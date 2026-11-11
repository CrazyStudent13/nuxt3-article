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
      link: [],
      // 防闪烁：首屏绘制前按 localStorage/系统偏好挂 html.dark（与 useTheme 同步）
      script: [
        {
          innerHTML:
            "(function(){try{var m=localStorage.getItem('theme')||'light';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;d?el.classList.add('dark'):el.classList.remove('dark')}catch(e){}})()"
        }
      ]
    }
  },
  css: ['/assets/style/tokens.less', '/assets/style/base.less'],
  routeRules: {
    // 首页即文章列表，旧列表地址重定向过去
    '/article/list': { redirect: { to: '/', statusCode: 301 } },
    // 个人中心 / 设置页依赖客户端 token 与登录态，关闭 SSR
    '/user/space': { ssr: false },
    '/user/settings': { ssr: false },
    // 写文章：独立编辑器流程，依赖客户端 token
    '/editor/new': { ssr: false }
  },
  runtimeConfig: {
    public: {
      // 后端服务器地址：接口路径与封面等静态资源的共同前缀
      // 通过环境变量 NUXT_PUBLIC_API_BASE 注入（见 .env.example），代码中不保存真实地址
      apiBase: ''
    }
  }
})
