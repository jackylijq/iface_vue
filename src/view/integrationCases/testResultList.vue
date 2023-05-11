<template>
  <div>
    <el-descriptions class="border" direction="horizontal" :column="1">
      <el-descriptions-item label="集成用例名称">{{ testInfo.case_title }}</el-descriptions-item>
      <el-descriptions-item label="执行状态">
        <span class="--pass">成功: {{ testInfo.pass_num || 0 }}</span>
        <span class="--fail" style="margin: 0 40px">失败: {{ testInfo.failed_num || 0 }}</span>
        <span>未执行:{{ testInfo.un_run_num || 0 }}</span>
        <el-button type="primary" v-show="testInfo.un_run_num != 0" @click="handleRefresh"
          >刷新</el-button
        ></el-descriptions-item
      >
      <el-descriptions-item label="执行结果">
        <span
          :class="{ '--pass': testInfo.un_run_num == 0 && testInfo.failed_num == 0, '--fail': testInfo.failed_num > 0 }"
        >
          {{ testInfo.un_run_num > 0 ? '未完成' : testInfo.failed_num > 0 ? '测试失败' : '测试成功' }}
        </span>
      </el-descriptions-item>
    </el-descriptions>

    <p style="font-size: 14px; margin: 8px 0; text-indent: 8px">执行情况详情</p>
    <el-table :data="tabbleData" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序号" width="80px"> </el-table-column>
      <el-table-column prop="case_id" label="用例编号" width="100px"> </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="case_title" label="用例标题" min-width="150px">
        <template #default="{ row }">
          <span @click="handleDetail(row)" style="color: #3963bc; cursor: pointer">{{ row.case_title }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="test_result" label="执行结果">
        <template #default="scope">
          <span :class="{ '--pass': scope.row.test_result === '成功', '--fail': scope.row.test_result == '失败' }">
            {{ scope.row.test_result }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="case_variable" label="参数变量" :show-overflow-tooltip="true">
        <template #default="scope">
          <div>{{ scope.row.case_variable }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="执行信息" :show-overflow-tooltip="true"  min-width="150px"> </el-table-column>
      <el-table-column label="环境" > 
        <template #default>
          <!-- {{ planData.exe_env }} -->
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="执行人员" />
      <el-table-column :show-overflow-tooltip="true" prop="update_time" label="执行时间" />
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
      id: row.id,
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
      curPage: pageConfig.curPage,
      pageSize: pageConfig.pageSize,
    },
  })
  tabbleData.value = res.data.datasList.map(v => ({
    ...v,
    test_result: v.test_result === 'pass' ? '成功' : v.test_result==='failed'?'失败':'',
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
