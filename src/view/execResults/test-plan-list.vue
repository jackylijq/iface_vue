<template>
  <!-- <div class="searchForm">
        <el-descriptions
            :column="2"
            :size="size"
            class="descriptBox"
            direction="horizontal"
            :style="blockMargin"
        >
            <el-descriptions-item label="批次ID" :span="2">18100000000</el-descriptions-item>
            <el-descriptions-item label="执行进度" :span="2">Suzhou</el-descriptions-item>
            <el-descriptions-item label="执行状态" :span="2">
                <span class="stateSpan" v-for="(item,index) in stateList" :key="index">{{ item.label }}：{{ item.value }}</span> 
            </el-descriptions-item>
        </el-descriptions>
    </div> -->
  <div class="searchInput">
    <el-input
      v-model="searchData"
      @input="search"
      :placeholder="`请输入${select == 'batch_id' ? '批次号' : '计划名称'}`"
      class="input-with-select"
    >
      <template #prepend>
        <el-select v-model="select" style="width: 110px">
          <el-option label="批次号" value="batch_id" />
          <el-option label="计划名称" value="plan_title" />
        </el-select>
      </template>
    </el-input>

    <el-button @click="refresh"><i class="el-input__icon el-icon-refresh"></i></el-button>
  </div>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed type="index" :index="indexMethod" label="序号" width="80px"> </el-table-column>
      <el-table-column fixed prop="batch_id" label="批次ID" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column :show-overflow-tooltip="true" fixed prop="plan_title" label="计划名称"> </el-table-column>
      <el-table-column prop="exe_result" label="执行结果" :show-overflow-tooltip="true">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span
              style="margin-left: 10px"
              :style="{ color: resultType[scope.row.exe_result] ? resultType[scope.row.exe_result].classType : '' }"
              >{{
                resultType[scope.row.exe_result] ? resultType[scope.row.exe_result].name : resultType.otherList.name
              }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pass_num" label="成功数量" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="failed_num" label="失败数量" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="un_run_num" label="未执行" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="edit_uid" label="执行人员" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="exe_env" label="执行环境" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="exe_time" label="执行时间" width="180"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button @click="openRow(scope)" type="text" size="small"> 查看详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginatPlace">
      <el-pagination
        v-model:currentPage="currentPage"
        v-bind="{ ...computedPageConfig }"
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>
<script>
import { ref, unref, computed, onMounted,onActivated } from 'vue'
import axios from '@/lin/plugin/axios'
import { cloneDeep, throttle, debounce } from 'lodash'
import router from '../../router'
export default {
  props: {},
  setup(props, context) {
    const tableData = ref([])
    const searchData = ref('')
    const select = ref('batch_id')
    // 获取表格数据
    const pageConfig = ref({
      curPage: 1,
      pageSize: 10,
    })
    const resultType = ref({
      pass: { name: '执行成功', value: 'pass', classType: '#8af039' },
      failed: { name: '执行失败', value: 'failed', classType: '#d4001a' },
      otherList: { name: '未执行', value: '', classType: '' },
    })
    const totalConfig = ref(0)
    const tableParams = ref({
      batch_id: router.currentRoute.value.query.batch_id,
      plan_id: router.currentRoute.value.query.plan_id,
    })
    onActivated(() => {
      init()
    })
    const indexMethod = function (i) {
      return i + 1 + (pageConfig.value.curPage - 1) * pageConfig.value.pageSize
    }
    const computedPageConfig = computed(() => ({
      currentPage: unref(pageConfig).curPage,
      pageSize: unref(pageConfig).pageSize,
      total: unref(totalConfig),
    }))
    const currentChange = function (v) {
      pageConfig.value.curPage = v
      init()
    }

    const sizeChange = function (v) {
      pageConfig.value.pageSize = v
      init()
    }

    const init = async function () {
      const res = await axios({
        method: 'post',
        url: '/iftest/case/plan/result/list',
        data: {
          ...unref(tableParams),
          ...unref(pageConfig),
        },
      })

      const { datasList, curPage, pageSize, total } = res.data
      tableData.value = datasList
      pageConfig.value = {
        curPage,
        pageSize,
      }
      totalConfig.value = total
    }
    //筛选
    const search = debounce(function () {
      tableParams.value = {}
      if (searchData.value && searchData.value.length > 0) {
        tableParams.value[select.value] = select.value == 'batch_id' ? Number(searchData.value) : searchData.value
      }

      init()
    }, 300)
    //展开
    const openRow = function (data) {
      context.emit('changePage', data.row)
    }

    const refresh = function () {
      searchData.value = ''
      tableParams.value = {}
      pageConfig.value.curPage = 1
      pageConfig.value.pageSize = 10
      init()
    }
    return {
      tableData,
      select,
      computedPageConfig,
      searchData,
      indexMethod,
      openRow,
      search,
      sizeChange,
      currentChange,
      resultType,
      refresh,
    }
  },
}
</script>
<style lang="scss" scoped>
.results {
  padding: 8px 12px;
}
.stateSpan {
  margin: 0px 40px 0px 0px;
}
.descriptBox {
  border: 1px solid var(--el-border-color);
}
.searchInput {
  display: flex;
  width: 400px;
  float: right;
  margin: 8px 0px;

  ::v-deep(.el-button) {
    height: 34px;
    margin-left: 4px;
  }
}
.searchForm {
  ::v-deep {
    .el-form-item__content {
      margin-bottom: 0px;
    }
    .el-form-item {
      margin-bottom: 5px !important;
    }
    .el-descriptions__body {
      padding: 8px;
    }
  }
}
.paginatPlace {
  display: flex;
  justify-content: flex-end;
}
</style>
