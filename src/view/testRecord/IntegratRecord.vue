<template lang="">
    <div class="integratRecord">
        <div class="searchPlace">
            <el-input :placeholder="请输入用例名称" v-model="search.searchData" class="input-with-select">
                <template #prepend>
                    <el-select v-model="search.select" style="width: 110px">
                        <el-option label="用例名称" value="case_title" />
                    </el-select>
                </template>
                <template #append>
                    <!-- <el-button :icon="Search"  @click="change /> -->
                    <el-button @click="change">
                        <i class="el-input__icon el-icon-search"></i>
                    </el-button>
                </template>
            </el-input>
            <el-button @click="refresh">
                <i class="el-input__icon el-icon-refresh"></i>
            </el-button>
        </div>
        <div class="tablePlace">
            <el-table class="headerTable" :data="tableData" stripe>
                <el-table-column type="index" :index="indexMethod" />
                <el-table-column :show-overflow-tooltip="true" prop="id1" label="用例编号" />
                <el-table-column :show-overflow-tooltip="true" prop="title" label="集成用例名称" />
                <el-table-column :show-overflow-tooltip="true" label="执行结果">
                    <template #default="{ row }">
                        <div :class="row.exe_result == 'pass' ? 'success' : 'fail'">
                            {{ row.exe_result == "pass" ? "成功" : "失败" }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="pass_num" label="成功数量" />
                <el-table-column :show-overflow-tooltip="true" prop="failed_num" label="失败数量" />
                <el-table-column :show-overflow-tooltip="true" prop="un_run_num" label="未执行" />
                <el-table-column :show-overflow-tooltip="true" label="环境" />
                <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="执行人员">
                    <template #default="{ row }">
                        {{ row.edit_uid == null ? "-" : row.edit_uid }}
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="update_time" label="执行时间" />
                <el-table-column :show-overflow-tooltip="true" label="操作">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="toTest(scope.row)"> 查看详情 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="paginatPlace">
            <el-pagination
                v-model:currentPage="pageConfig.currentPage"
                v-bind="{ ...pageConfig }"
                layout="total, prev, pager, next, jumper"
                @current-change="changePage"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/lin/plugin/axios'
import router from '../../router'

const router1 = useRoute()
const tableParams = router1.query
// 搜索框数据
const search = reactive({
  select: 'case_title',
  searchData: ''
})
const tableData = ref([])
const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
// 索引
const indexMethod = index => index + (pageConfig.currentPage - 1) * pageConfig.pageSize + 1

const getRecordList = async () => {
  let sendData = {}
  const { select, searchData } = search
  if (searchData === '') {
    sendData = {
      scene_id: parseInt(tableParams.id, 10),
      curPage: pageConfig.currentPage,
      pageSize: pageConfig.pageSize
    }
  } else {
    sendData = {
      scene_id: parseInt(tableParams.id, 10),
      curPage: pageConfig.currentPage,
      pageSize: pageConfig.pageSize,
      [select]: searchData
    }
  }
  const res = await axios({
    method: 'post',
    url: '/iftest/case/scene/result/test_list',
    data: sendData
  })
  if (res.code === 200) {
    const { datasList, total } = res.data
    datasList.forEach(item => {
      item.title = tableParams.case_title
      item.id1 = tableParams.id
    })
    tableData.value = datasList
    pageConfig.total = total
  }
}
// 翻页
const changePage = val => {
  pageConfig.currentPage = val
  getRecordList()
}
// 刷新
const refresh = async () => {
  search.searchData = ''
  getRecordList()
}
// 搜索
const change = async () => {
  getRecordList()
}
// 详情
const toTest = row => {
  router.push({ path: '/integrationcases/test', query: { batch_id: row.batch_id, scene_id: row.scene_id } })
}
onActivated(() => {
  getRecordList()
})
</script>
<style lang="scss" scoped>
.integratRecord {
    display: flex;
    flex-direction: column;
    padding: 10px;

    .searchPlace {
        width: 400px;
        align-self: flex-end;
        margin-bottom: 10px;

        .el-input-group {
            width: 85%;
            margin-right: 10px;
        }
    }

    .tablePlace {
        margin-bottom: 10px;
    }

    .paginatPlace {
        align-self: flex-end;
    }
}

.success {
    color: #8af039;
}

.fail {
    color: #d4001a;
}
</style>
