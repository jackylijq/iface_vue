<template>
  <el-dialog :modelValue="value" top="8vh" title="选择用例" width="900px" @close="emits('input', false)">
    <div class="search">
      <el-input
        v-model="searchInfo.cn_name"
        class="w-50 m-2"
        placeholder="请输入中文名称"
        style="width: 150px"
        @keyup.enter="getTableData"
      />

      <el-button class="m-2" type="primary" @click="getTableData" :icon="Search" circle />
    </div>

    <el-table ref="refTable" :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column :show-overflow-tooltip="true" prop="en_name" label="英文名称" />
      <el-table-column :show-overflow-tooltip="true" prop="cn_name" label="中文名称" />
      <el-table-column :show-overflow-tooltip="true" prop="variable_name" label="变量名称" />
      <el-table-column :show-overflow-tooltip="true" prop="fun_param" label="函数参数" />
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
import { ref, defineProps, defineEmits, reactive, onMounted, unref, watch, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import axios from '@/lin/plugin/axios'
let props = defineProps({
  value: {
    type: Boolean,
    require: false,
  },
  funcData: {
    type: Array,
  },
})

let searchInfo = reactive({
  cn_name: '',
})

let refTable = ref()
let tableData = ref([])
let pageConfig = reactive({
  curPage: 1,
  pageSize: 10,
  total: 0,
})
let getTableData = async function () {
  let { curPage, pageSize } = unref(pageConfig)
  let { cn_name } = unref(searchInfo)
  let data = {
    curPage,
    pageSize,
  }
  if (cn_name) {
    data.cn_name = cn_name
  }

  let res = await axios({
    method: 'POST',
    url: '/iftest/functions/varFunc-list',
    data,
  })

  tableData.value = res.data.datasList.map(v => {
    delete v.desc
    let data = {
      ...v,
      fun_param: JSON.stringify(v.fun_param),
    }
    return data
  })

  // if (tableData.value.length > 0) {
  //   // refTable.value.clearSelection()
  //   nextTick(() => {
  //     tableData.value.forEach(ele => {
  //       if (unref(props.funcData).some(v => v.id === ele.id)) {
  //         refTable.value.toggleRowSelection(ele, true)
  //       }
  //     })
  //     // props.funcData.forEach(ele => {
  //     //   refTable.value.toggleRowSelection(ele, true)
  //     // })
  //   })
  //   console.log(unref(props.funcData))
  // }

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

let selections = ref([])
let handleSelectionChange = function (val) {
  selections.value = val
}

watch(
  () => props.value,
  () => {
    if (props.value) {
      getTableData()
    }
  },
)

let emits = defineEmits(['input', 'save'])

let submit = function () {
  if (selections.value.length > 0) {
    emits('save', { selections: unref(selections) })
    emits('input', false)
  }
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
