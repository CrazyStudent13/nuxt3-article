<template>
  <footer class="footer">
    <div class="inner">
      <nav class="links">
        <NuxtLink to="/about">关于我们</NuxtLink>
        <NuxtLink to="/column/list">专栏</NuxtLink>
        <button type="button" @click="openLogin()">登录</button>
        <button type="button" @click="openRegister()">注册</button>
      </nav>

      <p class="line">本站大部分下载资源收集于网络，只做学习和交流使用，版权归原作者所有。</p>
      <p class="line">若本站发布的内容侵犯到您的权益，请联系站长，我们将及时下架相关内容。</p>
      <p class="line">联系邮箱：contact@example.com</p>

      <p class="copyright">©2026 游戏速递 · ICP备案号待补充</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { openLogin, openRegister } = useAuthModal()
</script>

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
    margin-bottom: 16px;

    a,
    button {
      font-size: 13px;
      color: var(--color-text-2);
      transition: color 0.2s ease;
    }

    a:hover,
    button:hover {
      color: var(--color-primary);
    }

    button {
      border: 0;
      background-color: transparent;
      cursor: pointer;
      padding: 0;
    }
  }

  .line {
    font-size: 12px;
    line-height: 24px;
    color: var(--color-text-3);
  }

  .copyright {
    margin-top: 10px;
    font-size: 12px;
    color: var(--color-text-3);
  }
}
</style>
