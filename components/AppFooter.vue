<!-- 全站底部页脚：复用 FooterInfo 居中展示站点信息；首页不渲染（default 布局控制，站点信息改走首页右侧边栏） -->
<template>
  <footer class="footer">
    <div class="inner">
      <FooterInfo />
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

    :deep(.site-info .links) {
      justify-content: center;
    }
  }
}
</style>
