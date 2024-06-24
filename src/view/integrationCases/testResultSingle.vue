<template>
  <div style="position: relative">
    <el-button type="primary" style="position: absolute; right: 8px; top: 8px" @click="reRun">重跑</el-button>
    <el-divider style="margin: 8px 0" />
    <el-descriptions class="border" direction="horizontal" :column="2">
      <el-descriptions-item label="用例名称">{{ form.case_title }}</el-descriptions-item>
      <el-descriptions-item label="编号">{{ form.case_id }}</el-descriptions-item>
      <el-descriptions-item label="接口地址">{{ form.request_url }}</el-descriptions-item>
      <el-descriptions-item label="请求方式">{{ form.request_method }}</el-descriptions-item>
      <el-descriptions-item label="执行结果">
        <span :class="form.test_result">{{ form.test_resultString }}</span>
        <el-button v-if="!form.test_result" type="primary" @click="getFormData">刷新</el-button>
      </el-descriptions-item>
      <el-descriptions-item label="错误信息" v-if="form.test_result === 'failed'">{{
        form.message
      }}</el-descriptions-item>
    </el-descriptions>

    <el-divider style="margin: 8px 0" />

    <el-form :model="form" label-width="120px">
      <el-form-item label="请求头">
        <el-input v-model="form.request_header" type="textarea" :rows="6" />
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input v-model="form.request_param" type="textarea" :rows="6" />
      </el-form-item>
      <el-form-item label="响应数据">
        <el-input v-model="form.response" type="textarea" :rows="6" />
      </el-form-item>
      <el-form-item label="数据检查">
        <el-input v-model="form.result_check_detail" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, unref } from 'vue'
import router from '../../router'
import axios from '@/lin/plugin/axios'
import { ElMessage } from 'element-plus'
let form = ref({})

let getFormData = async function () {
  let params = {
    case_id: router.currentRoute.value.query.case_id,
    batch_id: router.currentRoute.value.query.batch_id,
    scene_id: router.currentRoute.value.query.scene_id,
    id: router.currentRoute.value.query.id,
    curPage: 1,
    pageSize: 1,
  }

  let res = await axios({
    method: 'POST',
    url: '/iftest/case/atom/result/test_list',
    data: params,
  })

  let info = res.data.datasList[0] || {}
  form.value = {
    ...info,
    test_resultString: info.test_result === 'pass' ? '测试成功' : info.test_result === 'failed' ? '测试失败' : '',
    request_header: JSON.stringify(info.request_header, null, 2),
    request_param: JSON.stringify(info.request_param, null, 2),
    response: JSON.stringify(info.response, null, 2),
    result_check_detail: JSON.stringify(info.result_check_detail, null, 2),
  }
}

function reRun() {
  axios({
    url: '/iftest/case/atomRerun',
    method: 'POST',
    data: {
      case_id: unref(form).case_id,
      batch_id: unref(form).batch_id,
      id: unref(form).id,
    },
  }).then(res => {
    ElMessage[res.code == 200 ? 'success' : 'error'](res.message)
    if (res.code === 200) {
      let info = res.data
      form.value = {
        ...info,
        case_id:info.id,
        test_resultString: info.test_result === 'pass' ? '测试成功' : info.test_result === 'failed' ? '测试失败' : '',
        request_header: JSON.stringify(info.header,null, 2),
        request_param: JSON.stringify(info.request_param, null, 2),
        response: JSON.stringify(info.response, null, 2),
        result_check_detail: JSON.stringify(info.result_check_detail, null, 2),
      }
    }
  })
}
onBeforeMount(() => {
  getFormData()
})
</script>
<style lang="scss" scoped>
.pass {
  color: green;
}
.failed {
  color: red;
}
</style>
