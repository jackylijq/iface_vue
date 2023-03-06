<template>
  <div>
    <el-divider style="margin: 8px 0" />

    <el-descriptions class="border" direction="horizontal" :column="1">
      <el-descriptions-item label="用例名称">{{ form.case_title }}</el-descriptions-item>
      <el-descriptions-item label="接口地址">{{ form.request_url }}</el-descriptions-item>
      <el-descriptions-item label="请求方式">{{ form.request_method }}</el-descriptions-item>
      <el-descriptions-item label="执行结果">{{form.test_result}}</el-descriptions-item>
    </el-descriptions>

    <el-divider style="margin: 8px 0" />

    <el-form :model="form" label-width="120px">
      <el-form-item label="请求头">
        <el-input v-model="form.request_header" />
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
import { ref, onBeforeMount } from 'vue'
import router from '../../router'
import axios from '@/lin/plugin/axios'
let form = ref({})

let getFormData = async function () {
  let params = {
    case_id: router.currentRoute.value.query.case_id,
    batch_id: router.currentRoute.value.query.batch_id,
    scene_id: router.currentRoute.value.query.scene_id,
    id:router.currentRoute.value.query.id,
    curPage: 1,
    pageSize: 1,
  }

  let res = await axios({
    method: 'POST',
    url: '/iftest/case/atom/result/test_list',
    data: params,
  })

  let info = res.data.datasList[0]
  form.value = {
    ...info,
    // test_result:info.test_result==="pass"?"成功":"失败",
    request_header: JSON.stringify(info.request_header),
    request_param: JSON.stringify(info.request_param, null, 2),
    response: JSON.stringify(info.response, null, 2),
    result_check_detail: JSON.stringify(info.result_check_detail, null, 2),
  }
}
onBeforeMount(() => {
  getFormData()
})
</script>
<style lang="scss" scoped></style>
