<template>
  <div class="legal">
    <article class="panel">
      <h1 class="title">用户协议</h1>
      <p class="updated">更新日期：2026-11-13</p>

      <section>
        <h2>一、服务说明</h2>
        <p>游戏速递（以下简称"本站"）是一个游戏资讯与玩家攻略分享的小站。访问或使用本站服务，即表示你已阅读并同意本协议的全部内容。</p>
      </section>

      <section>
        <h2>二、账号</h2>
        <p>1. 注册时请提供真实有效的邮箱地址，用于账号识别与找回。</p>
        <p>2. 你应妥善保管账号密码，因保管不善造成的损失由你自行承担。</p>
        <p>3. 账号仅限本人使用，不得出借、转让或出售。</p>
      </section>

      <section>
        <h2>三、用户内容</h2>
        <p>1. 你在本站发布的文章、评论等内容，责任由你自行承担。请确保你拥有所发布内容的相应权利。</p>
        <p>2. 禁止发布法律法规禁止的内容，包括但不限于违法违规、侵犯他人权益、恶意攻击类信息。</p>
        <p>3. 对于违规内容，本站有权不经通知直接下架或删除，情节严重者将封禁账号。</p>
      </section>

      <section>
        <h2>四、知识产权</h2>
        <p>1. 本站原创内容（页面设计、原创文章等）版权归本站或原作者所有，未经许可请勿整站镜像或商用。</p>
        <p>2. 转载内容版权归原作者所有，本站仅作学习交流之用。若内容侵犯了你的权益，请联系站长，我们将及时下架。</p>
      </section>

      <section>
        <h2>五、免责声明</h2>
        <p>1. 本站部分资源收集于网络，只做学习和交流使用，请于下载后 24 小时内删除。</p>
        <p>2. 本站对外部链接的内容不作担保，访问第三方站点产生的风险由你自行承担。</p>
        <p>3. 因不可抗力、网络故障等原因导致服务中断，本站不承担责任。</p>
      </section>

      <section>
        <h2>六、服务变更与终止</h2>
        <p>本站有权根据实际情况调整或终止部分服务。若你违反本协议，本站有权随时限制或终止你的账号使用。</p>
      </section>

      <section>
        <h2>七、协议更新</h2>
        <p>本协议可能不时更新，更新后继续使用本站即视为接受新版本。</p>
      </section>

      <section>
        <h2>八、联系我们</h2>
        <p>对本协议或本站服务有任何疑问，请联系：<a href="mailto:contact@example.com" class="mail">contact@example.com</a></p>
      </section>

      <NuxtLink to="/" class="back">← 返回首页</NuxtLink>
    </article>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '用户协议 - 游戏速递',
  description: '游戏速递用户协议：服务说明、账号、用户内容、知识产权与免责声明。'
})
</script>

<style lang="less" scoped>
.legal {
  display: flex;
  justify-content: center;
  padding: 24px 0 40px;
}

.panel {
  width: 100%;
  max-width: 820px;
  padding: 36px 44px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);

  .title {
    font-size: 26px;
    font-weight: 600;
    color: var(--color-text-1);
    margin-bottom: 6px;
  }

  .updated {
    font-size: 13px;
    color: var(--color-text-3);
    padding-bottom: 18px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--color-border-light);
  }

  section {
    margin-bottom: 22px;

    h2 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      line-height: 26px;
      color: var(--color-text-2);
      margin-bottom: 6px;
    }

    .mail {
      color: var(--color-primary);

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .back {
    display: inline-block;
    margin-top: 8px;
    font-size: 13px;
    color: var(--color-text-3);
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }
}

@media (max-width: 640px) {
  .panel {
    padding: 24px 20px;
  }
}
</style>
