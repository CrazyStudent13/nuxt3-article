<template>
  <el-card shadow="hover" class="card">
    <div class="row">
      <div class="row-cover">
        <el-image style="width: 120px; height: 120px" :src="props.cardInfo.cover" fit="fill" />
      </div>
      <div class="row-text">
        <h3>{{ props.cardInfo.title }}</h3>
        <p class="row-text-item content">{{ props.cardInfo.remark }}</p>
        <p class="row-text-item row-text-footer">
          <span class="date">发布时间：{{ publishTime || '-' }}</span>
          <span class="author">作者：{{ props.cardInfo.author || '暂无作者' }}</span>
          <span class="read">阅读量：{{ props.cardInfo.read || '暂无作者' }}</span>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
const props = defineProps({
  cardInfo: {
    type: Object,
    default: () => ({})
  }
})

const publishTime = computed(() => {
  return dayjs(props?.cardInfo?.publishTime).format('YYYY-MM-DD HH:mm:ss') || '-'
})
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 18px;
}

.row {
  height: 120px;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  cursor: pointer;

  &-cover {
    width: 100px;
    margin-right: 30px;
  }

  &-text {
    font-size: 14px;

    &-item {
      display: inline-block;
      margin: 4px 0;
    }

    .content {
      font-size: 12px;
      line-height: 22px;
      color: #606266;
    }

    &-footer {
      color: #909399;
      margin-top: 8px;
      font-size: 12px;

      span {
        margin-right: 20px;
      }

      .date {
        text-align: right;
      }
    }
  }
}
</style>
