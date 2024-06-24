<template>
  <el-form class="add-interface" ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="分组名称" prop="group_name">
      <el-input v-model="form.group_name" />
    </el-form-item>
    <el-form-item label="产品类型">
      <el-input v-model="form.group_type" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref, unref, defineEmits } from 'vue'
import axios from '@/lin/plugin/axios'
import store from '@/store'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['submit-fn'])

const rules = {
  group_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
}

const form = ref({
  group_name: '',
  group_type: '',
  group_level: 1,
  parents_id: '', //产品id
  pro_line_id: 1,
  edit_uid: store.getters.user.username,
})
const ruleFormRef = ref()
const onSubmit = async function () {
  let valid = await ruleFormRef.value.validate(valid => {
    return valid
  })
  if (valid) {
    let res = await axios({
      method: 'post',
      url: '/iftest/condition/group/add',
      data: unref(form),
    })

    ElMessage({
      type: res.code === 200 ? 'success' : 'error',
      message: res.message,
    })

    if (res.code === 200) {
      // 关闭弹框并且清空
      emits('submit-fn')
    }
  }
}
</script>
<style lang="scss" scoped>
.add-interface {
  ::v-deep .el-form-item__content {
    > div {
      max-width: calc(100% - 30px);
    }
  }
}
</style>
