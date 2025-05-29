# nuxt3-article

项目基于 nuxt3 开发，主要以展示文章为主。

## 业务方向

目前主要有以下几个方向，目前主要包含一下几个模块，后续会根据个人兴趣持续推进项目的发展。

### 文章模块

- [x] 文章列表
- [x] 文章详情
- [ ] 文章编辑（简介和内容）

### 用户模块

- [ ] 用户登录
- [ ] 用户注册
- [ ] 个人空间（主要是展示个人信息）

### 评论模块

- [ ] 通知列表
- [ ] 公告列表
- [ ] 文章评论区

希望后续能形成标准化的项目结构。



## 优化计划

目前为了实现功能，在平日里时间有限的情况下，我优先实现功能，忽略一些功能的整体性。

等到后续忙完手里的事情之后，我会尽可能的完善自己的项目

1. 环境配置都要放到env文件夹中，并且能够在request中使用
2. composables和hooks整合，命名规范化
3. 解决MdViewer在SSR的情况下，点击复制按钮没效果
4. 检测类的工具方法，单独拆出一个工具库
5. 全局引入dayjs的工具方法
6. 引入keepalive保证页面的缓存效果
7. 使用动画库，完善头像的放大缩小效果







## 目录结构

```
📁 .nuxt // Nuxt在开发中使用.nuxt/目录来生成你的Vue应用程序。
📁 .output // 当构建你的应用程序用于生产时，Nuxt 会创建 .output/ 目录。
📁 assets // 用于添加所有将由构建工具处理的网站资产,打包后会被处理。
📁 components // 放置所有 Vue 组件的地方。
📁 hooks // 将你的Vue组合式函数自动导入到你的应用程序中。
📁 layouts // Nuxt 提供了一个布局框架，用于将常见的 UI 模式提取为可重用的布局。
📁 middleware // Nuxt 提供了中间件来在导航到特定路由之前运行代码。
📁 modules // 在应用程序中自动注册本地模块。
📁 node_modules // 包管理器会将项目的依赖存储在 node_modules/ 目录中。
📁 pages // Nuxt 提供了基于文件的路由功能，用于在你的 Web 应用中创建路由。
📁 plugins // Nuxt拥有一个插件系统，可以在创建Vue应用程序时使用Vue插件和其他功能。
📁 public // 用于提供网站的静态资源。
📁 server // 用于在应用程序中注册API和服务器处理程序。
📁 utils // 在整个应用程序中自动导入你的工具函数。
📄 .env // 用于指定构建和开发环境变量。
📄 .gitignore // 指定了Git应该忽略的故意未跟踪的文件。
📄 .nuxtignore // 允许 Nuxt 在构建阶段忽略项目根目录下的文件。
📄 app.vue // Nuxt 应用的主要组件，入口文件。
📄 app.config.ts // 使用App Config文件在应用程序中公开响应式配置。
📄 nuxt.config.ts // Nuxt可以通过一个单独的nuxt.config文件进行简单配置。
📄 package.json // 包含了应用程序的所有依赖项和脚本。
📄 tsconfig.json // Nuxt会根据你在Nuxt项目中使用的别名，以及其他合理的默认值，自动生成一个`.nuxt/tsconfig.json`文件。

```

## 构建项目

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## 启动项目

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## 部署打包

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

## 本地预览

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
