<template>
  <footer class="footer">
    <div class="inner">
      <!-- 链接组：协议类占位链接与真实页面并存 -->
      <nav class="links">
        <NuxtLink to="/about">关于我们</NuxtLink>
        <NuxtLink to="/column/list">专栏</NuxtLink>
        <a href="javascript:void(0)" @click.prevent>用户协议</a>
        <a href="javascript:void(0)" @click.prevent>隐私政策</a>
        <a href="javascript:void(0)" @click.prevent>友情链接</a>
      </nav>

      <a class="line mail" href="mailto:contact@example.com">举报邮箱：contact@example.com</a>

      <p class="line">本站大部分下载资源收集于网络，只做学习和交流使用，版权归原作者所有。</p>
      <p class="line">若本站发布的内容侵犯到您的权益，请联系站长，我们将及时下架相关内容。</p>

      <p class="line filing">ICP 备案号待补充</p>
      <p class="copyright">©2026 游戏速递</p>
    </div>
  </footer>
</template>

<style lang="less" scoped>
.footer {
  width: 100%;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border-light);

  .inner {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 28px 16px 32px;
    text-align: center;
  }

  .links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px 28px;
    margin-bottom: 18px;

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
    line-height: 24px;
    color: var(--color-text-3);
  }

  // 举报邮箱做成可点链接
  .mail {
    display: inline-block;
    margin-bottom: 6px;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }

  // 备案与版权之间加一道细分割线，层次更接近掘金页脚
  .filing {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--color-border-light);
  }

  .copyright {
    margin-top: 4px;
    font-size: 12px;
    color: var(--color-text-3);
  }
}
</style>
