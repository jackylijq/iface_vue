<!-- 测试结果 -->
<template>
  <div>
    <el-descriptions class="border" direction="horizontal" :column="1">
      <el-descriptions-item label="用例名称">kooriookami</el-descriptions-item>
      <el-descriptions-item label="执行状态">18100000000</el-descriptions-item>
      <el-descriptions-item label="执行结果">18100000000</el-descriptions-item>
    </el-descriptions>

    <p style="font-size: 14px; margin: 8px 0; text-indent: 8px">执行情况详情</p>
    <el-table :data="tabbleData" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column :show-overflow-tooltip="true" prop="iface_name" label="接口名称" width="100px" />
      <el-table-column :show-overflow-tooltip="true" prop="request_url" label="接口路径" />
      <el-table-column :show-overflow-tooltip="true" prop="case_title" label="用例名称" />
      <el-table-column :show-overflow-tooltip="true" prop="case_desc" label="用例描述" />
      <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="创建人员" />
      <el-table-column :show-overflow-tooltip="true" prop="case_status" label="用例状态" />
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
import { onMounted, ref, reactive } from 'vue'

const pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})
let tabbleData = ref([{}])

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
