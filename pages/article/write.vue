<!-- todo 待完善，等后续组件太多的时候，进行统一的整合 -->
<template>
  <div>
    <MdEditor v-model="text" :value="value" @save="handleSave" />
  </div>
</template>

<script setup>
const text = ref('')

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

// watch(
//   () => props.value,
//   (val, oldVal) => {
//     // text.value = val.slice(1, -1).replace(/\\n/g, '\n')
//     console.log(val, '测试>>>')
//   },
//   { immediate: true }
// )

const handleSave = () => {
  console.log(props.value)
  console.log(text)
}

defineExpose({
  handleSave
})
</script>
