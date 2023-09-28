<template>
  <div class="atomicRecord">
    <div class="searchPlace">
      <!-- <el-input :placeholder="请输入执行结果" v-model="search.searchData" class="input-with-select">
                <template #prepend>
                    <el-select v-model="search.select" style="width: 110px">
                        <el-option label="执行结果" value="test_result" />
                    </el-select>
                </template>
            </el-input> -->
      <el-select v-model="search.searchField" placeholder="选择搜索字段" class="nameSelect">
        <el-option
          v-for="field in searchFields"
          :key="field.value"
          :label="field.label"
          :value="field.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="search.selectedOption"
        clearable
        placeholder="选择执行状态"
        class="valueSelect"
        @change="change"
      >
        <el-option label="成功" value="pass"></el-option>
        <el-option label="失败" value="failed"></el-option>
      </el-select>
      <el-button @click="refresh">
        <i class="el-input__icon el-icon-refresh"></i>
      </el-button>
    </div>
    <div class="tablePlace">
      <el-table class="headerTable" :data="tableData" stripe>
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column :show-overflow-tooltip="true" prop="id1" width="85" label="用例编号" />
        <el-table-column :show-overflow-tooltip="true" prop="title" label="用例名称" />
        <el-table-column :show-overflow-tooltip="true" label="执行结果">
          <template #default="{ row }">
            <div :class="row.test_result == 'pass' ? 'success' : 'fail'">
              {{ row.test_result == 'pass' ? '成功' : '失败' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="res_time" label="响应时">
          <template #default="{ row }">
            {{ row.res_time == null ? '-' : row.res_time }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="case_variable" label="参数变量">
          <template #default="{ row }">
            {{ row.case_variable == null ? '-' : row.case_variable }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="message" label="执行信息">
          <template #default="{ row }">
            {{ row.message == null || row.message == '' ? '-' : row.message }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="环境" />
        <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="执行人员">
          <template #default="{ row }">
            {{ row.edit_uid == null ? '-' : row.edit_uid }}
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
const searchFields = reactive([{ label: '执行结果', value: 'test_result' }])
const search = reactive({
  searchField: 'test_result',
  selectedOption: '',
})

const change = async () => {
  getRecordList()
}

// 索引
const indexMethod = index => index + (pageConfig.currentPage - 1) * pageConfig.pageSize + 1

// 表格
const tableData = ref([])
const getRecordList = async () => {
  const { searchField, selectedOption } = search
  let sendData = {}
  if (selectedOption === '') {
    sendData = {
      case_id: parseInt(tableParams.id, 10),
      curPage: pageConfig.currentPage,
      pageSize: pageConfig.pageSize,
    }
  } else {
    sendData = {
      case_id: parseInt(tableParams.id, 10),
      curPage: pageConfig.currentPage,
      pageSize: pageConfig.pageSize,
      [searchField]: selectedOption,
    }
  }
  const res = await axios({
    method: 'post',
    url: '/iftest/case/atom/result/test_list',
    data: sendData,
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
// 刷新
const refresh = async () => {
  search.selectedOption = ''
  getRecordList()
}
const changePage = val => {
  pageConfig.currentPage = val
  getRecordList()
}

onActivated(() => {
  getRecordList()
})

const toTest = row => {
  router.push({ path: '/integrationcases/test', query: { batch_id: row.batch_id, case_id: row.case_id } })
}

const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})
</script>
<style lang="scss" scoped>
.atomicRecord {
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
.nameSelect {
  width: 110px;
  // margin-right: -1px;
  :deep(.el-input__wrapper) {
    border-radius: 3px 0px 0px 3px;
  }
  :deep(.el-input__inner) {
    border: 0px;
  }
}
.valueSelect {
  margin-right: 10px;
  :deep(.el-input__wrapper) {
    border-radius: 0px 3px 3px 0px;
  }
}

.success {
  color: #8af039;
}
.fail {
  color: #d4001a;
}
</style>
