<template>
  <el-dialog title="选择环境变量" width="800" align-center :before-close="close" >
    <comSearch v-bind="{ ...searchConfig }">
      <template #prepend>
        <el-select v-model="searchType" style="width: 100px">
          <el-option label="环境名称" value="env_name" />
          <el-option label="环境地址" value="env_host" />
        </el-select>
      </template>
    </comSearch>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="环境编码" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-radio v-model="radioValue" :label="scope.row.branch"></el-radio>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="env_name" label="环境名称" />
      <el-table-column :show-overflow-tooltip="true" prop="env_host" label="环境地址" />
    </el-table>
    <el-pagination
      style="float: right"
      v-model:currentPage="pageConfig.curPage"
      v-bind="computedPageConfig"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, unref, computed, nextTick } from 'vue'
import axios from '@/lin/plugin/axios'
import comSearch from '@/component/base/search/comSearch.vue'
import { ElMessage } from 'element-plus'

let emits = defineEmits(['update:modelValue', 'submit'])

let searchString = ref('')
let searchType = ref('env_name')

let searchConfig = {
  buttonList: [],
  query(v) {
    searchString.value = v
    tableParams.value[unref(searchType)] = v || undefined
    getListData()
  },
  refresh() {
    pageConfig.value.curPage = 1
    pageConfig.value.pageSize = 10
    tableParams.value = {}
    getListData()
  },
}
let tableData = ref([])
let tableParams = ref({
  env_name: '',
  env_host: '',
})
const pageConfig = ref({
  curPage: 1,
  pageSize: 10,
})
let totalConfig = ref(0)
const computedPageConfig = computed(() => ({
  currentPage: unref(pageConfig).curPage,
  pageSize: unref(pageConfig).pageSize,
  total: unref(totalConfig),
}))

let radioValue = ref()

async function getListData(params = {}) {
  const res = await axios({
    method: 'post',
    url: '/iftest/condition/env/list',
    data: {
      ...tableParams.value,
      ...params,
      curPage: 1,
      pageSize: 10,
      ...pageConfig.value,
    },
  })
  totalConfig.value = res.data.total
  tableData.value = res.data.datasList
  radioValue.value = res.data.datasList[0]?.branch
}
getListData()

const currentChange = function (v) {
  pageConfig.value.curPage = v
  getListData()
}

const sizeChange = function (v) {
  pageConfig.value.pageSize = v
  getListData()
}

function close() {
  emits('update:modelValue', false)
}

function submit() {
  if (unref(radioValue)) {
    emits('submit', unref(radioValue))
    nextTick(()=>close())
  } else {
    ElMessage.error('请选择一个环境')
  }
}
</script>
