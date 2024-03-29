<template>
  <div class="searchForm">
    <el-descriptions :column="2" :size="size" class="descriptBox" direction="horizontal" :style="blockMargin">
      <el-descriptions-item label="集成用例名称" :span="1">{{ caseData.case_title }}</el-descriptions-item>
      <el-descriptions-item label="集成用例ID" :span="1">{{ caseData.scene_id }}</el-descriptions-item>
      <el-descriptions-item label="执行状态" :span="2">
        <!-- <span
          class="stateSpan"
          v-for="(item, index) in stateList"
          :key="index"
          :class="{ '--pass': item.label == '成功', '--fail': item.label == '失败' }"
          >{{ item.label }}：{{ item.value }}</span> -->
        <el-button
          v-for="(item, index) in stateList"
          :key="index"
          :type="item.type"
          :disabled="item.type == 'info' ? true : false"
          text
          @click="selectState(item.label)"
          >{{ item.label }}：{{ item.value }}
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item label="执行结果" :span="1">
        <span
          :class="{
            '--pass': caseData.un_run_num === 0 && caseData.failed_num === 0,
            '--fail': caseData.failed_num && caseData.failed_num > 0,
          }"
          >{{
            caseData.un_run_num && caseData.un_run_num > 0
              ? '未完成'
              : caseData.failed_num && caseData.failed_num > 0
              ? '失败'
              : '成功'
          }}</span
        >
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <div class="searchInput">
    <el-input v-model="searchData" @input="search" :placeholder="`请输入用例名称`" class="input-with-select">
      <template #prepend>
        <el-select v-model="select" style="width: 110px">
          <!-- <el-option label="批次号" value="1" /> -->
          <el-option label="用例名称" value="iface_name" />
        </el-select>
      </template>
    </el-input>

    <el-button @click="refresh"><i class="el-input__icon el-icon-refresh"></i></el-button>
  </div>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed type="index" :index="indexMethod" label="序号" width="80px"> </el-table-column>
      <el-table-column fixed prop="case_id" label="用例编号" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column fixed prop="case_title" label="集成用例名称" :show-overflow-tooltip="true"> </el-table-column>
      <!-- <el-table-column
          :show-overflow-tooltip="true"
          fixed
            prop="name"
            label="用例类型"
            >
          </el-table-column> -->
      <el-table-column prop="test_result" label="执行结果" :show-overflow-tooltip="true">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span
              style="margin-left: 10px"
              :class="{ '--pass': scope.row.test_result == 'pass', '--fail': scope.row.test_result == 'failed' }"
              >{{ scope.row.test_result == 'failed' ? '执行失败' : '执行成功' }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="case_variable" label="参数变量" :show-overflow-tooltip="true">
        <template #default="scope">
          <div>{{ scope.row.case_variable }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="执行信息" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column label="环境">
        <template #default>
          {{ planData.exe_env }}
        </template>
      </el-table-column>
      <el-table-column prop="edit_uid" label="执行人员" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="update_time" label="执行时间"> </el-table-column>

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
import { ref, unref, computed, onMounted, reactive, watch } from 'vue'
import axios from '@/lin/plugin/axios'
import { cloneDeep, throttle, debounce } from 'lodash'
import router from '@/router'
export default {
  props: ['caseData', 'planData'],
  setup(props, context) {
    const tableData = ref([])
    const select = ref('iface_name')
    const searchData = ref('')
    // 获取表格数据
    const pageConfig = ref({
      curPage: 1,
      pageSize: 10,
      scene_id: props.caseData.scene_id,
      batch_id: props.caseData.batch_id,
    })
    const totalConfig = ref(0)
    const tableParams = ref({})
    const selectType = reactive({
      ...router.currentRoute.value.query,
    })
    const stateList = ref([])
    let setStateList = function () {
      stateList.value = [
        {
          label: '全部',
          type: '',
          value: props.caseData.pass_num + props.caseData.failed_num + props.caseData.un_run_num,
        },
        { label: '成功', type: 'success', value: props.caseData.pass_num ? props.caseData.pass_num : 0 },
        { label: '失败', type: 'danger', value: props.caseData.failed_num ? props.caseData.failed_num : 0 },
        { label: '未执行', type: 'info', value: props.caseData.un_run_num ? props.caseData.un_run_num : 0 },
      ]
    }
    watch(
      () => props.caseData,
      () => {
        setStateList()
      },
    )

    const selectState = label => {
      if (label === '成功') {
        selectType.test_result = 'pass'
      } else if (label === '失败') {
        selectType.test_result = 'failed'
      } else {
        Object.keys(selectType).forEach(key => delete selectType[key])
      }
      axios({
        method: 'post',
        url: '/iftest/case/atom/result/list',
        data: {
          ...unref(tableParams),
          ...unref(pageConfig),
          ...selectType,
        },
      }).then(res => {
        const { datasList, total } = res.data
        tableData.value = datasList
        totalConfig.value = total
      })
    }
    onMounted(() => {
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
    //筛选
    const search = debounce(function () {
      tableParams.value = {}
      if (searchData.value && searchData.value.length > 0) {
        tableParams.value[select.value] = select.value == 'batch_id' ? Number(searchData.value) : searchData.value
      }
      init()
    }, 300)
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
        url: '/iftest/case/atom/result/list',
        data: {
          ...unref(tableParams),
          ...unref(pageConfig),
          ...selectType,
        },
      })

      const { datasList, curPage, pageSize, total } = res.data
      tableData.value = datasList
      pageConfig.value = {
        curPage,
        pageSize,
        scene_id: props.caseData.scene_id,
        batch_id: props.caseData.batch_id,
      }
      totalConfig.value = total
    }
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
      context.emit('refresh')
    }

    return {
      tableData,
      select,
      computedPageConfig,
      stateList,
      searchData,
      search,
      // boxData,
      indexMethod,
      openRow,
      sizeChange,
      currentChange,
      selectType,
      selectState,
      refresh,
    }
  },
}
</script>
<style lang="scss" scoped>
// .stateSpan {
//   margin: 0px 40px 0px 0px;
// }
.descriptBox {
  border: 1px solid var(--el-border-color);
}
.searchInput {
  display: flex;
  width: 350px;
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
.--fail {
  color: #d4001a;
}
.--pass {
  color: #8af039;
}
.paginatPlace {
  display: flex;
  justify-content: flex-end;
}
::v-deep .el-button--success.is-text {
  color: #8af039;
}
::v-deep .el-button--danger.is-text {
  color: #d4001a;
}
</style>
