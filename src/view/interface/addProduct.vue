<template>
  <el-form class="add-product" ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="产品名称" prop="pro_name">
      <el-input v-model="form.pro_name" />
    </el-form-item>
    <el-form-item label="产品描述">
      <el-input v-model="form.pro_desc" />
    </el-form-item>
    <el-form-item label="产品标记" style="width: 50%">
      <el-input v-model="form.project_mark" />
      <el-tooltip
        class="box-item"
        effect="dark"
        content="产品通过GW调用时需要带入的前缀，微服务调用的时候会去掉的内容<br>（即微服务端口存在的情况下，接口调用不会加入该产品标记地址），<br>接口调用模式：http://x.x.x.x/产品标记/接口地址"
        placement="top"
        :raw-content="true"
      >
        <template #default>
          <svg
            t="1702365279956"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5796"
            width="16"
            height="16"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
              p-id="5797"
              fill="#999"
            ></path>
            <path
              d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7c0-19.7 12.4-37.7 30.9-44.8 59-22.7 97.1-74.7 97.1-132.5 0.1-39.3-17.1-76-48.3-103.3z"
              p-id="5798"
              fill="#999"
            ></path>
            <path d="M512 732m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" p-id="5799" fill="#999"></path>
          </svg>
        </template>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="微服务端口" style="width: 50%">
      <el-input v-model="form.pro_port" />
      <el-tooltip
        class="box-item"
        effect="dark"
        content="微服务端口不为空的情况下，接口调用模式为：<br>http://x.x.x.x:微服务端口/接口地址；会屏蔽掉产品标记的内容"
        placement="top"
        :raw-content="true"
      >
        <template #default>
          <svg
            t="1702365279956"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5796"
            width="16"
            height="16"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
              p-id="5797"
              fill="#999"
            ></path>
            <path
              d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7c0-19.7 12.4-37.7 30.9-44.8 59-22.7 97.1-74.7 97.1-132.5 0.1-39.3-17.1-76-48.3-103.3z"
              p-id="5798"
              fill="#999"
            ></path>
            <path d="M512 732m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" p-id="5799" fill="#999"></path>
          </svg>
        </template>
      </el-tooltip>
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

    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="$emit('cancel-fn')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref, unref, defineEmits } from 'vue'
import axios from '@/lin/plugin/axios'
import store from '@/store'
import { ElMessage } from 'element-plus'

const props = defineProps(['data', 'isEdit'])
const emits = defineEmits(['submit-fn', 'cancel-fn'])

const rules = {
  pro_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
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
const form = props.isEdit
  ? ref({
      id: props.data.otherData.id,
      pro_name: props.data.otherData.pro_name,
      pro_desc: props.data.otherData.pro_desc,
      project_mark: props.data.otherData.project_mark,
      pro_port: props.data.otherData.pro_port,
      notice_addr: props.data.otherData.notice_addr.split(',').map(v => ({
        addr: v,
        error: false,
      })),
      notice_mode:props.data.otherData.notice_mode,
      pro_line_id: 1,
      edit_uid: store.getters.user.username,
    })
  : ref({
      pro_name: '',
      pro_desc: '',
      project_mark: '',
      pro_port: '',
      pro_line_id: 1,
      edit_uid: store.getters.user.username,
      notice_addr: [{ addr: '', error: false }],
      notice_mode: 'error',
    })

function handleDelete(index) {
  if (form.value.notice_addr.length === 1) {
    form.value.notice_addr = [{ addr: '' }]
  } else {
    form.value.notice_addr.splice(index, 1)
  }
  ruleFormRef.value.validateField('notice_addr')
}

const ruleFormRef = ref()
const onSubmit = async function () {
  let valid = await ruleFormRef.value.validate(valid => {
    return valid
  })
  if (valid) {
    let url = props.isEdit ? '/iftest/product/proModify' : '/iftest/product/proAdd'
    let params = JSON.parse(JSON.stringify(unref(form)))
    params.notice_addr = params.notice_addr
      .filter(v => !!v)
      .map(v => v.addr)
      .join(',')
    let res = await axios({
      method: 'post',
      url,
      data: params,
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
.add-product {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
  }
  ::v-deep .el-form-item__content {
    > div {
      max-width: calc(100% - 30px);
    }
  }

  ::v-deep(.is-error .email li:not(.error) .el-input__wrapper) {
    box-shadow: rgb(220, 223, 230) 0px 0px 0px 1px inset;
  }
  ::v-deep(.is-error .email li.error .el-input__wrapper) {
    box-shadow: red 0px 0px 0px 1px inset;
  }
}
</style>
