<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="用例参数" name="first">
      <el-form label-width="120px">
        <el-form-item label="接口地址">
          <el-input v-model="formData.request_url" disabled>
            <template #prepend>
              <el-select disabled v-model="formData.request_method" class="select" style="width: 115px">
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="接口标题">
          <el-input disabled v-model="formData.case_title" />
        </el-form-item>
        <el-form-item label="接口描述">
            <el-input @blur="updateDetail('case_desc')" v-model="formData.case_desc" />
          </el-form-item>
        <el-form-item label="用例参数">
          <el-input
            type="textarea"
            @blur="updateInfo('case_variable')"
            :rows="7"
            v-model="formData.case_variable"
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="结果变量" name="second">
      <el-form label-width="120px">
        <el-form-item label="接口地址">
          <el-input v-model="formData.request_url" disabled>
            <template #prepend>
              <el-select disabled v-model="formData.request_method" class="select" style="width: 115px">
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="接口标题">
          <el-input disabled v-model="formData.case_title" />
        </el-form-item>
        <el-form-item label="接口描述">
            <el-input @blur="updateDetail('case_desc')" v-model="formData.case_desc" />
          </el-form-item>
        <el-form-item label="结果变量">
          <el-input
            type="textarea"
            @blur="updateInfo('result_variable')"
            :rows="7"
            v-model="formData.result_variable"
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { reactive, ref, defineProps, watchEffect, nextTick, defineEmits } from 'vue'
import { ElMessage } from "element-plus"
let props = defineProps({
  caseInfo: {
    type: Object,
    default: {},
  },
})
watchEffect(() => {
  let { id, request_url, request_method, case_title, case_variable, result_variable, case_desc } = props.caseInfo
  console.log(props.caseInfo)
  nextTick(() => {
    formData.request_method = request_method || ''
    formData.case_title = case_title || ''
    formData.request_url = request_url || ''
    formData.case_desc = case_desc || ''
    formData.case_variable = JSON.stringify(case_variable, null, 2)
    formData.result_variable = JSON.stringify(result_variable, null, 2)

    if (id === undefined) {
      activeName.value = 'first'
    }
  })
})

let activeName = ref('first')

let formData = reactive({
  request_url: '',
  request_method: '',
  case_title: '',
  case_detail: '',
  case_variable: '',
  result_variable: '',
})

let emits = defineEmits(['update:caseInfo'])

// 失焦时数据自动更新
let updateInfo = function (key) {
  let dataString = formData[key];
  let strMap = {
    result_variable: "结果变量",
    case_variable:"用例参数"
  }
  try {
    emits("update:caseInfo",{key,data:JSON.parse(dataString)})
  } catch (error) {
    ElMessage.error(`${strMap[key]}不能被格式化`)
  }
}
const updateDetail = key => {
  const dataString = formData[key]
  emits('update:caseInfo', { key, data: dataString })
}
</script>