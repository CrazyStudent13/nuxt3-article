<!-- 站点信息块：首页右侧边栏与底部页脚共用（掘金式信息组织） -->
<template>
  <div class="site-info">
    <nav class="links">
      <NuxtLink to="/about">关于我们</NuxtLink>
      <NuxtLink to="/agreement">用户协议</NuxtLink>
      <NuxtLink to="/privacy">隐私政策</NuxtLink>
      <a href="javascript:void(0)" @click.prevent>友情链接</a>
    </nav>

    <a class="line mail" href="mailto:contact@example.com">举报邮箱：contact@example.com</a>

    <p class="line">本站大部分下载资源收集于网络，只做学习和交流使用，版权归原作者所有。</p>
    <p class="line">若本站发布的内容侵犯到您的权益，请联系站长，我们将及时下架相关内容。</p>

    <p class="copyright">©2026 游戏速递 · 境外服务器部署</p>
  </div>
</template>

<style lang="less" scoped>
.site-info {
  .links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-bottom: 14px;

    a {
      font-size: 13px;
      color: var(--color-text-2);
      transition: color 0.2s ease;
    }

    a:hover {
      color: var(--color-primary);
    }
  }

  .line {
    font-size: 12px;
    line-height: 22px;
    color: var(--color-text-3);
  }

  .mail {
    display: inline-block;
    margin-bottom: 4px;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }

  .copyright {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-light);
  }
}
</style>
