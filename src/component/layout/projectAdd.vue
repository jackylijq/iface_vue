<template>
  <el-dialog v-model="model" title="新增项目" destroy-on-close @closed="close" width="500" class="project-add">
    <el-form :model="form" label-width="auto" :rules="rules" ref="refUserAdd">
      <el-form-item label="项目名称" prop="pro_line_name">
        <el-input v-model="form.pro_line_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="邮箱地址" prop="notice_addr">
        <ul class="email">
          <li
            v-for="(item, index) in form.notice_addr"
            style="display: flex; margin-bottom: 4px"
            :class="{ error: item.error }"
          >
            <el-input v-model="item.addr" style="width: 192px"></el-input>
            <el-button
              style="margin-left: 12px"
              v-show="index === 0"
              type="primary"
              @click="form.notice_addr.push({ addr: '' })"
              >添加</el-button
            >
            <el-button @click="handleDelete(index)">删除</el-button>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="通知模式">
        <el-radio v-model="form.notice_mode" label="error">出错通知</el-radio>
        <el-radio v-model="form.notice_mode" label="all">全部通知</el-radio>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, unref } from 'vue'

let model = defineModel()

let form = ref({
  pro_line_name: '',
  notice_addr: [{}],
  notice_mode: 'error',
})
function close() {
  form.value = {
    pro_line_name: '',
    notice_addr: [{}],
    notice_mode: 'error',
  }
}

function handleDelete(index) {
  if (form.value.notice_addr.length === 1) {
    form.value.notice_addr = [{ addr: '' }]
  } else {
    form.value.notice_addr.splice(index, 1)
  }
  refUserAdd.value.validateField('notice_addr')
}

let rules = {
  pro_line_name: [{ required: true, trigger: 'change', message: '项目名称必填' }],
  notice_addr: [
    {
      validator(rule, value, cb) {
        let ifError = false
        form.value.notice_addr.forEach(ele => {
          if (ele.addr) {
            ele.error = !/^[a-z0-9A-Z_-]+@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i.test(ele.addr)
            if (ele.error) {
              ifError = true
            }
          }
        })
        if (ifError) {
          cb('邮箱格式不正确')
        } else {
          cb()
        }
      },
      trigger: 'change',
    },
  ],
}
let refUserAdd = ref()
let emits = defineEmits(['submit', 'cancel'])
async function submit() {
  let res = await unref(refUserAdd).validate()
  if (res) {
    let data = JSON.parse(JSON.stringify(unref(form)))
    data.notice_addr = data.notice_addr
      .map(v => v.addr)
      .filter(v => v)
      .join(',')
    emits('submit',data)
  }
}
function cancel() {
  emits('cancel')
}
</script>
<style lang="scss">
.project-add {
  text-align: left !important;
}
</style>
