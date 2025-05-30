<!-- todo： 目前页面的功能待完善，缺少保存草稿，保存提交,顶部最好要像掘金一样有标题栏功能 -->
<template>
  <div class="write-header">
    <div class="write-header-title write-header-item">
      <input v-model="title" placeholder="请输入标题..." />
    </div>
    <div class="write-header-actions write-header-item">
      <el-button type="info" @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">发布</el-button>
    </div>
  </div>
  <MdEditor v-model="text" :value="value" @save="handleSave" />
</template>

<script setup>
const text = ref('')
const router = useRouter()
import { draftToPublish } from '@/hooks/useArticle'

const handleCancel = () => {
  ElMessage({ type: 'success', message: '已保存草稿！' })
  setTimeout(() => {
    window.close()
  }, 1000)
}
const handleSave = () => {
  draftToPublish()
}
</script>

<style lang="less" scoped>
.write-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 55px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-title {
    float: left;
    margin: 0 12px;
    font-size: 16px;
    line-height: 55px;
    input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-size: 18px;
      line-height: 55px;
      color: #333;
    }
  }

  &-actions {
    float: right;
    padding: 0 8px;
    &::after {
      content: ' ';
      display: block;
      clear: both;
    }
  }
}
</style>
