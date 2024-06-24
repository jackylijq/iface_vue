<template>
  <el-form class="add-group" ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="分组名称" prop="group_name">
      <el-input v-model="form.group_name" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="分组描述">
      <el-input v-model="form.group_desc" placeholder="请输入" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref, unref, defineEmits, defineProps, inject } from 'vue'
import axios from '@/lin/plugin/axios'
import store from '@/store'
import { ElMessage } from 'element-plus'

const props = defineProps(['data', 'isEdit', 'level'])

let injectGroupType = inject('group_type')

const emits = defineEmits(['submit-fn', 'cancel-fn'])
const rules = {
  group_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
}
const form = props.isEdit
  ? ref({
      id: props.data.otherData.id,
      group_name: props.data.otherData.group_name,
      group_desc: props.data.otherData.group_desc,
      group_type: injectGroupType,
      group_level: props.level,
      parents_id: props.data.id === '-1' ? 0 : props.data.parentId,
      edit_uid: store.getters.user.username,
    })
  : ref({
      group_name: '',
      group_desc: '',
      group_type: injectGroupType,
      group_level: props.level,
      parents_id: props.data.id === '-1' ? 0 : props.data.id,
      edit_uid: store.getters.user.username,
    })

const ruleFormRef = ref()
const onSubmit = async function () {
  let valid = await ruleFormRef.value.validate(valid => {
    return valid
  })
  if (valid) {
    let url = props.isEdit ? '/iftest/condition/group/modify' : '/iftest/condition/group/add'
    let res = await axios({
      method: 'post',
      url,
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

const onCancel = function () {
  emits('cancel-fn')
}
</script>
<style lang="scss" scoped>
.add-group {
  ::v-deep .el-form-item__content {
    > div {
      max-width: calc(100% - 30px);
    }
  }
}
</style>
