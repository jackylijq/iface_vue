<template>
    <div class="atomic-cases-add">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="用例标题" prop="case_title">
                <el-input v-model="formData.case_title" />
            </el-form-item>
            <el-form-item required label="用例描述" prop="case_desc">
                <!-- <el-input v-model="formData.case_desc" /> -->
                <el-input v-model="formData.case_desc" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item label="用例类型" prop="case_type">
                <el-radio-group v-model="formData.case_type">
                    <el-radio label="正常" />
                    <el-radio label="异常" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="用例状态" prop="case_status">
                <el-input v-model="formData.case_status" />
            </el-form-item>

            <el-form-item label="请求头" prop="header">
                <el-input v-model="formData.header" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item label="请求参数" prop="request_param">
                <el-input v-model="formData.request_param" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item label="响应参数" prop="response">
                <el-input v-model="formData.response" :rows="3" type="textarea" />
            </el-form-item>

            <el-form-item label="检查内容" prop="result_check">
                <el-input v-model="formData.result_check" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item label="用例参数" prop="case_variable">
                <el-input v-model="formData.case_variable" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item label="结果变量" prop="result_variable">
                <el-input v-model="formData.result_variable" :rows="3" type="textarea" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(ruleFormRef)">创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { ref, reactive, unref } from 'vue'
import router from '@/router'
import axios from '@/lin/plugin/axios'
import { ElMessage } from 'element-plus'
import emitter from 'lin/util/emitter'

export default {
  setup() {
    const ruleFormRef = ref()
    const formData = ref({
      case_title: '',
      case_desc: '',
      case_type: '正常',
      case_status: '',
      header: '',
      request_param: '',
      response: '',
      result_check: `{
    "check_type":"response",
    "check_sql":"",
    "check_field":{},
    "check_position":""
}`,
      case_variable: '',
      result_variable: '',
    })

    // 校验json
    function jsonValidator(rule, value, cb) {
      if (!value) cb()
      try {
        if (parseInt(value, 10) > -1) throw new Error('error')
        JSON.parse(value)
        cb()
      } catch (e) {
        cb('请输入正确的json')
      }
    }
    const rules = reactive({
      case_title: [{ required: true, message: '请输入用例标题', trigger: 'change' }],
      case_desc: [{required: false, message: '请输入用例描述', trigger: 'change' }],
      case_status: [{message: '请输入用例状态', trigger: 'change' }],
      header: [
        // { required: true, message: '请输入请求头', trigger: 'change' },
        {
          validator: jsonValidator,
          trigger: 'blur',
        },
      ],
      request_param: [
        { required: true, message: '请输入请求参数', trigger: 'change' },
        {
          validator: jsonValidator,
          trigger: 'blur',
        },
      ],
      response: [
        { required: true, message: '请输入响应参数', trigger: 'change' },
        {
          validator: jsonValidator,
          trigger: 'blur',
        },
      ],
      result_check: [
        {
          validator: jsonValidator,
          trigger: 'blur',
        },
      ],
      case_variable: [
        {
          validator: jsonValidator,
          trigger: 'blur',
        },
      ],
      result_variable: [
        {
          validator: jsonValidator,
          trigger: 'blur',
        },
      ],
    })
    function onSubmit(formEl) {
      if (!formEl) return
      formEl.validate(async (valid, fields) => {
        if (valid) {
          const { iface_id } = unref(router.currentRoute).query
          const res = await axios({
            method: 'post',
            url: '/iftest/case/standStom/add',
            data: { ...unref(formData), iface_id },
          })

          ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
          if (res.code == 200) {
            emitter.emit('custom-close')
          }
        }
      })
    }
    return {
      ruleFormRef,
      formData,
      rules,
      onSubmit,
    }
  },
}
</script>
<style lang="scss" scoped>
.atomic-cases-add {
    width: 50%;
    min-width: 700px;
    padding: 20px;
}
</style>
