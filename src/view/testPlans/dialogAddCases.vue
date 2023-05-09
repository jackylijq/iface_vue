<template>
  <el-dialog v-model="props.value" top="8vh" title="选择用例" width="900px" @close="emits('input', false)">
    <div class="search">
      <span>项目名称:</span>
      <el-select-v2
        v-model="searchInfo.project_id"
        class="m-2"
        filterable
        clearable
        :options="productList"
        @change="changeProduct"
        style="width: 150px"
      >
        <template #default="{ item }">
          <el-tooltip effect="dark" :content="item.label" placement="top-start">
            <span>{{ item.label }}</span>
          </el-tooltip>
        </template>
      </el-select-v2>

      <span style="margin-left: 8px">分组名称:</span>
      <el-select-v2
        v-model="searchInfo.group_id"
        class="m-2"
        filterable
        clearable
        :options="groupList"
        @change="changeGroup"
        style="width: 150px"
      >
        <template #default="{ item }">
          <el-tooltip effect="dark" :content="item.label" placement="top-start">
            <span>{{ item.label }}</span>
          </el-tooltip>
        </template>
      </el-select-v2>

      <span style="margin-left: 8px">用例名称:</span>
      <el-input
        v-model="searchInfo.case_title"
        class="w-50 m-2"
        placeholder="请输入用例名称"
        style="width: 150px"
        @keyup.enter="getTableData"
      />

      <el-button class="m-2" type="primary" @click="getTableData" :icon="Search" circle />
    </div>

    <el-table
      ref="refTable"
      :data="tableData"
      stripe
      style="width: 100%"
      @select-all="handleSelection"
      @select="handleSelection"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="70" />
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

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('input', false)">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, defineProps, defineEmits, reactive, unref, nextTick, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import axios from '@/lin/plugin/axios'
import { cloneDeep } from 'lodash'
let props = defineProps({
  value: {
    type: Boolean,
    require: true,
  },
  selectedData: {},
})

let searchInfo = reactive({
  project_id: '',
  group_id: '',
  case_title: '',
})

let productList = ref([])
let getProductList = async function () {
  let res = await axios({
    method: 'POST',
    url: '/iftest/condition/group/list',
    data: { project_line_id: 1, parents_id: 0, group_type: 'scene' },
  })
  productList.value = res.data.datasList.map(v => ({
    label: v.group_name,
    value: v.id,
  }))
}

let changeProduct = function (val) {
  getGroupList(val)
  getTableData()
}

// 分组
let groupList = ref([])
let getGroupList = async function (parents_id) {
  let res = await axios({
    method: 'POST',
    url: '/iftest/condition/group/list',
    data: {
      parents_id,
      project_line_id: 1,
      group_type: 'scene',
    },
  })

  groupList.value = res.data.datasList.map(v => ({
    label: v.group_name,
    value: v.id,
  }))
}

let changeGroup = () => {
  getTableData()
}

let refTable = ref()
let tableData = ref([])
let pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})
let getTableData = async function () {
  let { curPage, pageSize } = unref(pageConfig)
  let { case_title, project_id, group_id } = unref(searchInfo)
  project_id = project_id || undefined
  group_id = group_id || undefined
  let data = {
    curPage,
    pageSize,
    case_title,
    case_group_id: group_id || project_id,
  }
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/scene/list',
    data,
  })

  tableData.value = res.data.datasList
  pageConfig.total = res.data.total

  nextTick(() => {
    tableData.value.forEach(e => {
      refTable.value.toggleRowSelection(
        e,
        props.selectedData.some(v => v.id === e.id),
      )
    })
  })
}

const currentChange = function (v) {
  pageConfig.curPage = v
  getTableData()
}

const sizeChange = function (v) {
  pageConfig.pageSize = v
  getTableData()
}

let selections = ref([])
let handleSelection = (select, row) => {
  // 需要判断出是删除还是增加
  if (!row) {
    // 全选
    if (select.length === 0) {
      // 不选当前页
      selections.value = unref(selections).filter(v => unref(tableData).some(e => e.id !== v.id))
    } else {
      selections.value.push(...unref(tableData))
    }
  } else {
    if (select.some(v => v.id === row.id)) {
      // 选中row
      selections.value.push(unref(row))
    } else {
      // 删除row
      selections.value.splice(
        unref(selections).findIndex(v => v.id === row.id),
        1,
      )
    }
  }
}

watch(
  () => props.value,
  () => {
    if (props.value === true) {
      selections.value = cloneDeep(props.selectedData)
      getProductList()
      getTableData()
    }
  },
)

let emits = defineEmits(['input', 'save'])

let submit = function () {
  emits('save', { selections: unref(selections) })
  emits('input', false)
}
</script>
<style lang="scss" scoped>
.search {
  height: 50px;

  .m-2 {
    margin-left: 8px;
  }
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
