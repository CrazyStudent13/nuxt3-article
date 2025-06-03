import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'
// 环境变量配置，先这么做，后续在考虑改成其他方式，最好能把配置都笼到一个文件夹中
import { loadEnv } from 'vite'
const envName = (process.env as any).npm_lifecycle_script.match(/--mode\s(.*)/)?.[1]
const envData = loadEnv(envName, process.cwd()) // 获取.env文件中的配置
Object.assign(process.env, envData) // 将环境配置信息，添加到process.env

// https://nuxt.com/docs/api/configuration/nuxt-config

// 环境变量解决方式，先参考
// https://juejin.cn/post/6844904066175205390#heading-10
// https://juejin.cn/post/7197315175643643959
// https://juejin.cn/post/7242195696413982779?searchId=2025052622314151A1D4B557016677FFC7

// 引入删除控制台信息输出
// vite-plugin-remove-console

https: console.log(import.meta.env.VITE_BASE_API, '拿到基础链接')

export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    // public 下的变量可以在客户端和服务端使用
    public: {
      apiBase: `${import.meta.env.VITE_BASE_API}`
    }
  },
  vite: {
    envDir: '~/env'
  },
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
  alias: {
    //配置别名
    images: fileURLToPath(new URL('./assets/img', import.meta.url)),
    style: fileURLToPath(new URL('./assets/style', import.meta.url)),
    '@': fileURLToPath(new URL('./', import.meta.url))
  },
  // imports: {
  //   dirs: ['stores/**.{ts,js,mjs,mts}']
  // },
  modules: [
    // 添加 elementUI -Plus 模块
    [
      '@element-plus/nuxt',
      {
        defaultLocale: 'zh-cn'
      }
    ],
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // 自动引入 `defineStore()`
          'defineStore'
        ]
      }
    ]
  ]
})
