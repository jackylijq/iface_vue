<template>
  <div class="user-add">
    <el-form :model="form" label-width="auto" ref="refUserAdd" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email"> <el-input v-model="form.email" placeholder="请输入" /> </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input v-model="form.confirm_password" show-password placeholder="请输入" />
      </el-form-item>
    </el-form>
    <div style="display: flex; justify-content: flex-end">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, unref } from 'vue'

let form = ref({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirm_password: '',
})
let rules = {
  username: [
    { required: true, trigger: 'change', message: '用户名必填' },
    {
      validator(_, val, cb) {
        if (/^\w{2,10}$/.test(val)) {
          cb()
        } else {
          cb('用户名包含英文和数字，长度2-10位')
        }
      },
    },
  ],
  nickname: [{ required: true, trigger: 'change', message: '姓名必填' }],
  email: [
    { required: true, trigger: 'change', message: '邮箱必填' },
    {
      trigger: 'change',
      validator(rule, val, cb) {
        cb(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(val) ? undefined : '邮箱格式不正确')
      },
    },
  ],
  password: [
    { required: true, trigger: 'change', message: '密码必填' },
    {
      trigger: 'change',
      validator(rule, val, cb) {
        cb(
          unref(form).password === unref(form).confirm_password || !unref(form).confirm_password
            ? undefined
            : '两次密码不一致',
        )
      },
    },
  ],
  confirm_password: [
    { required: true, trigger: 'change', message: '确认密码必填' },
    {
      trigger: 'change',
      validator(rule, val, cb) {
        cb(
          unref(form).password === unref(form).confirm_password || !unref(form).password ? undefined : '两次密码不一致',
        )
      },
    },
  ],
}
let emits = defineEmits(['submit', 'cancel'])
let refUserAdd = ref()
async function submit() {
  let res = await unref(refUserAdd).validate()
  if (res) {
    emits('submit', unref(form))
  }
}

function cancel() {
  emits('cancel')
}
</script>
<style lang="scss" scoped></style>
