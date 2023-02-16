<template>
  <div>
    <el-descriptions class="border" direction="horizontal" :column="1">
      <el-descriptions-item label="用例名称">{{ testInfo.case_title }}</el-descriptions-item>
      <el-descriptions-item label="执行状态"
        >成功: {{ testInfo.pass_num || 0 }} 失败: {{ testInfo.failed_num || 0 }} 未执行:{{ testInfo.un_run_num || 0 }}
        <el-button type="primary" v-show="testInfo.un_run_num != 0" @click="handleRefresh"
          >刷新</el-button
        ></el-descriptions-item
      >
      <el-descriptions-item label="执行结果"
        >{{ testInfo.un_run_num > 0 ? '未完成' : testInfo.failed_num > 0 ? '失败' : '成功' }}
      </el-descriptions-item>
    </el-descriptions>

    <p style="font-size: 14px; margin: 8px 0; text-indent: 8px">执行情况详情</p>
    <el-table :data="tabbleData" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column :show-overflow-tooltip="true" prop="case_title" label="用例名称">
        <template #default="{ row }">
          <span @click="handleDetail(row)" style="color: #3963bc; cursor: pointer">{{ row.case_title }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="test_result" label="执行结果" />
      <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="执行人员" />
      <el-table-column :show-overflow-tooltip="true" prop="update_time" label="执行时间" />
      <el-table-column :show-overflow-tooltip="true" prop="message" label="失败原因" />
    </el-table>
    <el-pagination
      class="page"
      v-bind="pageConfig"
      @current-change="currentChange"
      @size-change="sizeChange"
    ></el-pagination>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, reactive } from 'vue'
import router from '../../router'
import emitter from 'lin/util/emitter'
import axios from '@/lin/plugin/axios'

let testInfo = ref({})

// 查看详情
let handleDetail = function (row) {
  router.replace({
    path: '/integrationcases/test',
    query: {
      ...router.currentRoute.value.query,
      case_id: row.case_id,
    },
  })
  // emitter.emit('custom-close')
}

let handleRefresh = function () {
  getDetailData()
  getTableData()
}

const pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})
let tabbleData = ref([{}])

// 获取测试详情
let getDetailData = async function () {
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/scene/result/test_list',
    data: {
      batch_id: router.currentRoute.value.query.batch_id,
      curPage: 1,
      pageSize: 100,
    },
  })

  testInfo.value = res.data.datasList[0]
}

let getTableData = async function () {
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/atom/result/test_list',
    data: {
      batch_id: router.currentRoute.value.query.batch_id,
      scene_id: router.currentRoute.value.query.scene_id,
      curPage: 1,
      pageSize: 10,
    },
  })
  tabbleData.value = res.data.datasList.map(v => ({
    ...v,
    test_result: v.test_result === 'pass' ? '成功' : '失败',
  }))
  pageConfig.total = res.data.total
}

onBeforeMount(() => {
  getDetailData()
  getTableData()
})

const currentChange = function (v) {
  pageConfig.curPage = v
  getTableData()
}

const sizeChange = function (v) {
  pageConfig.pageSize = v
  getTableData()
}
</script>
<style lang="scss" scoped>
.border {
  // border: 1px solid red;
  padding: 10px;
  background-color: #fff;
}

.page {
  float: right;
  // margin-bottom: 10px;

  button,
  li {
    background-color: transparent;
  }
}
</style>
