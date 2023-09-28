<template>
  <el-dialog v-model="props.value" top="8vh" title="选择计划" width="900px" @close="emits('input', false)">
    <div class="addPlanTable">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column width="34">
          <template #default="{ row }">
            <el-radio v-model="selectValue" :label="row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" prop="id" label="计划id" width="100px" />
        <el-table-column :show-overflow-tooltip="true" prop="plan_title" label="计划名称" min-width="150px" />
        <el-table-column :show-overflow-tooltip="true" prop="scene_case_num" label="用例数量" />
        <el-table-column :show-overflow-tooltip="true" prop="edit_uid" label="更新人员" />
        <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间" width="250px" />
      </el-table>

      <el-pagination class="page" v-bind="pageConfig" @current-change="currentChange"></el-pagination>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('input', false)">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { watch, defineProps, reactive, ref, defineEmits } from 'vue'
import axios from '@/lin/plugin/axios'

const props = defineProps({
  value: {
    type: Boolean,
  },
})

const pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})

const tableData = ref([])

let emits = defineEmits(['input', 'save'])

// onActivated(() => {
//   getTableData()
// })

watch(
  () => props.value,
  () => {
    if (props.value === true) {
      getTableData()
    }
  },
)
// const selection = ref([])
// const handleSelectionChange = select => {
//   selection.value = select
// }

const getTableData = async () => {
  const { curPage, pageSize } = pageConfig
  const res = await axios({
    method: 'POST',
    url: '/iftest/case/plan/list',
    data: {
      curPage,
      pageSize,
    },
  })
  if (res.code === 200) {
    const { datasList, total } = res.data
    tableData.value = datasList
    pageConfig.total = total
  }
}
const currentChange = v => {
  pageConfig.curPage = v
  getTableData()
}

const sizeChange = v => {
  pageConfig.pageSize = v
  getTableData()
}

const selectValue = ref('')
const submit = async () => {
  let row = tableData.value.find(v => v.id === selectValue.value)
  const { scene_case_list } = row
  let selectList = []
  if (scene_case_list !== '' && typeof scene_case_list !== 'number') {
    console.log(scene_case_list)
    selectList = scene_case_list.split(',').map(item => item)
  } else if (typeof scene_case_list === 'number') {
    selectList = [scene_case_list]
  }
  const res = await axios({
    method: 'POST',
    url: '/iftest/case/scene/list',
    data: {
      curPage: 1,
      id: selectList,
      pageSize: selectList.length,
    },
  })
  if (res.code === 200) {
    const { datasList } = res.data
    emits('save', datasList)
    emits('input', false)
  }
}
</script>
<style lang="scss" scoped>
.page {
  float: right;
  // margin-bottom: 10px;

  button,
  li {
    background-color: transparent;
  }
}
</style>
