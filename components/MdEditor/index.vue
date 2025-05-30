<template>
  <MdEditor :autoFoldThreshold="autoFoldThreshold" v-model="text" @onChange="changeEditer" @onUploadImg="onUploadImg" :style="{ height: props.height }" />
</template>

<script setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const emit = defineEmits(['change', 'update:modelValue'])
const props = defineProps({
  height: {
    type: String,
    default: 'calc(100vh - 120px)'
  },
  modelValue: {},
  autoFoldThreshold: {
    //代码超过多少行就自动折叠
    type: Number,
    default: 80
  }
})
const text = ref(props.modelValue)
const changeEditer = (e) => {
  emit('update:modelValue', e)
}

//上传方法
const onUploadImg = async (files, callback) => {
  console.log(files[0])
  // 获取当前日期
  const currentDate = new Date()
  // 格式化日期
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1 // 月份从0开始，需要加1
  const day = currentDate.getDate()
  // 生成随机字符串
  const random = Math.floor(Math.random() * 1000000) // 生成0到999999之间的随机整数
  const randomString = String(random)
  // 拼接日期和随机字符串
  const result = year + month + day + randomString
  // 获得图片名称
  const name = result + '-' + files[0].name

  let formData = new FormData()
  formData.append('file', files[0])
  formData.append('fileName', name)
  formData.append('bucketName', 'mogu-app')
  const token = localStorage.getItem('token')
  await $fetch('/api/common/upload', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      credentials: 'same-origin'
    },
    body: formData
  }).then((res) => {
    if (res.code != 200) {
      ElMessage.error(res.message)
    }
    callback([res.data])
  })
}
</script>
