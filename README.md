# nuxt3-article

基于 Nuxt 4 的内容展示项目（文章 + 专栏，SSR 渲染），当前使用 `pnpm` + `Volta` 管理依赖与运行时版本。

## Tech Stack

- Nuxt 4
- Vue 3
- Less（设计变量见 `assets/style/tokens.less`）
- markdown-it + highlight.js（文章正文渲染）
- pnpm
- Volta

## Version Policy

为了保证团队开发环境一致，项目约定如下：

- 使用 `Volta` 锁定 Node 版本，当前版本见 [package.json](package.json) 中的 `volta.node`
- 使用 `packageManager` 锁定 `pnpm` 版本
- 使用 `engines` 约束允许的 `Node` 和 `pnpm` 范围
- 使用 `.npmrc` 中的 `engine-strict=true` 与 `package-manager-strict=true` 在安装时尽早失败

当前推荐环境：

- Node `20.19.0`
- pnpm `9.12.3`

## Setup

建议优先安装 Volta，然后在项目目录中直接执行：

```bash
pnpm install
```

如果本机已经安装 Volta，进入项目目录后会自动切换到项目指定的 Node 版本。

## Environment

项目不把任何服务器地址写进代码，接口地址等敏感配置通过环境变量注入：

| 变量 | 说明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE` | 后端 API 服务器地址（接口路径与文章封面的共同前缀，结尾不带 `/`） |

首次开发前复制环境变量模板并填入真实值：

```bash
cp .env.example .env
```

`.env` 已被 gitignore，不会进入版本库。生产部署时通过部署平台的同名环境变量注入（Nuxt 运行时配置的 env 映射规则：`NUXT_PUBLIC_API_BASE` → `runtimeConfig.public.apiBase`）。

## Development

启动开发环境：

```bash
pnpm dev
```

类型检查：

```bash
pnpm typecheck
```

## Production

构建生产包：

```bash
pnpm build
```

本地预览生产构建：

```bash
pnpm preview
```

## Team Notes

- 不要使用 `npm install` 或 `yarn install`，统一使用 `pnpm`
- 不要手动切换到与项目约定不一致的 Node 主版本
- 升级 `Node`、`pnpm` 或 `Nuxt` 时，同时更新 `volta`、`packageManager`、`engines` 和相关文档
- 不要把服务器地址、密钥等敏感信息硬编码进源码或提交进版本库，一律走环境变量
