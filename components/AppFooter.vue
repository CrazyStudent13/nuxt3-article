<template>
  <footer class="footer">
    <div class="inner">
      <div class="brand-line">
        <span class="brand-name">游戏速递</span>
        <span class="slogan">专注分享游戏资讯，玩家攻略，游戏存档的快乐小站</span>
      </div>
      <p class="disclaimer">本站大部分下载资源收集于网络，只做学习和交流使用，版权归原作者所有。</p>
      <p class="disclaimer">若本站发布的内容侵犯到您的权益，请联系站长，我们将及时下架相关内容。</p>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

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

  .brand-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;

    .brand-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-1);
    }

    .slogan {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }

  .disclaimer {
    font-size: 12px;
    line-height: 24px;
    color: var(--color-text-3);
  }
}
</style>
