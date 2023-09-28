<template>
  <el-dialog :modelValue="value" top="8vh" title="选择用例" width="900px" @close="emits('input', false)">
    <div class="search">
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

      <el-select-v2
        v-model="searchInfo.iface_id"
        clearable
        class="m-2"
        filterable
        :options="ifaceList"
        style="width: 150px"
      >
        <template #default="{ item }">
          <el-tooltip effect="dark" :content="item.label" placement="top-start">
            <span>{{ item.label }}</span>
          </el-tooltip>
        </template>
      </el-select-v2>

      <el-input
        v-model="searchInfo.case_title"
        class="w-50 m-2"
        placeholder="请输入用例名称"
        style="width: 150px"
        @keyup.enter="getTableData"
      />

      <el-button class="m-2" type="primary" @click="getTableData" :icon="Search" circle />
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column width="34">
        <template #default="{ row }">
          <el-radio v-model="selectValue" :label="row.id"></el-radio>
        </template>
      </el-table-column>
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

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('input', false)">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, defineProps, defineEmits, reactive, onMounted, unref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import axios from '@/lin/plugin/axios'
let props = defineProps({
  value: {
    type: Boolean,
    require: false,
  },
})

let searchInfo = reactive({
  project_id: '',
  group_id: '',
  iface_id: '',
  case_title: '',
})

let productList = ref([])
let getProductList = async function () {
  let res = await axios({
    method: 'POST',
    url: '/iftest/iface/project/list',
  })
  productList.value = res.data.datasList.map(v => ({
    label: v.pro_name,
    value: v.id,
  }))
}

let changeProduct = function (val) {
  searchInfo.group_id = ''
  searchInfo.iface_id = ''

  getGroupList(val)
}

// 分组
let groupList = ref([])
let getGroupList = async function (project_id) {
  let res = await axios({
    method: 'POST',
    url: '/iftest/iface/group/list',
    data: {
      project_id,
    },
  })

  groupList.value = res.data.datasList.map(v => ({
    label: v.group_name,
    value: v.id,
  }))
}
let changeGroup = function () {
  searchInfo.iface_id = ''
  getIfaceList()
}

let ifaceList = ref([])
let getIfaceList = async function () {
  let res = await axios({
    method: 'POST',
    url: '/iftest/iface/iface_list',
    data: {
      curPage: 1,
      pageSize: 100,
      group_id: searchInfo.group_id,
      project_id: searchInfo.project_id,
    },
  })
  ifaceList.value = res.data.datasList.map(v => ({
    label: v.iface_name,
    value: v.id,
  }))
}

let selectValue = ref('')
let tableData = ref([])
let pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})
let getTableData = async function () {
  let { curPage, pageSize } = unref(pageConfig)
  let { case_title, project_id, group_id, iface_id } = unref(searchInfo)
  project_id = project_id || undefined
  group_id = group_id || undefined
  iface_id = iface_id || undefined
  let data = {
    curPage,
    pageSize,
    case_title,
    project_id,
    group_id,
    iface_id,
  }
  let res = await axios({
    method: 'POST',
    url: '/iftest/case/standStom/list',
    data,
  })

  tableData.value = res.data.datasList
  pageConfig.total = res.data.total
}

const currentChange = function (v) {
  pageConfig.curPage = v
  getTableData()
}

const sizeChange = function (v) {
  pageConfig.pageSize = v
  getTableData()
}

watch(
  () => props.value,
  () => {
    if (props.value) {
      getProductList()
      getTableData()
    }
  },
)

let emits = defineEmits(['input', 'save'])

let submit = function () {
  let row = unref(tableData).find(v => v.id === unref(selectValue))
  console.log(selectValue, row);
  emits('save', { id: unref(selectValue), row })
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
