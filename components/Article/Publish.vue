<template>
  <!-- 添加或修改文章对话框 -->
  <el-dialog :title="title" v-model="open" width="700px" append-to-body>
    <el-form ref="ArticleRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" clearable maxlength="25" show-word-limit />
      </el-form-item>
      <el-form-item label="文章简介" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入文章简介" type="textarea" :rows="5" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="form.publishTime" type="datetime" placeholder="请选择发布时间" format="YYYY/MM/DD HH:mm:ss" />
      </el-form-item>
      <!-- todo: 文件上传公用组件的封装 -->
      <!-- <el-form-item label="文章封面" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入编码名称" />
        </el-form-item> -->
      <!-- <el-form-item label="文章状态" prop="status">
          <el-select v-model="form.status" clearable>
            <el-option v-for="dict in sys_article_status" :value="dict.value">{{ dict.label }}</el-option>
          </el-select>
        </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">发布</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const data = reactive({
  form: {},
  rules: {
    title: [{ required: true, message: '文章名称不能为空', trigger: 'blur' }],
    remark: [{ required: true, message: '文章简介不能为空', trigger: 'blur' }],
    publishTime: [{ required: true, message: '发布时间不能为空', trigger: ['blur', 'change'] }]
  }
})

/** 提交按钮 */
function submitForm() {
  ElMessage.success('提交成功')
  //   console.log(form.value)
  //   proxy.$refs['ArticleRef'].validate((valid) => {
  //     if (valid) {
  //       if (form.value.articleId != undefined) {
  //         updateArticle(form.value).then((res) => {
  //           proxy.$modal.msgSuccess('修改成功')
  //           open.value = false
  //           getList()
  //         })
  //       } else {
  //         addArticle(form.value).then((res) => {
  //           proxy.$modal.msgSuccess('新增成功')
  //           open.value = false
  //           getList()
  //         })
  //       }
  //     }
  //   })
}

const handleSubmit = () => {
  ElMessage.success('提交成功')
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
</script>

<style lang="scss" scoped></style>
