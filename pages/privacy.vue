<template>
  <div class="legal">
    <article class="panel">
      <h1 class="title">隐私政策</h1>
      <p class="updated">更新日期：2026-11-13</p>

      <section>
        <h2>一、我们收集的信息</h2>
        <p>1. 注册信息：邮箱地址与密码（密码加密存储，任何人无法查看明文）。</p>
        <p>2. 你主动提供的内容：发布的文章、头像、昵称等资料。</p>
        <p>3. 使用数据：文章的阅读计数等基础统计信息。</p>
      </section>

      <section>
        <h2>二、信息用途</h2>
        <p>1. 账号识别与登录态维持。</p>
        <p>2. 展示你发布的内容与个人空间。</p>
        <p>3. 站点基础统计与内容安全治理。</p>
        <p>我们不会将你的信息出售或提供给无关第三方。</p>
      </section>

      <section>
        <h2>三、Cookie 与本地存储</h2>
        <p>1. 登录凭据通过 Cookie 保存，仅用于维持登录状态，退出登录即失效。</p>
        <p>2. 未发布的文章草稿保存在你浏览器的本地存储中，不会上传到服务器。</p>
      </section>

      <section>
        <h2>四、第三方服务</h2>
        <p>本站目前不接入第三方统计、广告或分析服务。未来如有引入，将在本页更新说明。</p>
      </section>

      <section>
        <h2>五、数据存储与安全</h2>
        <p>1. 数据存储于境外服务器，采用密码加密、访问控制等基础安全措施。</p>
        <p>2. 尽管我们尽力保护数据安全，互联网传输不存在绝对的安全，请知悉并理解。</p>
      </section>

      <section>
        <h2>六、你的权利</h2>
        <p>1. 随时在个人设置中修改资料、更换头像、修改密码。</p>
        <p>2. 删除自己发布的文章与内容。</p>
        <p>3. 如需注销账号或彻底删除数据，请联系站长处理。</p>
      </section>

      <section>
        <h2>七、未成年人</h2>
        <p>本站内容可能包含面向成年玩家的游戏资讯，未成年人请在监护人指导下使用。</p>
      </section>

      <section>
        <h2>八、政策更新与联系</h2>
        <p>本政策可能不时更新，更新后继续使用本站即视为知悉。如有疑问请联系：<a href="mailto:contact@example.com" class="mail">contact@example.com</a></p>
      </section>

      <NuxtLink to="/" class="back">← 返回首页</NuxtLink>
    </article>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '隐私政策 - 游戏速递',
  description: '游戏速递隐私政策：信息收集、用途、Cookie、数据安全与你的权利。'
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
